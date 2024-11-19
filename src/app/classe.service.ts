import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe } from './classe.model';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {
  private apiUrl = 'http://localhost:8000/api/emploi'; 

  constructor(private http: HttpClient) {}

  getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(`${this.apiUrl}/classes`); // Ajustez cette ligne selon la route définie ci-dessus
}

}
