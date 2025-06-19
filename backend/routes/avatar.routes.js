const express = require('express');
const router = express.Router();
const avatarController = require('../controllers/avatar.controller');

// Routes pour les avatars
// Route pour récupérer la liste des avatars
router.get('/', avatarController.getAvatars);

// Route pour récupérer un avatar spécifique
router.get('/:id', avatarController.getAvatar);

// Route pour générer une vidéo avec un avatar
router.post('/generate', avatarController.generateVideo);

// Route pour vérifier le statut d'une génération
router.get('/generation/:id/status', avatarController.getGenerationStatus);

// Webhook pour les mises à jour D-ID
router.post('/webhook/:id', avatarController.didWebhook);

module.exports = router;
