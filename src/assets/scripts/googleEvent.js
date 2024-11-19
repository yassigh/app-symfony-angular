const CLIENT_ID = "148127184314-0v6ll72eblftu8coumc3u5usp8asmeub.apps.googleusercontent.com";
const API_KEY = "AIzaSyBJnaKXhHyhYtIPGeFiwNvkb9oS6rnIXNs";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar";

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Charger la bibliothèque GAPI (Google API Client)
function gapiLoad() {
  gapi.load("client", initializeGapiClient);
}

// Initialiser le client GAPI avec l'API Key et les paramètres
async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  maybeEnableButtons();
}

// Charger la bibliothèque GIS (Google Identity Services)
function gisLoad() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "", // Callback à remplir plus tard pour gérer la réponse d'autorisation
  });
  gisInited = true;
  maybeEnableButtons();
}

// Activer les boutons lorsque `gapi` et `gis` sont prêts
function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById("authorize_button").style.display = "block";
  }
}

// Gérer l'autorisation Google
function handleAuthClick() {
  tokenClient.callback = async (response) => {
    if (response.error) {
      console.error("Erreur d'autorisation : ", response);
      return;
    }
    await listUpcomingEvents();
  };

  if (gapi.client.getToken() === null) {
    // Demander l'autorisation de l'utilisateur
    tokenClient.requestAccessToken({ prompt: "consent" });
  } else {
    // Utiliser le token existant
    tokenClient.requestAccessToken({ prompt: "" });
  }
}

// Gérer la déconnexion
function handleSignoutClick() {
  const token = gapi.client.getToken();
  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token, () => {
      gapi.client.setToken(null);
      console.log("Déconnecté");
    });
  }
}

// Exemple pour lister les événements Google Calendar
async function listUpcomingEvents() {
  try {
    const response = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    const events = response.result.items;
    if (events.length > 0) {
      console.log("Événements à venir :");
      events.forEach((event) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log("Aucun événement trouvé.");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des événements : ", error);
  }
}

// Charger les bibliothèques GAPI et GIS
window.onload = () => {
  gapiLoad();
  gisLoad();
};
