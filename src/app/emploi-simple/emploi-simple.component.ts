import { Component } from '@angular/core';
import { Emploi } from '../emploi.model';
import { Classe } from '../classe.model';
import { EmploiService } from '../emploi.service';
import { ClasseService } from '../classe.service';

@Component({
  selector: 'app-emploi-simple',
  templateUrl: './emploi-simple.component.html',
  styleUrls: ['./emploi-simple.component.css']
})
export class EmploiSimpleComponent {
  // Variables pour les filtres
  filters = {
    classe: '',
    nomEnseignant: '', 
    titre: '',
    salle: ''
  };

  // Données des emplois
  emplois: Emploi[] = [];
  classes: Classe[] = [];
  emploisGroupedByClasse: { classe: string, emplois: Emploi[] }[] = [];

  emploisGroupedByJour: { jour: string, emplois: Emploi[] }[] = [];  

  constructor(
    private emploiService: EmploiService,
    private classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadEmplois();
  }

  groupEmploisByJour(): void {
    const grouped: { [key: string]: { jour: string, emplois: Emploi[] } } = {};

    this.emplois.forEach(emploi => {
      const jour = emploi.jour ? emploi.jour : 'Non spécifié';  // Default to 'Non spécifié' if no day is specified

      if (!grouped[jour]) {
        grouped[jour] = { jour: jour, emplois: [] };
      }
      grouped[jour].emplois.push(emploi);
    });

    // Convert grouped data into a list
    this.emploisGroupedByJour = Object.values(grouped);
  }

  loadClasses(): void {
    this.classeService.getClasses().subscribe(
      (classes: Classe[]) => {
        this.classes = classes;
        console.log('Classes chargées:', this.classes);
  
        // Assignez la classe aux emplois
        this.emplois.forEach(emploi => {
          if (emploi.classe && typeof emploi.classe === 'number') {
            const foundClasse = this.classes.find(classe => classe.id === emploi.classe);
            emploi.classe = foundClasse || null; // Assign null if not found
          }
        });
        
      },
      (error) => {
        console.error('Erreur lors du chargement des classes', error);
      }
    );
  }
  
  isClasse(emploi: any): boolean {
    // Vérifier que emploi.classe est un objet et n'est pas un nombre
    return emploi.classe && typeof emploi.classe !== 'number' && emploi.classe.nom;
  }
  
  
  isNumber(emploi: Emploi): boolean {
    return typeof emploi.classe === 'number';
  }
  
  

  
  loadEmplois(): void {
    this.emploiService.getEmplois(this.filters).subscribe({
      next: (data) => {
        if (data && typeof data === 'object') {
          this.emplois = Object.values(data).flat();
  
          // Assurez-vous que les classes sont associées correctement
          this.emplois.forEach(emploi => {
            if (emploi.classe && typeof emploi.classe === 'number') {
              const foundClasse = this.classes.find(classe => classe.id === emploi.classe);
              emploi.classe = foundClasse ? foundClasse : null;
            }
          });
  
          this.groupEmploisByJour(); // Appel pour regrouper par jour
        } else {
          console.error("La réponse de l'API n'est pas un objet attendu", data);
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des emplois :", err);
      }
    });
  }
  
  applyFilters(): void {
    this.loadEmplois(); 
  }

  deleteEmploi(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet emploi?')) {
      this.emploiService.deleteEmploi(id).subscribe(() => {
        this.loadEmplois(); 
      }, (err) => {
        console.error("Erreur lors de la suppression de l'emploi :", err);
      });
    }
  }
}
