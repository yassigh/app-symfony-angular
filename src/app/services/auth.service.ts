import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerUrl = 'http://localhost:8000/api/register';
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  register(user: { email: string; nom: string; prenom: string; plainPassword: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }
  googleLogin(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google-login`, { idToken });
  }
  
  
  login(credentials: { email: string; plainPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}