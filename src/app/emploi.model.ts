import { Classe } from "./classe.model";

export interface Emploi {
  id: number;           
  titre: string; 
  nomEnseignant:string;      
  startTime: Date;     
  endTime: Date;      
  salle: string;       
  jour: string;        
  classe: number | Classe | null;  
  nomClasse?: string;
  
}
