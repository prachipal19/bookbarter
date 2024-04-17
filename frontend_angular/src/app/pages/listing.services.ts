import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'https://ill-rose-wombat-fez.cyclic.app/api/add-listing';
  private apiUrlUpdate = 'https://ill-rose-wombat-fez.cyclic.app/api/update-user-listing';
  private apiUrlUserListings = 'https://ill-rose-wombat-fez.cyclic.app/api/user-listings'; 
  private apiUrlDelete = 'https://ill-rose-wombat-fez.cyclic.app/api/delete-user-listing'; 


  constructor(private http: HttpClient) { }

  addBook(bookData: Book, token: string): Observable<Book> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.post<Book>(this.apiUrl, bookData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  updateBook(isbn: string, bookData: Book, token: string): Observable<Book> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.put<Book>(`${this.apiUrlUpdate}/${isbn}`, bookData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserListings(token: string): Observable<Book[]> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get<Book[]>(this.apiUrlUserListings, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

deleteUserListing(isbn: string, token: string): Observable<void> {
  const headers = new HttpHeaders().set('Authorization', token);
  return this.http.delete<void>(`${this.apiUrlDelete}/${isbn}`, { headers })
    .pipe(
      catchError(this.handleError)
    );
}


  private handleError(error: any): Observable<any> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
