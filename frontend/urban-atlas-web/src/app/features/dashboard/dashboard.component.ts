import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, RowComponent } from '@coreui/angular';
import { catchError, forkJoin, map, Observable, of, shareReplay, startWith } from 'rxjs';
import { LicenseService, LicenseStatusFilter } from '../../core/services/license.service';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';

@Component({
  template: `
    <app-page-title
      title="UrbanAtlas Dashboard"
      subtitle="Track construction licensing activity and quickly jump to the map and license registry."
    />

    @if (vm$ | async; as vm) {
    <c-row class="g-4">
      <c-col md="6">
        <c-card>
          <c-card-header>Active licenses</c-card-header>
          <c-card-body>
            <p class="display-6 mb-2">{{ vm.activeLicensesDisplay }}</p>
            <a [routerLink]="['/licenses']">View license list</a>
          </c-card-body>
        </c-card>
      </c-col>
      <c-col md="6">
        <c-card>
          <c-card-header>Map markers</c-card-header>
          <c-card-body>
            <p class="display-6 mb-2">{{ vm.totalLicensesDisplay }}</p>
            <a [routerLink]="['/map']">Open map view</a>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
    }
  `,
  imports: [AsyncPipe, PageTitleComponent, RowComponent, ColComponent, CardComponent, CardHeaderComponent, CardBodyComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly licenseService = inject(LicenseService);

  readonly vm$: Observable<DashboardViewModel> = forkJoin({
    activeLicenses: this.getLicenseCount('active'),
    totalLicenses: this.getLicenseCount('all')
  }).pipe(
    map(({ activeLicenses, totalLicenses }) => ({
      activeLicensesDisplay: activeLicenses.toLocaleString(),
      totalLicensesDisplay: totalLicenses.toLocaleString()
    })),
    catchError(() => of(this.toViewModel('-', '-'))),
    startWith(this.toViewModel('...', '...')),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  private getLicenseCount(status: LicenseStatusFilter): Observable<number> {
    return this.licenseService.getLicenses({
      page: 1,
      pageSize: 1,
      status
    }).pipe(
      map((result) => result.total)
    );
  }

  private toViewModel(activeLicensesDisplay: string, totalLicensesDisplay: string): DashboardViewModel {
    return {
      activeLicensesDisplay,
      totalLicensesDisplay
    };
  }
}

interface DashboardViewModel {
  activeLicensesDisplay: string;
  totalLicensesDisplay: string;
}


