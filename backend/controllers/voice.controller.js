const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// Chemin vers le dossier de sortie
const outputDir = process.env.OUTPUT_DIR || './output';

// Liste des voix disponibles sur ElevenLabs
const voices = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "Voix féminine claire et naturelle"
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    description: "Voix féminine joyeuse et énergique"
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "Voix féminine élégante et douce"
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    description: "Voix masculine profonde et posée"
  },
  {
    id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Elli",
    description: "Voix féminine jeune et dynamique"
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh",
    description: "Voix masculine naturelle et professionnelle"
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold",
    description: "Voix masculine profonde et autoritaire"
  },
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam",
    description: "Voix masculine calme et posée"
  }
];

// Récupérer la liste des voix disponibles
exports.getVoices = (req, res) => {
  // Vérifier si une clé ElevenLabs API est disponible
  if (!process.env.ELEVENLABS_API_KEY) {
    return res.status(200).json({
      success: true,
      voices: voices.map(voice => ({
        ...voice,
        isMocked: true
      }))
    });
  }

  // Si clé disponible, on pourrait faire un appel réel à l'API pour obtenir les voix
  // Mais pour simplifier, on utilise notre liste prédéfinie
  return res.status(200).json({
    success: true,
    voices
  });
};

// Générer un fichier audio à partir d'un texte avec ElevenLabs
exports.generateSpeech = async (req, res) => {
  try {
    const { text, voiceId } = req.body;
    
    if (!text || !voiceId) {
      return res.status(400).json({
        success: false,
        message: 'Texte et identifiant de voix requis'
      });
    }
    
    // Vérifier si le dossier de sortie existe, sinon le créer
    fs.ensureDirSync(outputDir);
    
    // Nom unique pour le fichier audio
    const audioFilename = `speech_${uuidv4()}.mp3`;
    const audioPath = path.join(outputDir, audioFilename);
    
    // Vérifier si une clé ElevenLabs API est disponible
    if (!process.env.ELEVENLABS_API_KEY) {
      // Si pas de clé, créer un fichier audio vide pour simulation
      fs.writeFileSync(audioPath, '');
      
      return res.status(200).json({
        success: true,
        message: 'Audio généré (simulé)',
        audio: {
          filename: audioFilename,
          path: audioPath,
          url: `/output/${audioFilename}`
        }
      });
    }
    
    // Si clé disponible, appel à l'API ElevenLabs
    try {
      // Configuration de la requête
      const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
      
      const response = await axios({
        method: 'POST',
        url: apiUrl,
        data: {
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        },
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY
        },
        responseType: 'arraybuffer'
      });
      
      // Sauvegarder le fichier audio
      fs.writeFileSync(audioPath, response.data);
      
      return res.status(200).json({
        success: true,
        message: 'Audio généré avec succès',
        audio: {
          filename: audioFilename,
          path: audioPath,
          url: `/output/${audioFilename}`
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération audio via ElevenLabs:', error.response?.data || error);
      
      // En cas d'erreur avec l'API, créer un fichier audio vide pour simulation
      fs.writeFileSync(audioPath, '');
      
      return res.status(200).json({
        success: true,
        message: 'Audio généré (simulé - erreur ElevenLabs)',
        audio: {
          filename: audioFilename,
          path: audioPath,
          url: `/output/${audioFilename}`,
          error: error.message
        }
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de la génération de la voix:', error);
    
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la génération de la voix: ${error.message}`,
      error: error.toString()
    });
  }
};
