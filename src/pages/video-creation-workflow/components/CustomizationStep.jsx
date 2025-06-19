import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const CustomizationStep = ({ projectData, onComplete, onBack, onSaveDraft }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [voiceSettings, setVoiceSettings] = useState({
    pitch: 50,
    speed: 50,
    accent: 'neutral'
  });
  const [backgroundSettings, setBackgroundSettings] = useState({
    type: 'solid',
    color: '#ffffff',
    preset: 'studio-white'
  });
  const [expandedSection, setExpandedSection] = useState('avatar');

  const avatarOptions = [
    {
      id: 'avatar_1',
      name: 'Emma',
      gender: 'female',
      ethnicity: 'Caucasian',
      age: 'Young Adult',
      thumbnail: 'https://randomuser.me/api/portraits/women/1.jpg',
      description: 'Professional, friendly demeanor'
    },
    {
      id: 'avatar_2',
      name: 'Marcus',
      gender: 'male',
      ethnicity: 'African American',
      age: 'Adult',
      thumbnail: 'https://randomuser.me/api/portraits/men/2.jpg',
      description: 'Confident, engaging personality'
    },
    {
      id: 'avatar_3',
      name: 'Sofia',
      gender: 'female',
      ethnicity: 'Hispanic',
      age: 'Young Adult',
      thumbnail: 'https://randomuser.me/api/portraits/women/3.jpg',
      description: 'Warm, approachable style'
    },
    {
      id: 'avatar_4',
      name: 'David',
      gender: 'male',
      ethnicity: 'Asian',
      age: 'Adult',
      thumbnail: 'https://randomuser.me/api/portraits/men/4.jpg',
      description: 'Professional, articulate'
    },
    {
      id: 'avatar_5',
      name: 'Zara',
      gender: 'female',
      ethnicity: 'Middle Eastern',
      age: 'Young Adult',
      thumbnail: 'https://randomuser.me/api/portraits/women/5.jpg',
      description: 'Dynamic, expressive'
    },
    {
      id: 'avatar_6',
      name: 'James',
      gender: 'male',
      ethnicity: 'Caucasian',
      age: 'Mature Adult',
      thumbnail: 'https://randomuser.me/api/portraits/men/6.jpg',
      description: 'Authoritative, trustworthy'
    }
  ];

  const voiceAccents = [
    { id: 'neutral', name: 'Neutral', description: 'Standard pronunciation' },
    { id: 'american', name: 'American', description: 'US English accent' },
    { id: 'british', name: 'British', description: 'UK English accent' },
    { id: 'australian', name: 'Australian', description: 'Australian English' },
    { id: 'canadian', name: 'Canadian', description: 'Canadian English' }
  ];

  const backgroundPresets = [
    {
      id: 'studio-white',
      name: 'Studio White',
      type: 'solid',
      color: '#ffffff',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=300&fit=crop'
    },
    {
      id: 'studio-gray',
      name: 'Studio Gray',
      type: 'solid',
      color: '#f5f5f5',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=300&fit=crop&sat=-100'
    },
    {
      id: 'gradient-blue',
      name: 'Blue Gradient',
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=200&h=300&fit=crop'
    },
    {
      id: 'office-modern',
      name: 'Modern Office',
      type: 'preset',
      thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=300&fit=crop'
    },
    {
      id: 'home-studio',
      name: 'Home Studio',
      type: 'preset',
      thumbnail: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=300&fit=crop'
    },
    {
      id: 'dynamic',
      name: 'Dynamic (AI)',
      type: 'dynamic',
      description: 'AI-generated based on source video',
      thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=300&fit=crop'
    }
  ];

  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleVoiceChange = (setting, value) => {
    setVoiceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleBackgroundSelect = (background) => {
    setBackgroundSettings({
      type: background.type,
      color: background.color || '#ffffff',
      preset: background.id,
      gradient: background.gradient
    });
  };

  const handleContinue = () => {
    if (!selectedAvatar) {
      alert('Please select an avatar to continue');
      return;
    }

    onComplete({
      selectedAvatar,
      voiceSettings,
      backgroundSettings,
      customizationComplete: true
    });
  };

  const getSectionIcon = (section) => {
    switch (section) {
      case 'avatar': return 'User';
      case 'voice': return 'Volume2';
      case 'background': return 'Image';
      default: return 'Settings';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Settings" size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Customize Your Avatar
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Choose your AI avatar, adjust voice settings, and select the perfect background 
          for your generated video.
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar Selection */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => handleSectionToggle('avatar')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name={getSectionIcon('avatar')} size={20} className="text-primary" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-text-primary">Avatar Selection</h3>
                <p className="text-sm text-text-secondary">
                  {selectedAvatar ? `Selected: ${selectedAvatar.name}` : 'Choose your AI avatar'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {selectedAvatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={selectedAvatar.thumbnail}
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-secondary transition-transform duration-200 ${
                  expandedSection === 'avatar' ? 'rotate-180' : ''
                }`} 
              />
            </div>
          </button>

          {expandedSection === 'avatar' && (
            <div className="px-6 pb-6 border-t border-border-light">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedAvatar?.id === avatar.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300 hover:bg-background'
                    }`}
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-2">
                      <Image
                        src={avatar.thumbnail}
                        alt={avatar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-text-primary">{avatar.name}</div>
                      <div className="text-xs text-text-secondary">{avatar.gender}</div>
                      <div className="text-xs text-text-secondary">{avatar.ethnicity}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Voice Settings */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => handleSectionToggle('voice')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name={getSectionIcon('voice')} size={20} className="text-secondary" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-text-primary">Voice Settings</h3>
                <p className="text-sm text-text-secondary">
                  Adjust pitch, speed, and accent
                </p>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform duration-200 ${
                expandedSection === 'voice' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {expandedSection === 'voice' && (
            <div className="px-6 pb-6 border-t border-border-light">
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Pitch: {voiceSettings.pitch}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={voiceSettings.pitch}
                      onChange={(e) => handleVoiceChange('pitch', parseInt(e.target.value))}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>Lower</span>
                      <span>Higher</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Speed: {voiceSettings.speed}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={voiceSettings.speed}
                      onChange={(e) => handleVoiceChange('speed', parseInt(e.target.value))}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-1">
                      <span>Slower</span>
                      <span>Faster</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Accent
                  </label>
                  <div className="space-y-2">
                    {voiceAccents.map((accent) => (
                      <button
                        key={accent.id}
                        onClick={() => handleVoiceChange('accent', accent.id)}
                        className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                          voiceSettings.accent === accent.id
                            ? 'border-secondary bg-secondary-50 text-secondary' :'border-border hover:border-secondary-300 hover:bg-background'
                        }`}
                      >
                        <div className="font-medium">{accent.name}</div>
                        <div className="text-sm text-text-secondary">{accent.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Background Settings */}
        <div className="bg-surface rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => handleSectionToggle('background')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name={getSectionIcon('background')} size={20} className="text-accent" />
              <div className="text-left">
                <h3 className="text-lg font-semibold text-text-primary">Background</h3>
                <p className="text-sm text-text-secondary">
                  Choose background style and color
                </p>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform duration-200 ${
                expandedSection === 'background' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {expandedSection === 'background' && (
            <div className="px-6 pb-6 border-t border-border-light">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {backgroundPresets.map((background) => (
                  <button
                    key={background.id}
                    onClick={() => handleBackgroundSelect(background)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      backgroundSettings.preset === background.id
                        ? 'border-accent bg-accent-50' :'border-border hover:border-accent-300 hover:bg-background'
                    }`}
                  >
                    <div className="w-full aspect-[9/16] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={background.thumbnail}
                        alt={background.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-text-primary">{background.name}</div>
                      {background.description && (
                        <div className="text-xs text-text-secondary">{background.description}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {selectedAvatar && (
        <div className="bg-surface rounded-lg border border-border p-6 mt-8">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Preview</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-[9/16] bg-background rounded-lg overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <Image
                      src={selectedAvatar.thumbnail}
                      alt={selectedAvatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-text-secondary">
                    Avatar preview will appear here
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Selected Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Avatar:</span>
                    <span className="text-text-primary">{selectedAvatar.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Voice Pitch:</span>
                    <span className="text-text-primary">{voiceSettings.pitch}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Voice Speed:</span>
                    <span className="text-text-primary">{voiceSettings.speed}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Accent:</span>
                    <span className="text-text-primary capitalize">{voiceSettings.accent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Background:</span>
                    <span className="text-text-primary">
                      {backgroundPresets.find(bg => bg.id === backgroundSettings.preset)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              <button className="w-full bg-accent text-white px-4 py-2 rounded-lg font-medium hover:bg-accent-600 transition-colors duration-200 flex items-center justify-center space-x-2">
                <Icon name="Play" size={16} />
                <span>Preview Voice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Back to Processing</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={onSaveDraft}
            className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="Save" size={16} />
            <span>Save Draft</span>
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedAvatar}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <span>Generate Preview</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationStep;