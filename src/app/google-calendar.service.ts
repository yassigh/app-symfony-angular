import { Injectable } from '@angular/core';

declare var gapi: any;
declare var google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleCalendarService {
  private CLIENT_ID = '148127184314-0v6ll72eblftu8coumc3u5usp8asmeub.apps.googleusercontent.com';
  private API_KEY = 'AIzaSyBJnaKXhHyhYtIPGeFiwNvkb9oS6rnIXNs';
  private DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  private SCOPES = 'https://www.googleapis.com/auth/calendar';
  private tokenClient: any;
  private gapiInited = false;
  private gisInited = false;

  constructor() {
    this.loadGapi();
    this.loadGis();
  }

  private loadGapi() {
    gapi.load('client', this.initializeGapiClient.bind(this));
  }

  private async initializeGapiClient() {
    await gapi.client.init({
      apiKey: this.API_KEY,
      discoveryDocs: [this.DISCOVERY_DOC],
    });
    this.gapiInited = true;
  }

  private loadGis() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.CLIENT_ID,
      scope: this.SCOPES,
      callback: (response: any) => {
        if (response.error) {
          console.error('Erreur d\'autorisation : ', response);
          return;
        }
        // Logic to list events or handle the response
      },
    });
    this.gisInited = true;
  }

  signIn() {
    if (gapi.client.getToken() === null) {
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      this.tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken(null);
        console.log('Déconnecté');
      });
    }
  }
}
