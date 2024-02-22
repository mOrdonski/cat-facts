import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from '../config';
import { Fact } from '../interfaces/fact.interface';

@Injectable({
  providedIn: 'root',
})
export class FactService {
  private readonly http = inject(HttpClient);

  apiUrl: string = config.factApiUrl;

  getMany(size: number): Observable<Fact> {
    return this.http.get<Fact>(`${this.apiUrl}?count=${size}`);
  }

  getOne(): Observable<Fact> {
    return this.http.get<Fact>(`${this.apiUrl}`);
  }
}
