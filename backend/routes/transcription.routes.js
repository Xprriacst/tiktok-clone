const express = require('express');
const router = express.Router();
const transcriptionController = require('../controllers/transcription.controller');

// Route pour extraire l'audio d'une vidéo
router.post('/extract-audio', transcriptionController.extractAudio);

// Route pour transcrire l'audio
router.post('/transcribe', transcriptionController.transcribeAudio);

module.exports = router;
