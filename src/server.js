import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurations pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

// Il faut importer app *après* avoir chargé dotenv
import app from './app.js';
import connectDB from './infrastructure/database/connection.js';

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Démarrer le serveur
const server = app.listen(PORT, () => {
  const baseUrl = process.env.API_URL || `http://localhost:${PORT}`;
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  console.log(`Swagger UI disponible sur ${baseUrl}/api-docs`);
});

// Gérer les promesses rejetées (Uncaught Rejections)
process.on('unhandledRejection', (err) => {
  console.error(`Erreur non gérée: ${err.message}`);
  // Fermer le serveur et quitter le process
  server.close(() => process.exit(1));
});
