import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { License } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class LicensesApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<License[]> {
    return this.http.get<License[]>('/licenses');
  }
}

