const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Chemin vers le dossier de sortie
const outputDir = process.env.OUTPUT_DIR || './output';

// Liste des avatars disponibles sur D-ID
const avatars = [
  {
    id: "anna-neutral",
    name: "Anna",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/anna-in/thumbnail.png",
    gender: "female",
    description: "Présentatrice professionnelle, style business"
  },
  {
    id: "luke-neutral",
    name: "Luke",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/luke-in/thumbnail.png",
    gender: "male",
    description: "Présentateur professionnel, style business"
  },
  {
    id: "jeny-neutral",
    name: "Jeny",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/jeny-in/thumbnail.png",
    gender: "female",
    description: "Présentatrice jeune et dynamique"
  },
  {
    id: "pete-neutral",
    name: "Pete",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/pete-in/thumbnail.png",
    gender: "male",
    description: "Présentateur jeune et décontracté"
  },
  {
    id: "ava-neutral",
    name: "Ava",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/ava-in/thumbnail.png",
    gender: "female",
    description: "Présentatrice au style naturel et chaleureux"
  },
  {
    id: "daniel-neutral",
    name: "Daniel",
    thumbnail: "https://cdn.d-id.com/avatars-web/celebrities/daniel-in/thumbnail.png",
    gender: "male",
    description: "Présentateur au style professionnel et posé"
  }
];

// Récupérer la liste des avatars disponibles
exports.getAvatars = (req, res) => {
  return res.status(200).json({
    success: true,
    avatars
  });
};

// Récupérer les détails d'un avatar spécifique
exports.getAvatar = (req, res) => {
  const { id } = req.params;
  const avatar = avatars.find(a => a.id === id);
  
  if (!avatar) {
    return res.status(404).json({
      success: false,
      message: 'Avatar non trouvé'
    });
  }
  
  return res.status(200).json({
    success: true,
    avatar
  });
};

// Générer une vidéo avec un avatar parlant
exports.generateVideo = async (req, res) => {
  try {
    const { avatarId, audioUrl, transcription } = req.body;
    
    if (!avatarId || !audioUrl) {
      return res.status(400).json({
        success: false,
        message: 'ID d\'avatar et URL audio requis'
      });
    }
    
    // Vérifier si l'avatar existe
    const avatar = avatars.find(a => a.id === avatarId);
    if (!avatar) {
      return res.status(404).json({
        success: false,
        message: 'Avatar non trouvé'
      });
    }
    
    // Générer un ID unique pour cette génération
    const generationId = uuidv4();
    
    // Vérifier si une clé D-ID API est disponible
    if (!process.env.D_ID_API_KEY) {
      return res.status(200).json({
        success: true,
        message: 'Génération vidéo démarrée (simulée)',
        generation: {
          id: generationId,
          status: 'processing',
          progress: 0,
          avatarId,
          createdAt: new Date().toISOString()
        }
      });
    }
    
    // Si clé disponible, appel à l'API D-ID pour créer une présentation
    try {
      // Configuration de la requête
      const apiUrl = 'https://api.d-id.com/talks';
      
      // Détermine l'URL de base en fonction de l'environnement
      const baseUrl = process.env.NODE_ENV === 'production'
        ? process.env.PUBLIC_URL
        : `http://localhost:${process.env.PORT || 5000}`;
        
      console.log(`Utilisation de l'URL de base: ${baseUrl}`);
      
      const payload = {
        source_url: `https://cdn.d-id.com/avatars-web/celebrities/${avatarId.split('-')[0]}-in/image.png`,
        audio_url: audioUrl.startsWith('http') ? audioUrl : `${baseUrl}${audioUrl}`,
        driver_url: "bank://lively/driver-03",
        config: {
          stitch: true
        }
      };
      
      // Ajouter le webhook uniquement en production ou avec une URL publique
      if (process.env.PUBLIC_URL) {
        payload.webhook = `${baseUrl}/api/avatars/webhook/${generationId}`;
        console.log(`Webhook configuré: ${payload.webhook}`);
      } else {
        console.log('Webhook non configuré - URL publique requise');
      }
      
      const response = await axios({
        method: 'POST',
        url: apiUrl,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${process.env.D_ID_API_KEY}`
        }
      });
      
      return res.status(200).json({
        success: true,
        message: 'Génération vidéo démarrée avec D-ID',
        generation: {
          id: generationId,
          did_id: response.data.id,
          status: 'processing',
          progress: 0,
          avatarId,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération vidéo via D-ID:', error.response?.data || error);
      
      // En cas d'erreur avec l'API, simuler un démarrage de génération
      return res.status(200).json({
        success: true,
        message: 'Génération vidéo démarrée (simulée - erreur D-ID)',
        generation: {
          id: generationId,
          status: 'processing',
          progress: 0,
          avatarId,
          createdAt: new Date().toISOString(),
          error: error.message
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la génération vidéo:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la génération vidéo: ${error.message}`,
      error: error.toString()
    });
  }
};

// Récupérer le statut de génération d'une vidéo
exports.getGenerationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si une clé D-ID API est disponible
    if (!process.env.D_ID_API_KEY) {
      // Simuler une progression aléatoire
      const progress = Math.min(100, Math.floor(Math.random() * 100));
      
      // Si la progression est à 100%, simuler une vidéo générée
      if (progress === 100) {
        const videoFilename = `avatar_${id}.mp4`;
        const videoPath = path.join(outputDir, videoFilename);
        
        // Créer un fichier vidéo vide pour simuler
        if (!fs.existsSync(videoPath)) {
          fs.writeFileSync(videoPath, '');
        }
        
        return res.status(200).json({
          success: true,
          generation: {
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
          generation: {
            id,
            status: 'processing',
            progress,
            estimatedTimeRemaining: Math.floor(Math.random() * 60) + ' seconds'
          }
        });
      }
    }
    
    // Si clé disponible, vérifier le statut via D-ID API
    try {
      // Essayer de récupérer l'ID D-ID associé à cette génération
      // Dans une implémentation réelle, cet ID serait stocké dans une base de données
      
      // Pour le prototype, on utilise l'ID de génération comme ID D-ID
      const did_id = req.query.did_id;
      
      if (!did_id) {
        // Si pas d'ID D-ID, simuler un statut
        const progress = Math.min(100, Math.floor(Math.random() * 100));
        
        if (progress === 100) {
          const videoFilename = `avatar_${id}.mp4`;
          const videoPath = path.join(outputDir, videoFilename);
          
          // Créer un fichier vidéo vide pour simuler
          if (!fs.existsSync(videoPath)) {
            fs.writeFileSync(videoPath, '');
          }
          
          return res.status(200).json({
            success: true,
            generation: {
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
            generation: {
              id,
              status: 'processing',
              progress,
              estimatedTimeRemaining: Math.floor(Math.random() * 60) + ' seconds'
            }
          });
        }
      }
      
      // Appel à l'API D-ID pour vérifier le statut
      const apiUrl = `https://api.d-id.com/talks/${did_id}`;
      
      const response = await axios({
        method: 'GET',
        url: apiUrl,
        headers: {
          'Authorization': `Basic ${process.env.D_ID_API_KEY}`
        }
      });
      
      const didStatus = response.data.status;
      let progress = 0;
      
      // Convertir le statut D-ID en pourcentage de progression
      switch (didStatus) {
        case 'created':
          progress = 10;
          break;
        case 'processing':
          progress = 50;
          break;
        case 'ready':
          progress = 100;
          break;
        case 'error':
          return res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération vidéo',
            generation: {
              id,
              did_id,
              status: 'error',
              error: response.data.error || 'Erreur inconnue'
            }
          });
        default:
          progress = 25;
      }
      
      // Si la vidéo est prête, télécharger le résultat
      if (didStatus === 'ready') {
        const videoUrl = response.data.result_url;
        const videoFilename = `avatar_${id}.mp4`;
        const videoPath = path.join(outputDir, videoFilename);
        
        // Télécharger la vidéo générée
        const videoResponse = await axios({
          method: 'GET',
          url: videoUrl,
          responseType: 'arraybuffer'
        });
        
        // Sauvegarder la vidéo
        fs.writeFileSync(videoPath, videoResponse.data);
        
        return res.status(200).json({
          success: true,
          generation: {
            id,
            did_id,
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
          generation: {
            id,
            did_id,
            status: 'processing',
            progress,
            didStatus
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut via D-ID:', error.response?.data || error);
      
      // En cas d'erreur avec l'API, simuler un statut
      const progress = Math.min(100, Math.floor(Math.random() * 100));
      
      if (progress === 100) {
        const videoFilename = `avatar_${id}.mp4`;
        const videoPath = path.join(outputDir, videoFilename);
        
        // Créer un fichier vidéo vide pour simuler
        if (!fs.existsSync(videoPath)) {
          fs.writeFileSync(videoPath, '');
        }
        
        return res.status(200).json({
          success: true,
          generation: {
            id,
            status: 'completed',
            progress: 100,
            outputFilename: videoFilename,
            outputUrl: `/output/${videoFilename}`,
            completedAt: new Date().toISOString(),
            error: error.message
          }
        });
      } else {
        return res.status(200).json({
          success: true,
          generation: {
            id,
            status: 'processing',
            progress,
            estimatedTimeRemaining: Math.floor(Math.random() * 60) + ' seconds',
            error: error.message
          }
        });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de génération:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération du statut de génération: ${error.message}`,
      error: error.toString()
    });
  }
};

// Webhook pour recevoir les mises à jour de statut D-ID
exports.didWebhook = async (req, res) => {
  try {
    const { id } = req.params; // ID de génération unique
    const data = req.body;
    
    console.log('Webhook D-ID reçu pour la génération', id, ':', data);
    
    // Dans une implémentation réelle, vous mettriez à jour le statut dans une base de données
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors du traitement du webhook D-ID:', error);
    return res.status(500).json({ success: false, error: error.toString() });
  }
};
