const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Chemin vers le dossier d'uploads
const uploadsDir = process.env.UPLOADS_DIR || './uploads';

/**
 * Valide une URL TikTok
 */
exports.validateTikTokUrl = (req, res) => {
  const { url } = req.body;
  
  // Validation simple de l'URL TikTok
  const tiktokRegex = /^(https?:\/\/)?(www\.|vm\.)?tiktok\.com\/.+/i;
  
  if (!url || !tiktokRegex.test(url)) {
    return res.status(400).json({
      success: false,
      message: 'URL TikTok invalide'
    });
  }
  
  return res.status(200).json({
    success: true,
    message: 'URL TikTok valide',
    url
  });
};

/**
 * Télécharge une vidéo TikTok en utilisant RapidAPI
 */
exports.downloadTikTokVideo = async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({
      success: false,
      message: 'URL TikTok requise'
    });
  }
  
  try {
    // Configuration pour l'appel à RapidAPI
    const options = {
      method: 'GET',
      url: 'https://tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com/vid/index',
      params: {
        url
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      }
    };
    
    // Appel à l'API RapidAPI
    const response = await axios.request(options);
    
    if (!response.data || !response.data.video || !response.data.video[0]) {
      throw new Error('Aucune vidéo trouvée pour cette URL');
    }
    
    // URL de la vidéo sans filigrane
    const videoUrl = response.data.video[0];
    
    // Télécharger la vidéo
    const videoResponse = await axios({
      method: 'GET',
      url: videoUrl,
      responseType: 'stream'
    });
    
    // Générer un nom de fichier unique
    const filename = `tiktok_${uuidv4()}.mp4`;
    const filePath = path.join(uploadsDir, filename);
    
    // Créer un stream d'écriture et y rediriger la réponse
    const writer = fs.createWriteStream(filePath);
    videoResponse.data.pipe(writer);
    
    // Attendre que le téléchargement soit terminé
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    
    // Obtenir les métadonnées du fichier
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    
    // Extraire les métadonnées de la réponse de l'API
    const videoMetadata = {
      title: response.data.title || 'TikTok Video',
      author: response.data.author || 'Unknown',
      duration: response.data.duration || 30, // Durée en secondes
      resolution: '1080x1920', // Résolution par défaut pour TikTok
      fileSize: fileSizeInMB,
      filename,
      path: `/uploads/${filename}`, // Chemin relatif pour l'accès via l'API
      fullPath: filePath // Chemin complet sur le serveur
    };
    
    return res.status(200).json({
      success: true,
      message: 'Vidéo TikTok téléchargée avec succès',
      video: videoMetadata
    });
    
  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo TikTok:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors du téléchargement de la vidéo: ${error.message}`,
      error: error.toString()
    });
  }
};

/**
 * Liste les vidéos téléchargées
 */
exports.listVideos = (req, res) => {
  try {
    // Vérifier si le dossier d'uploads existe
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({
        success: true,
        videos: []
      });
    }
    
    // Lire le contenu du dossier
    const files = fs.readdirSync(uploadsDir);
    
    // Filtrer pour ne garder que les fichiers vidéo
    const videoFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ext === '.mp4' || ext === '.mov' || ext === '.webm';
    });
    
    // Créer la liste des vidéos avec leurs métadonnées
    const videos = videoFiles.map(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      return {
        filename: file,
        path: `/uploads/${file}`,
        fullPath: filePath,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });
    
    return res.status(200).json({
      success: true,
      videos
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des vidéos: ${error.message}`,
      error: error.toString()
    });
  }
};
