import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from './book.model'; 

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://ill-rose-wombat-fez.cyclic.app/api/books'; 

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }
}
