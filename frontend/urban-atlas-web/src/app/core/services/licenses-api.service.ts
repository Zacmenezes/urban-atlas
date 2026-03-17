import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ConstructionLicense } from '../../shared/models';

interface ConstructionLicenseApiResponse {
  id: number;
  process_number: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
}

@Injectable({ providedIn: 'root' })
export class LicensesApiService {
  private readonly http = inject(HttpClient);

  list(params: { bbox: string; zoom: number }): Observable<ConstructionLicense[]> {
    const queryParams = new HttpParams()
      .set('bbox', params.bbox)
      .set('zoom', String(params.zoom));

    return this.http.get<ConstructionLicenseApiResponse[]>('/licenses', { params: queryParams }).pipe(
      map((rows) =>
        rows
          .filter((row) => row.latitude !== null && row.longitude !== null)
          .map((row) => ({
            id: row.id,
            processNumber: row.process_number ?? 'N/A',
            address: row.address ?? 'Address not informed',
            latitude: row.latitude as number,
            longitude: row.longitude as number
          }))
      )
    );
  }
}

