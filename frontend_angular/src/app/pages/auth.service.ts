import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel, SignUpModel } from './login/login.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ill-rose-wombat-fez.cyclic.app/api'; 

  constructor(private http: HttpClient) { }

  register(user: SignUpModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: LoginModel): Observable<any> {
    
    return this.http.post(`${this.apiUrl}/login`, user);
  }
}
