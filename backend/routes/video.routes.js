const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

// Chemin vers les dossiers
const outputDir = process.env.OUTPUT_DIR || './output';

// Route pour exporter une vidéo
router.post('/export', (req, res) => {
  const { projectId, avatarGenerationId, settings } = req.body;
  
  if (!projectId || !avatarGenerationId) {
    return res.status(400).json({
      success: false,
      message: 'ID de projet et ID de génération d\'avatar requis'
    });
  }
  
  try {
    // Générer un ID unique pour cet export
    const exportId = uuidv4();
    
    // Simuler le démarrage du processus d'export
    return res.status(200).json({
      success: true,
      message: 'Export vidéo démarré',
      export: {
        id: exportId,
        status: 'processing',
        progress: 0,
        projectId,
        avatarGenerationId,
        settings,
        createdAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'export de la vidéo:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de l'export de la vidéo: ${error.message}`,
      error: error.toString()
    });
  }
});

// Route pour vérifier le statut d'un export
router.get('/export/:id/status', (req, res) => {
  const { id } = req.params;
  
  // Simuler une progression aléatoire à chaque appel
  // Dans une implémentation réelle, vous stockeriez l'état dans une base de données
  const progress = Math.min(100, Math.floor(Math.random() * 100));
  
  // Si la progression est à 100%, simuler une vidéo exportée
  if (progress === 100) {
    const videoFilename = `export_${id}.mp4`;
    const videoPath = path.join(outputDir, videoFilename);
    
    // Créer un fichier vidéo vide pour simuler
    if (!fs.existsSync(videoPath)) {
      fs.writeFileSync(videoPath, '');
    }
    
    return res.status(200).json({
      success: true,
      export: {
        id,
        status: 'completed',
        progress: 100,
        outputFilename: videoFilename,
        outputUrl: `/output/${videoFilename}`,
        completedAt: new Date().toISOString()
      }
    });
  } else {
    return res.status(200).json({
      success: true,
      export: {
        id,
        status: 'processing',
        progress,
        estimatedTimeRemaining: Math.floor(Math.random() * 60) + ' seconds'
      }
    });
  }
});

// Route pour récupérer la liste des projets
router.get('/projects', (req, res) => {
  // Dans une implémentation réelle, vous récupéreriez les projets depuis une base de données
  const mockProjects = [
    {
      id: 'project1',
      name: 'Marketing Campaign Avatar',
      status: 'completed',
      createdAt: new Date().toISOString()
    },
    {
      id: 'project2',
      name: 'Product Demo',
      status: 'processing',
      createdAt: new Date().toISOString()
    }
  ];
  
  return res.status(200).json({
    success: true,
    projects: mockProjects
  });
});

// Route pour récupérer les formats d'export disponibles
router.get('/export-formats', (req, res) => {
  const formats = [
    { id: 'mp4', name: 'MP4', description: 'Format vidéo standard compatible avec la plupart des plateformes' },
    { id: 'mov', name: 'MOV', description: 'Format Apple QuickTime, haute qualité' },
    { id: 'webm', name: 'WebM', description: 'Format optimisé pour le web' }
  ];
  
  return res.status(200).json({
    success: true,
    formats
  });
});

module.exports = router;
