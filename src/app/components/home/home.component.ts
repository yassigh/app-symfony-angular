import { Component } from '@angular/core';
import { GoogleCalendarService } from 'src/app/google-calendar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private googleCalendarService: GoogleCalendarService) { }

  ngOnInit(): void {
    // Vous pouvez récupérer les événements lors du chargement du composant
    this.googleCalendarService;
  }

  signIn() {
    this.googleCalendarService.signIn();
  }

  signOut() {
    this.googleCalendarService.signOut();
  }
}
