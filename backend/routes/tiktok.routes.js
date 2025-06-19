const express = require('express');
const router = express.Router();
const tiktokController = require('../controllers/tiktok.controller');

// Route pour valider une URL TikTok
router.post('/validate', tiktokController.validateTikTokUrl);

// Route pour télécharger une vidéo TikTok
router.post('/download', tiktokController.downloadTikTokVideo);

// Route pour lister les vidéos téléchargées
router.get('/videos', tiktokController.listVideos);

module.exports = router;
