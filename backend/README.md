# TikTok Avatar Cloner - Backend

Ce backend fournit les API nécessaires au fonctionnement de l'application TikTok Avatar Cloner.

## Prérequis pour le déploiement

- Node.js 18 ou supérieur
- ffmpeg installé sur le serveur (pour l'extraction audio)
- Clés API pour :
  - RapidAPI TikTok Downloader
  - OpenAI (Whisper)
  - D-ID
  - ElevenLabs

## Déploiement sur Render

1. Créez un nouveau service Web sur [Render](https://render.com)
2. Connectez votre dépôt GitHub
3. Sélectionnez le dossier `backend`
4. Configurez les paramètres suivants :
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Selon vos besoins (Free ou payant)

5. Ajoutez les variables d'environnement suivantes :
   ```
   PORT=10000 (ou selon Render)
   NODE_ENV=production
   PUBLIC_URL=https://votre-app-backend.render.com
   RAPIDAPI_KEY=votre-clé-rapidapi
   RAPIDAPI_HOST=tiktok-downloader-download-tiktok-videos-without-watermark.p.rapidapi.com
   OPENAI_API_KEY=votre-clé-openai
   D_ID_API_KEY=votre-clé-did
   ELEVENLABS_API_KEY=votre-clé-elevenlabs
   UPLOADS_DIR=./uploads
   OUTPUT_DIR=./output
   ```

6. Vérifiez que ffmpeg est installé sur l'environnement Render (normalement préinstallé)
7. Cliquez sur "Create Web Service"

## Déploiement sur Railway

1. Créez un nouveau projet sur [Railway](https://railway.app)
2. Connectez votre dépôt GitHub ou importez le code
3. Naviguez vers le dossier `backend`
4. Ajoutez les variables d'environnement comme pour Render
5. Déployez l'application

## Après le déploiement

1. Mettez à jour le frontend pour pointer vers l'URL de votre backend déployé (variable d'environnement `VITE_API_BASE_URL`)
2. Testez le pipeline complet pour vous assurer que tout fonctionne correctement

## Remarques importantes

- Assurez-vous que les dossiers `uploads` et `output` sont créés automatiquement au démarrage du serveur
- Pour un environnement de production réel, utilisez plutôt un stockage cloud comme AWS S3 ou Google Cloud Storage pour les fichiers
- Le webhook D-ID ne fonctionnera que si votre backend a une URL publique
