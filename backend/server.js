const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs-extra');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Créer les dossiers nécessaires s'ils n'existent pas
const uploadsDir = process.env.UPLOADS_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './output';

fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(outputDir);

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));
app.use('/output', express.static(path.join(__dirname, outputDir)));

// Routes
const tiktokRoutes = require('./routes/tiktok.routes');
const transcriptionRoutes = require('./routes/transcription.routes');
const avatarRoutes = require('./routes/avatar.routes');
const videoRoutes = require('./routes/video.routes');
const voiceRoutes = require('./routes/voice.routes');

app.use('/api/tiktok', tiktokRoutes);
app.use('/api/transcription', transcriptionRoutes);
app.use('/api/avatars', avatarRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/voice', voiceRoutes);

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API TikTok Avatar Cloner' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
