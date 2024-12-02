import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmploiListComponent } from './emploi-list/emploi-list.component';
import { EmploiFormComponent } from './emploi-form/emploi-form.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { EmploiSimpleComponent } from './emploi-simple/emploi-simple.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'emploi-simple', component: EmploiSimpleComponent },
  { path: 'emploi', component: EmploiListComponent },
  { path: 'emploi-new', component: EmploiFormComponent }, 
  { path: 'emploi-edit/:id', component: EmploiFormComponent }, 
  { path: '**', redirectTo: '/emploi' }
   
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
