const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');

// Route pour récupérer la liste des voix disponibles
router.get('/', voiceController.getVoices);

// Route pour générer un fichier audio à partir d'un texte
router.post('/generate', voiceController.generateSpeech);

module.exports = router;
