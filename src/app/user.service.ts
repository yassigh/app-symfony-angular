import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // URL de l'API
  private currentUserRole: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  private currentUserToken: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  // Connexion d'un utilisateur
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Stocker le rôle et le token après connexion
        this.setUserRole(response.role);
        this.setToken(response.token); // Si le backend retourne un token
      }),
      catchError(error => {
        console.error('Error during login', error);
        return throwError(error); 
      })
    );
  }


  getUserRole(): string | null {
    return this.currentUserRole.value;
  }

  
  setUserRole(role: string): void {
    this.currentUserRole.next(role);
  }

  isLoggedIn(): boolean {
    return this.currentUserRole.value !== null;
  }

  logout(): void {
    this.currentUserRole.next(null);
    this.currentUserToken.next(null);
  }

 
  
  setToken(token: string): void {
    this.currentUserToken.next(token);
  }

  getToken(): string | null {
    return this.currentUserToken.value;
  }
}
