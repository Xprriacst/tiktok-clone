import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import AvatarGrid from './components/AvatarGrid';
import VoiceSettings from './components/VoiceSettings';
import BackgroundOptions from './components/BackgroundOptions';
import PreviewPanel from './components/PreviewPanel';

const AvatarVoiceCustomization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('avatar');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Project context from navigation state
  const [projectContext] = useState({
    id: location.state?.projectId || 'proj_001',
    name: location.state?.projectName || 'TikTok Avatar Project',
    sourceUrl: location.state?.sourceUrl || 'https://tiktok.com/@user/video/123456789',
    duration: location.state?.duration || '0:45',
    language: location.state?.language || 'English',
    status: 'customizing'
  });

  // Customization state
  const [customization, setCustomization] = useState({
    avatar: {
      id: 'avatar_001',
      name: 'Professional Female',
      category: 'business',
      ethnicity: 'caucasian',
      age: 'adult',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face'
    },
    voice: {
      language: 'en-US',
      gender: 'female',
      accent: 'american',
      pitch: 0,
      speed: 1.0,
      tone: 'neutral',
      emotion: 'confident',
      voiceId: 'voice_001'
    },
    background: {
      type: 'studio',
      value: 'white_studio',
      color: '#ffffff',
      lighting: 'soft',
      blur: 0
    }
  });

  const tabs = [
    { id: 'avatar', label: 'Avatar', icon: 'User', count: null },
    { id: 'voice', label: 'Voice', icon: 'Mic', count: null },
    { id: 'background', label: 'Background', icon: 'Image', count: null }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleCustomizationChange = (section, updates) => {
    setCustomization(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setHasUnsavedChanges(false);
    setIsSaving(false);
    
    // Show success feedback
    const successEvent = new CustomEvent('showNotification', {
      detail: { type: 'success', message: 'Customization saved successfully!' }
    });
    window.dispatchEvent(successEvent);
  };

  const handlePreview = () => {
    navigate('/video-preview-export', {
      state: {
        projectId: projectContext.id,
        projectName: projectContext.name,
        customization: customization,
        fromCustomization: true
      }
    });
  };

  const handleContinueToProcessing = () => {
    if (hasUnsavedChanges) {
      const confirmSave = window.confirm('You have unsaved changes. Save before continuing?');
      if (confirmSave) {
        handleSave();
      }
    }
    
    navigate('/processing-status-queue', {
      state: {
        projectId: projectContext.id,
        projectName: projectContext.name,
        customization: customization,
        action: 'start_processing'
      }
    });
  };

  const togglePreviewPanel = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="min-h-screen bg-background">
      {/* Project Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Project Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">{projectContext.name}</h1>
                  <div className="flex items-center space-x-2 text-sm text-text-secondary">
                    <span>Duration: {projectContext.duration}</span>
                    <span>•</span>
                    <span>{projectContext.language}</span>
                    {hasUnsavedChanges && (
                      <>
                        <span>•</span>
                        <span className="text-warning font-medium">Unsaved changes</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePreviewPanel}
                className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200"
              >
                <Icon name="Eye" size={16} />
                <span>Preview</span>
              </button>
              
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-background border border-border text-text-primary hover:bg-surface rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon name={isSaving ? "Loader2" : "Save"} size={16} className={isSaving ? "animate-spin" : ""} />
                <span>{isSaving ? 'Saving...' : 'Save'}</span>
              </button>

              <button
                onClick={handleContinueToProcessing}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-700 rounded-lg transition-colors duration-200"
              >
                <span>Continue</span>
                <Icon name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`grid gap-6 transition-all duration-300 ${isPreviewVisible ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          {/* Main Customization Panel */}
          <div className={`${isPreviewVisible ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            {/* Tab Navigation */}
            <div className="bg-surface rounded-lg border border-border mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-0" aria-label="Customization tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`
                        flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
                        ${activeTab === tab.id
                          ? 'border-primary text-primary bg-primary-50' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-background'
                        }
                      `}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.label}</span>
                      {tab.count && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-text-secondary text-white rounded-full">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'avatar' && (
                  <AvatarGrid
                    selectedAvatar={customization.avatar}
                    onAvatarSelect={(avatar) => handleCustomizationChange('avatar', avatar)}
                  />
                )}

                {activeTab === 'voice' && (
                  <VoiceSettings
                    voiceSettings={customization.voice}
                    onVoiceChange={(voice) => handleCustomizationChange('voice', voice)}
                    projectLanguage={projectContext.language}
                  />
                )}

                {activeTab === 'background' && (
                  <BackgroundOptions
                    backgroundSettings={customization.background}
                    onBackgroundChange={(background) => handleCustomizationChange('background', background)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          {isPreviewVisible && (
            <div className="lg:col-span-1">
              <PreviewPanel
                customization={customization}
                projectContext={projectContext}
                onClose={() => setIsPreviewVisible(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile Preview Button */}
        <div className="md:hidden fixed bottom-20 right-4 z-40">
          <button
            onClick={togglePreviewPanel}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="Eye" size={20} />
          </button>
        </div>

        {/* Mobile Preview Overlay */}
        {isPreviewVisible && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-lg w-full max-w-sm max-h-[80vh] overflow-hidden">
              <PreviewPanel
                customization={customization}
                projectContext={projectContext}
                onClose={() => setIsPreviewVisible(false)}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarVoiceCustomization;