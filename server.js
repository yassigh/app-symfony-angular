const express = require('express');
const path = require('path');

const app = express();

// Servir les fichiers statiques de votre dossier dist (où Angular génère les fichiers)
app.use(express.static(path.join(__dirname, 'C:\\Users\\MSI\\Desktop\\projetfinish\\Frontend')));

// Rediriger toutes les requêtes vers index.html pour que le routage Angular prenne le relais
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'C:\\Users\\MSI\\Desktop\\projetfinish\\Frontend\\index.html'));
});

// Démarrer le serveur sur le port 8000 (ou un autre port de votre choix)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
