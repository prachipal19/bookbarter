import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExchangeRequestsService {
  private apiUrl = 'https://ill-rose-wombat-fez.cyclic.app/'; // Update this with your actual API URL

  constructor(private http: HttpClient) { }

  getExchangeRequests(): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication failed');
    }
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<any>(`${this.apiUrl}/api/exchange-requests`, { headers });
  }

  updateExchangeRequestStatus(requestId: string, action: string, bookId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication failed');
    }
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.put<any>(
      `${this.apiUrl}/api/update-exchange-request/${requestId}`,
      { status: action, bookId },
      { headers }
    );
  }
  
}
