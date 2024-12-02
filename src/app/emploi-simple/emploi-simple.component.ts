import { Component } from '@angular/core';
import { Emploi } from '../emploi.model';
import { Classe } from '../classe.model';
import { EmploiService } from '../emploi.service';
import { ClasseService } from '../classe.service';
import { ToastrService } from 'ngx-toastr';

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

  // Donneees des emplois
  emplois: Emploi[] = [];
  classes: Classe[] = [];
  emploisGroupedByClasse: { classe: string, emplois: Emploi[] }[] = [];

  emploisGroupedByJour: { jour: string, emplois: Emploi[] }[] = [];  

  constructor(
    private emploiService: EmploiService,
    private classeService: ClasseService, private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadEmplois();
   
  }

  groupEmploisByJour(): void {
    const grouped: { [key: string]: { jour: string, emplois: Emploi[] } } = {};

    this.emplois.forEach(emploi => {
      const jour = emploi.jour ? emploi.jour : 'Non spécifié';  

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
  
        // Assigner la classe aux emplois
        this.emplois.forEach(emploi => {
          if (typeof emploi.classe === 'number') {
            // Rechercher la classe correspondante si emploi.classe est un identifiant
            const foundClasse = this.classes.find(classe => classe.id === emploi.classe);
            emploi.classe = foundClasse || null; 
          } 
        });
      },
      (error) => {
        console.error('Erreur lors du chargement des classes', error);
      }
    );
  }
  
  loadEmplois(): void {
    this.emploiService.getEmplois(this.filters).subscribe({
      next: (data) => {
        if (data && typeof data === 'object') {
          this.emplois = Object.values(data).flat();
  
          // Pré-traiter les emplois pour garantir que classe est un objet ou null
          this.emplois.forEach(emploi => {
            if (typeof emploi.classe === 'number') {
              const foundClasse = this.classes.find(classe => classe.id === emploi.classe);
              emploi.classe = foundClasse || null;
            } else if (emploi.classe && typeof emploi.classe === 'object') {
              console.log(`Classe déjà associée: ${emploi.classe.nom}`);
            }
          });
  
          this.groupEmploisByJour();
          this.checkUpcomingCourses();
        } else {
          console.error("La réponse de l'API n'est pas un objet attendu", data);
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des emplois :", err);
      }
    });
  }
  
checkUpcomingCourses(): void {
  const now = new Date();

  if (!this.emplois || this.emplois.length === 0) {
    console.warn('Aucun emploi trouvé.');
    return;
  }

  this.emplois.forEach(emploi => {
    let startTime: Date;

    // Verifier si startTime est un timestamp numerique ou une chaîne
    if (typeof emploi.startTime === 'string' || typeof emploi.startTime === 'number') {
      startTime = new Date(emploi.startTime);
    } else {
      console.warn(`startTime invalide pour l'emploi: ${emploi.titre}`);
      return;
    }

    // Verifier si startTime est une date valide
    if (isNaN(startTime.getTime())) {
      console.warn(`startTime invalide pour l'emploi: ${emploi.titre}`);
      return; // Ignorer cet emploi si startTime est invalide
    }

    const timeDiff = (now.getTime()-startTime.getTime()) ;
    const minutesDiff = Math.floor(timeDiff / (1000 * 60*3600*60));
    this.toastr.info(`Le cours ${emploi.titre} commence dans ${minutesDiff} minutes`);
    // Verifier si le cours commence dans moins de 5 minutes
    if (timeDiff > 0 && timeDiff <= 5 * 60 * 10000) {
      this.toastr.info(`Le cours ${emploi.titre} commence dans ${minutesDiff} ms`);
    } else if (timeDiff < 0) {
      console.warn(`Le cours ${emploi.titre} est déjà passé.`);
    }
  });
}

  
  applyFilters(): void {
    this.loadEmplois(); 
  }

}
