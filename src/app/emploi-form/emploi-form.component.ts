import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmploiService } from '../emploi.service';

@Component({
  selector: 'app-emploi-form',
  templateUrl: './emploi-form.component.html',
  styleUrls: ['./emploi-form.component.css']
})
export class EmploiFormComponent implements OnInit {
  emploiForm: FormGroup;
  isEditMode: boolean = false;
  emploiId: number | undefined;
  isEditing: boolean = false; // Propriété pour vérifier si nous sommes en mode édition
 id: number | undefined; // ID de l'emploi, qui peut être undefined si un nouvel emploi est créé
  
  constructor(
    private fb: FormBuilder,
    private emploiService: EmploiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.emploiForm = this.fb.group({
      classeId: ['', Validators.required],
      jour: [''],
      titre: [''],
      nomEnseignant: [''],
      startTime: [''],
      endTime: [''],
      salle: [''],
      recurrencePattern: [''],
     
    });
  }
  classes: any[] = [];
  ngOnInit(): void {
    this.emploiService.getClasses().subscribe(data => {
      this.classes = data; console.log(this.classes);
    });
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.emploiId = +params['id'];
        console.log('Emploi ID:', this.emploiId); 
        this.loadEmploi(this.emploiId);
      }
    });
  }

  loadEmploi(id: number): void {
    // Charge les données de l'emploi dans le formulaire
    this.emploiService.getEmploiById(id).subscribe(data => {
      if (data) {
        this.emploiForm.patchValue(data);
      }
    });
  }
  onSubmit(): void {
    if (this.emploiForm.valid) {
      if (this.isEditMode && this.emploiId) {
        // Si on est en mode edition, mettre a jour l'emploi
        this.emploiService.updateEmploi(this.emploiId, this.emploiForm.value).subscribe({
          next: () => {
            this.router.navigate(['/emploi']); // Redirection vers la page d'affichage des emplois
          },
          error: (err) => {
            console.error('Erreur lors de la modification:', err);
          }
        });
      } else {
        // Sinon, créer un nouvel emploi
        this.emploiService.createEmploi(this.emploiForm.value).subscribe({
          next: () => {
            this.router.navigate(['/emploi']); // Redirection vers la page d'affichage des emplois
          },
          error: (err) => {
            console.error('Erreur lors de la création:', err);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/emploi']);
  }
}
