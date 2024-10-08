import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ESGDataService {
  private apiUrl = 'http://localhost:8081/api/esg';

  constructor(private http: HttpClient) {}

  // Add this method to validate if a company exists
  validateCompany(companyName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validate/${companyName}`);
  }

  getESGData(companyName: string): Observable<{ environmentalScore: number; socialScore: number; governanceScore: number }> {
    return this.http.get<{ environmentalScore: number; socialScore: number; governanceScore: number }>(
      `${this.apiUrl}/${companyName}`
    );
  }

  getAllCompanies(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/companies`);
  }
}