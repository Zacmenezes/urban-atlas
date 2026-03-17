import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardBodyComponent, CardComponent, CardHeaderComponent, TableDirective } from '@coreui/angular';
import { catchError, debounceTime, distinctUntilChanged, map, merge, Observable, of, scan, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { LicenseListResult, LicenseService, LicenseStatusFilter } from '../../core/services/license.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { License } from '../../shared/models/license.model';

@Component({
  template: `
    <app-page-title
      title="Licenses"
      subtitle="Construction licenses prepared for list management, filters, and API-driven pagination."
    />

    <c-card>
      <c-card-header>Recent license records</c-card-header>
      <c-card-body>
        @if (vm$ | async; as vm) {
        <form class="row g-3 mb-3" [formGroup]="filtersForm">
          <div class="col-12 col-md-4">
            <label for="processNumber" class="form-label">License (Process)</label>
            <input
              id="processNumber"
              type="text"
              class="form-control"
              formControlName="processNumber"
              placeholder="Search process number"
            />
          </div>
          <div class="col-12 col-md-4">
            <label for="licenseNumber" class="form-label">License Number</label>
            <input
              id="licenseNumber"
              type="text"
              class="form-control"
              formControlName="licenseNumber"
              placeholder="Search license number"
            />
          </div>
          <div class="col-12 col-md-4">
            <label for="builder" class="form-label">Builder</label>
            <input
              id="builder"
              type="text"
              class="form-control"
              formControlName="builder"
              placeholder="Search builder"
            />
          </div>
          <div class="col-12 col-md-3">
            <label for="startDate" class="form-label">Issue Date From</label>
            <input
              id="startDate"
              type="date"
              class="form-control"
              formControlName="startDate"
            />
          </div>
          <div class="col-12 col-md-3">
            <label for="endDate" class="form-label">Issue Date To</label>
            <input
              id="endDate"
              type="date"
              class="form-control"
              formControlName="endDate"
            />
          </div>
          <div class="col-12 col-md-3">
            <label for="status" class="form-label">Status</label>
            <select id="status" class="form-select" formControlName="status">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div class="col-12 col-md-3">
            <label for="pageSize" class="form-label">Page Size</label>
            <select id="pageSize" class="form-select" [value]="vm.pageSize" (change)="onPageSizeChange($any($event.target).value)">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div class="col-12 d-flex justify-content-end">
            <button type="button" class="btn btn-primary" [disabled]="vm.isLoading" (click)="applySearch()">Search</button>
          </div>
        </form>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-body-secondary">
            Showing {{ vm.licenses.length }} of {{ vm.totalDisplay }} licenses
          </span>
          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-outline-secondary btn-sm" [disabled]="vm.isLoading || vm.page <= 1" (click)="goToPreviousPage(vm.page)">
              Previous
            </button>
            <span class="small">Page {{ vm.page }} of {{ vm.totalPages }}</span>
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              [disabled]="vm.isLoading || vm.page >= vm.totalPages"
              (click)="goToNextPage(vm.page, vm.totalPages)"
            >
              Next
            </button>
          </div>
        </div>

        <table cTable [hover]="true" [striped]="true">
          <thead>
          <tr>
            <th scope="col">License (Process)</th>
            <th scope="col">License Number</th>
            <th scope="col">Address</th>
            <th scope="col">Builder</th>
            <th scope="col">Area (m²)</th>
            <th scope="col">Issue Date</th>
            <th scope="col">Expiration Date</th>
            <th scope="col">Status</th>
          </tr>
          </thead>
          <tbody>
            @if (vm.isLoading) {
              <tr>
                <td colspan="8" class="text-center py-4">Loading licenses...</td>
              </tr>
            } @else if (vm.licenses.length === 0) {
              <tr>
                <td colspan="8" class="text-center py-4">No licenses found.</td>
              </tr>
            } @else {
              <tr *ngFor="let license of licenses$ | async; trackBy: trackById">
                <td>{{ license.processNumber }}</td>
                <td>{{ license.licenseNumber }}</td>
                <td>{{ license.address }}</td>
                <td>{{ license.builder }}</td>
                <td>{{ license.displayArea }}</td>
                <td>{{ license.displayIssueDate }}</td>
                <td>{{ license.displayExpirationDate }}</td>
                <td>
                  <span [class]="license.displayBadgeClass">{{ license.status }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
        }
      </c-card-body>
    </c-card>
  `,
  imports: [PageTitleComponent, CardComponent, CardHeaderComponent, CardBodyComponent, TableDirective, ReactiveFormsModule, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicensesComponent {
  private readonly licenseService = inject(LicenseService);
  private readonly setPage = new Subject<number>();
  private readonly setPageSize = new Subject<number>();
  private readonly refresh = new Subject<void>();

  readonly filtersForm = new FormGroup({
    processNumber: new FormControl('', { nonNullable: true }),
    licenseNumber: new FormControl('', { nonNullable: true }),
    builder: new FormControl('', { nonNullable: true }),
    startDate: new FormControl('', { nonNullable: true }),
    endDate: new FormControl('', { nonNullable: true }),
    status: new FormControl<LicenseStatusFilter>('all', { nonNullable: true })
  });

  private readonly filters$ = this.filtersForm.valueChanges.pipe(
    startWith(this.filtersForm.getRawValue()),
    debounceTime(300),
    map(() => this.normalizeFilters(this.filtersForm.getRawValue())),
    distinctUntilChanged((previous, current) => this.sameFilters(previous, current)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly queryState$ = merge(
    this.filters$.pipe(map((filters) => ({ type: 'filters' as const, filters }))),
    this.setPage.pipe(map((page) => ({ type: 'page' as const, page }))),
    this.setPageSize.pipe(map((pageSize) => ({ type: 'pageSize' as const, pageSize }))),
    this.refresh.pipe(map(() => ({ type: 'refresh' as const })))
  ).pipe(
    scan((state, action): QueryState => {
      if (action.type === 'filters') {
        return {
          ...state,
          filters: action.filters,
          page: 1
        };
      }

      if (action.type === 'page') {
        return {
          ...state,
          page: Math.max(1, action.page)
        };
      }

      if (action.type === 'pageSize') {
        return {
          ...state,
          pageSize: action.pageSize,
          page: 1
        };
      }

      return {
        ...state,
        refreshToken: state.refreshToken + 1
      };
    }, {
      filters: this.normalizeFilters(this.filtersForm.getRawValue()),
      page: 1,
      pageSize: 10,
      refreshToken: 0
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly vm$: Observable<LicensesViewModel> = this.queryState$.pipe(
    switchMap((state) =>
      this.licenseService
        .getLicenses({
          page: state.page,
          pageSize: state.pageSize,
          processNumber: state.filters.processNumber,
          licenseNumber: state.filters.licenseNumber,
          builder: state.filters.builder,
          startDate: state.filters.startDate || undefined,
          endDate: state.filters.endDate || undefined,
          status: state.filters.status
        })
        .pipe(
          map((result) => this.toViewModel(result, state.page, state.pageSize, false)),
          catchError(() =>
            of(
              this.toViewModel(
                {
                  items: [],
                  total: 0,
                  page: state.page,
                  pageSize: state.pageSize
                },
                state.page,
                state.pageSize,
                false
              )
            )
          ),
          startWith(this.toLoadingViewModel(state.page, state.pageSize))
        )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly licenses$ = this.vm$.pipe(
    map((viewModel) => viewModel.licenses),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private readonly dateFormatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  applySearch(): void {
    this.setPage.next(1);
    this.refresh.next();
  }

  onPageSizeChange(value: string): void {
    const pageSize = Number(value);
    if (![10, 20, 50].includes(pageSize)) {
      return;
    }

    this.setPageSize.next(pageSize);
  }

  goToPreviousPage(page: number): void {
    if (page <= 1) {
      return;
    }

    this.setPage.next(page - 1);
  }

  goToNextPage(page: number, totalPages: number): void {
    if (page >= totalPages) {
      return;
    }

    this.setPage.next(page + 1);
  }

  trackById(index: number, item: LicenseTableRow): number {
    return item.id;
  }

  formatDate(value: string | null): string {
    if (!value) {
      return '-';
    }

    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }

    return this.dateFormatter.format(date);
  }

  formatArea(value: number | null): string {
    return value === null ? '-' : value.toFixed(2);
  }

  private normalizeFilters(filters: FiltersFormValue): FiltersFormValue {
    return {
      processNumber: filters.processNumber,
      licenseNumber: filters.licenseNumber,
      builder: filters.builder,
      startDate: filters.startDate,
      endDate: filters.endDate,
      status: filters.status
    };
  }

  private sameFilters(previous: FiltersFormValue, current: FiltersFormValue): boolean {
    return previous.processNumber === current.processNumber
      && previous.licenseNumber === current.licenseNumber
      && previous.builder === current.builder
      && previous.startDate === current.startDate
      && previous.endDate === current.endDate
      && previous.status === current.status;
  }

  private toLoadingViewModel(page: number, pageSize: number): LicensesViewModel {
    return {
      licenses: [],
      totalDisplay: '0',
      page,
      pageSize,
      totalPages: 1,
      isLoading: true
    };
  }

  private toViewModel(result: LicenseListResult, page: number, pageSize: number, isLoading: boolean): LicensesViewModel {
    return {
      licenses: result.items.map((item) => this.toTableRow(item)),
      totalDisplay: result.total.toLocaleString(),
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
      isLoading
    };
  }

  private toTableRow(license: License): LicenseTableRow {
    return {
      ...license,
      displayArea: this.formatArea(license.areaM2),
      displayIssueDate: this.formatDate(license.issueDate),
      displayExpirationDate: this.formatDate(license.expirationDate),
      displayBadgeClass: `badge ${this.badgeClass(license.status)}`
    };
  }

  private badgeClass(status: License['status']): string {
    if (status === 'active') {
      return 'bg-success';
    }

    if (status === 'expired') {
      return 'bg-danger';
    }

    return 'bg-secondary';
  }
}

interface LicenseTableRow extends License {
  displayArea: string;
  displayIssueDate: string;
  displayExpirationDate: string;
  displayBadgeClass: string;
}

interface FiltersFormValue {
  processNumber: string;
  licenseNumber: string;
  builder: string;
  startDate: string;
  endDate: string;
  status: LicenseStatusFilter;
}

interface QueryState {
  filters: FiltersFormValue;
  page: number;
  pageSize: number;
  refreshToken: number;
}

interface LicensesViewModel {
  licenses: LicenseTableRow[];
  totalDisplay: string;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
}

