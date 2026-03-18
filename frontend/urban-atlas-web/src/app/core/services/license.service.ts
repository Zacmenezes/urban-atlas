import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { License } from '../../shared/models';

export type LicenseStatusFilter = 'all' | License['status'];

export interface LicenseQueryParams {
  page: number;
  pageSize: number;
  processNumber?: string;
  licenseNumber?: string;
  builder?: string;
  startDate?: string;
  endDate?: string;
  status?: LicenseStatusFilter;
}

export interface LicenseListResult {
  items: License[];
  total: number;
  page: number;
  pageSize: number;
}

interface LicenseApiResponse {
  id: number;
  process_number: string | null;
  license_number?: string | null;
  address: string | null;
  builder: string | null;
  area_m2: number | null;
  issue_date: string | null;
  expiration_date: string | null;
}

interface LicenseListApiResponse {
  items: LicenseApiResponse[];
  total: number;
  page: number;
  page_size: number;
}

@Injectable({ providedIn: 'root' })
export class LicenseService {
  private readonly http = inject(HttpClient);

  getLicenses(params: LicenseQueryParams): Observable<LicenseListResult> {
    let queryParams = new HttpParams()
      .set('page', String(params.page))
      .set('page_size', String(params.pageSize));

    if (params.processNumber?.trim()) {
      queryParams = queryParams.set('process_number', params.processNumber.trim());
    }

    if (params.licenseNumber?.trim()) {
      queryParams = queryParams.set('license_number', params.licenseNumber.trim());
    }

    if (params.builder?.trim()) {
      queryParams = queryParams.set('builder', params.builder.trim());
    }

    if (params.startDate) {
      queryParams = queryParams.set('start_date', params.startDate);
    }

    if (params.endDate) {
      queryParams = queryParams.set('end_date', params.endDate);
    }

    if (params.status && params.status !== 'all') {
      queryParams = queryParams.set('status', params.status);
    }

    return this.http.get<LicenseListApiResponse>('/licenses', { params: queryParams }).pipe(
      map((response) => ({
        items: response.items.map((row) => this.toLicense(row)),
        total: response.total,
        page: response.page,
        pageSize: response.page_size
      }))
    );
  }

  private toLicense(row: LicenseApiResponse): License {
    return {
      id: row.id,
      processNumber: row.process_number ?? 'N/A',
      licenseNumber: row.license_number ?? 'N/A',
      address: row.address ?? 'Address not informed',
      builder: row.builder ?? 'Builder not informed',
      areaM2: row.area_m2,
      issueDate: row.issue_date,
      expirationDate: row.expiration_date,
      status: this.resolveStatus(row.expiration_date)
    };
  }

  private resolveStatus(expirationDate: string | null): License['status'] {
    if (!expirationDate) {
      return 'unknown';
    }

    const expiration = new Date(`${expirationDate}T00:00:00`);
    if (Number.isNaN(expiration.getTime())) {
      return 'unknown';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return expiration >= today ? 'active' : 'expired';
  }
}

