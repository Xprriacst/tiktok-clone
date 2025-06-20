import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const DashboardHome = () => {
  const navigate = useNavigate();

  const handleCreateNewVideo = () => {
    navigate('/video-creation-workflow');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* En-tête et bouton principal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary">TikTok Avatar Cloner</h1>
            <p className="text-text-secondary mt-1">Transformez vos vidéos TikTok en avatars IA</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleCreateNewVideo}
              className="btn-primary flex items-center space-x-2 px-4 py-2 rounded-md bg-primary hover:bg-primary-600 text-white font-medium transition-all"
            >
              <Icon name="Plus" size={18} />
              <span>Créer un avatar</span>
            </button>
          </div>
        </div>
        
        {/* Section principale - présentation de l'application */}
        <div className="bg-surface rounded-xl p-6 shadow-sm border border-border">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary">
                <Icon name="Video" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Étape 1: Téléchargez une vidéo TikTok</h3>
                <p className="text-text-secondary">Entrez l'URL d'une vidéo TikTok pour la télécharger</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary">
                <Icon name="Mic" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Étape 2: Personnalisez votre avatar</h3>
                <p className="text-text-secondary">Choisissez un avatar et personnalisez la voix</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary">
                <Icon name="Share2" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Étape 3: Exportez votre vidéo</h3>
                <p className="text-text-secondary">Prévisualisez et exportez votre vidéo</p>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                onClick={handleCreateNewVideo}
                className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-md bg-primary hover:bg-primary-600 text-white font-medium transition-all"
              >
                <Icon name="Play" size={18} />
                <span>Commencer maintenant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/video-creation-workflow')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Nouveau projet</h3>
            <p className="text-sm text-text-secondary">Créer depuis une URL TikTok</p>
          </button>

          <button
            onClick={() => navigate('/video-creation-workflow')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="User" size={24} className="text-secondary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Personnaliser avatar</h3>
            <p className="text-sm text-text-secondary">Voix et apparence</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
