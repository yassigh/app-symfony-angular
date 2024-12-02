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
  isEditing: boolean = false; 
   id: number | undefined;
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

    this.emploiService.getEmploiById(id).subscribe(data => {
      if (data) {
        this.emploiForm.patchValue(data);
      }
    });
  }
  onSubmit(): void {
    if (this.emploiForm.valid) {
      if (this.isEditMode && this.emploiId) {
          this.emploiService.updateEmploi(this.emploiId, this.emploiForm.value).subscribe({
          next: () => {
            this.router.navigate(['/emploi']); 
           },
          error: (err) => {
            console.error('Erreur lors de la modification:', err);
          }
        });
      } else {
     
        this.emploiService.createEmploi(this.emploiForm.value).subscribe({
          next: () => {
            this.router.navigate(['/emploi']);  },
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
