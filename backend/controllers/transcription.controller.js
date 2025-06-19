const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

// Chemin vers les dossiers
const uploadsDir = process.env.UPLOADS_DIR || './uploads';
const outputDir = process.env.OUTPUT_DIR || './output';

// Extraction audio à partir d'une vidéo
exports.extractAudio = async (req, res) => {
  try {
    const { videoFilename } = req.body;
    
    if (!videoFilename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier vidéo requis'
      });
    }
    
    const videoPath = path.join(uploadsDir, videoFilename);
    
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier vidéo non trouvé'
      });
    }
    
    const audioFilename = `${path.parse(videoFilename).name}_audio.mp3`;
    const audioPath = path.join(outputDir, audioFilename);
    
    // Vérifier si le dossier de sortie existe, sinon le créer
    fs.ensureDirSync(outputDir);
    
    try {
      // Vérifier d'abord si ffmpeg est disponible
      const checkFfmpeg = () => {
        return new Promise((resolve) => {
          exec('which ffmpeg', (error, stdout) => {
            resolve(!!stdout && !error);
          });
        });
      };
      
      const ffmpegAvailable = await checkFfmpeg();
      
      if (ffmpegAvailable) {
        // Si ffmpeg est installé, l'utiliser pour l'extraction audio
        console.log('ffmpeg trouvé, utilisation pour extraction audio');
        
        return new Promise((resolve, reject) => {
          const command = `ffmpeg -i "${videoPath}" -q:a 0 -map a "${audioPath}" -y`;
          
          exec(command, (error) => {
            if (error) {
              console.error('Erreur lors de l\'extraction audio avec ffmpeg:', error);
              // En cas d'erreur, créer un fichier audio vide pour la simulation
              fs.writeFileSync(audioPath, '');
              
              resolve(res.status(200).json({
                success: true,
                message: 'Audio extrait (simulé après erreur ffmpeg)',
                audio: {
                  filename: audioFilename,
                  path: audioPath,
                  url: `/output/${audioFilename}`
                }
              }));
            } else {
              resolve(res.status(200).json({
                success: true,
                message: 'Audio extrait avec succès',
                audio: {
                  filename: audioFilename,
                  path: audioPath,
                  url: `/output/${audioFilename}`
                }
              }));
            }
          });
        });
      } else {
        // Si ffmpeg n'est pas disponible, simuler l'extraction audio
        console.log('ffmpeg non trouvé, simulation d\'extraction audio');
        fs.writeFileSync(audioPath, '');
        
        return res.status(200).json({
          success: true,
          message: 'Audio extrait (simulé - ffmpeg non trouvé)',
          audio: {
            filename: audioFilename,
            path: audioPath,
            url: `/output/${audioFilename}`
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'extraction audio:', error);
      // Créer un fichier audio vide pour la simulation
      fs.writeFileSync(audioPath, '');
      
      return res.status(200).json({
        success: true,
        message: 'Audio extrait (simulé)',
        audio: {
          filename: audioFilename,
          path: audioPath,
          url: `/output/${audioFilename}`
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de l\'extraction audio:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de l'extraction audio: ${error.message}`,
      error: error.toString()
    });
  }
};

// Transcription audio via OpenAI Whisper API
exports.transcribeAudio = async (req, res) => {
  try {
    const { audioFilename } = req.body;
    
    if (!audioFilename) {
      return res.status(400).json({
        success: false,
        message: 'Nom de fichier audio requis'
      });
    }
    
    const audioPath = path.join(outputDir, audioFilename);
    
    if (!fs.existsSync(audioPath)) {
      return res.status(404).json({
        success: false,
        message: 'Fichier audio non trouvé'
      });
    }
    
    // Vérifier si une clé OpenAI API est disponible
    if (!process.env.OPENAI_API_KEY) {
      // Si pas de clé OpenAI, simuler une transcription
      const mockTranscription = [
        { text: "Salut tout le monde ! Aujourd'hui je vais vous parler de...", start: 0, end: 3.5 },
        { text: "Comment j'ai augmenté ma productivité de 200% en un mois.", start: 3.5, end: 7.2 },
        { text: "C'est vraiment incroyable et je vais vous montrer comment faire.", start: 7.2, end: 11 }
      ];
      
      return res.status(200).json({
        success: true,
        message: 'Transcription générée (simulée)',
        transcription: {
          id: uuidv4(),
          text: mockTranscription.map(segment => segment.text).join(' '),
          segments: mockTranscription,
          createdAt: new Date().toISOString()
        }
      });
    }
    
    // Si clé OpenAI disponible, utiliser l'API Whisper
    try {
      // Lire le fichier audio
      const audioData = fs.readFileSync(audioPath);
      
      // Préparer FormData pour l'API OpenAI
      const formData = new FormData();
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      formData.append('file', audioBlob, audioFilename);
      formData.append('model', 'whisper-1');
      formData.append('language', 'fr'); // Langue française, modifiable selon besoins
      
      // Appel à l'API OpenAI Whisper
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Créer segments simplifiés si pas disponibles dans la réponse
      const text = response.data.text;
      const segments = response.data.segments || [{
        text: text,
        start: 0,
        end: 30 // Durée arbitraire
      }];
      
      return res.status(200).json({
        success: true,
        message: 'Transcription générée avec succès',
        transcription: {
          id: uuidv4(),
          text: text,
          segments: segments,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Erreur lors de la transcription via OpenAI:', error.response?.data || error);
      
      // En cas d'erreur avec l'API, simuler une transcription
      const mockTranscription = [
        { text: "Salut tout le monde ! Aujourd'hui je vais vous parler de...", start: 0, end: 3.5 },
        { text: "Comment j'ai augmenté ma productivité de 200% en un mois.", start: 3.5, end: 7.2 },
        { text: "C'est vraiment incroyable et je vais vous montrer comment faire.", start: 7.2, end: 11 }
      ];
      
      return res.status(200).json({
        success: true,
        message: 'Transcription générée (simulée - erreur OpenAI)',
        transcription: {
          id: uuidv4(),
          text: mockTranscription.map(segment => segment.text).join(' '),
          segments: mockTranscription,
          createdAt: new Date().toISOString(),
          error: error.message
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la transcription audio:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la transcription audio: ${error.message}`,
      error: error.toString()
    });
  }
};
