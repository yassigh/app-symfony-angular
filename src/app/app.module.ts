import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmploiListComponent } from './emploi-list/emploi-list.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { EmploiFormComponent } from './emploi-form/emploi-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EmploiSimpleComponent } from './emploi-simple/emploi-simple.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  // Importer les animations Angular

@NgModule({
  declarations: [
    AppComponent,
    EmploiListComponent,
    EmploiFormComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    EmploiSimpleComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule , BrowserAnimationsModule,  // Ajouter BrowserAnimationsModule
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
