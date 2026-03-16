import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  list(): Observable<ConstructionLicense[]> {
    return this.http.get<ConstructionLicenseApiResponse[]>('/licenses').pipe(
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

