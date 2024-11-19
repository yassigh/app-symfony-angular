import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emploi } from './emploi.model';

@Injectable({
  providedIn: 'root'
})
export class EmploiService {
  private apiUrl = 'http://localhost:8000/api/emploi'; // URL de base de l'API Symfony

  constructor(private http: HttpClient) {}

  // recuperer tous les emplois avec filtres
  getEmplois(filters: any): Observable<any[]> {
    // Construire l'URL avec les parametres de filtre
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<Emploi[]>(`${this.apiUrl}/`, { params });
  }
  
  // Methode pour recuperer un emploi par son ID
  getEmploiById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateEmploi(id: number, emploi: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/edit`, emploi);
}
createEmploi(emploi: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/new`, emploi);
}

getClasses(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/classes`);
}

// Modifier un emploi
editEmploi(id: number, emploi: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}/edit`, emploi);
}


  deleteEmploi(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
  
}
