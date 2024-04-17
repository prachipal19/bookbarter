// listings.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingsService {
  apiUrl = 'https://ill-rose-wombat-fez.cyclic.app/';

  constructor(private http: HttpClient) { }

  getAllListings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/all-listings`);
  }

  fetchUserDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/user/${userId}`);
  }

  sendExchangeRequest(receiverEmail: string, receiverId: string, bookId: string, token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/send-exchange-request`, {
      receiverEmail,
      receiverId,
      bookId
    }, {
      headers: {
        'Authorization': `${token}`
      }
    });
  }
}
