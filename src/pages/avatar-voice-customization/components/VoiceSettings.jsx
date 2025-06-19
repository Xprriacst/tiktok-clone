import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';

const VoiceSettings = ({ voiceSettings, onVoiceChange, projectLanguage }) => {
  const [isPlaying, setIsPlaying] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

  // Mock voice options based on language
  const voiceOptions = {
    'en-US': [
      { id: 'voice_001', name: 'Sarah', gender: 'female', accent: 'american', description: 'Professional, clear, confident' },
      { id: 'voice_002', name: 'Michael', gender: 'male', accent: 'american', description: 'Warm, authoritative, engaging' },
      { id: 'voice_003', name: 'Emma', gender: 'female', accent: 'british', description: 'Elegant, sophisticated, articulate' },
      { id: 'voice_004', name: 'David', gender: 'male', accent: 'british', description: 'Distinguished, trustworthy, clear' }
    ],
    'es-ES': [
      { id: 'voice_005', name: 'Maria', gender: 'female', accent: 'spanish', description: 'Melodic, expressive, natural' },
      { id: 'voice_006', name: 'Carlos', gender: 'male', accent: 'spanish', description: 'Strong, confident, articulate' }
    ],
    'fr-FR': [
      { id: 'voice_007', name: 'Sophie', gender: 'female', accent: 'french', description: 'Elegant, refined, expressive' },
      { id: 'voice_008', name: 'Pierre', gender: 'male', accent: 'french', description: 'Sophisticated, clear, engaging' }
    ]
  };

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' }
  ];

  const emotionOptions = [
    { value: 'neutral', label: 'Neutral', description: 'Balanced and professional' },
    { value: 'confident', label: 'Confident', description: 'Assertive and strong' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'excited', label: 'Excited', description: 'Energetic and enthusiastic' },
    { value: 'calm', label: 'Calm', description: 'Soothing and relaxed' },
    { value: 'authoritative', label: 'Authoritative', description: 'Commanding and serious' }
  ];

  const currentVoices = voiceOptions[voiceSettings.language] || voiceOptions['en-US'];

  const handleLanguageChange = (language) => {
    const newVoices = voiceOptions[language] || voiceOptions['en-US'];
    onVoiceChange({
      language,
      voiceId: newVoices[0]?.id || 'voice_001',
      gender: newVoices[0]?.gender || 'female',
      accent: newVoices[0]?.accent || 'american'
    });
  };

  const handleVoiceSelect = (voice) => {
    onVoiceChange({
      voiceId: voice.id,
      gender: voice.gender,
      accent: voice.accent
    });
  };

  const handleSliderChange = (property, value) => {
    onVoiceChange({ [property]: value });
  };

  const handleEmotionChange = (emotion) => {
    onVoiceChange({ emotion });
  };

  const playVoiceSample = async (voiceId) => {
    setIsPlaying(voiceId);
    setAudioLoading(true);

    // Simulate audio loading and playback
    setTimeout(() => {
      setAudioLoading(false);
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(null);
      }, 3000);
    }, 500);
  };

  const sampleText = `Hello! This is a sample of how your AI avatar will sound when speaking. The voice characteristics can be adjusted to match your content perfectly.`;

  return (
    <div className="space-y-8">
      {/* Language Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Language & Region</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200
                ${voiceSettings.language === lang.code
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-background'
                }
              `}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {voiceSettings.language === lang.code && (
                <Icon name="Check" size={16} className="ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Voice Character</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentVoices.map((voice) => (
            <div
              key={voice.id}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${voiceSettings.voiceId === voice.id
                  ? 'border-primary bg-primary-50' :'border-border hover:border-primary-300 hover:bg-background'
                }
              `}
              onClick={() => handleVoiceSelect(voice)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-text-primary">{voice.name}</h4>
                  <p className="text-sm text-text-secondary capitalize">
                    {voice.gender} • {voice.accent}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {voiceSettings.voiceId === voice.id && (
                    <Icon name="CheckCircle" size={16} className="text-primary" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(voice.id);
                    }}
                    disabled={audioLoading}
                    className="p-2 rounded-full hover:bg-background transition-colors duration-200"
                  >
                    <Icon 
                      name={isPlaying === voice.id ? "Pause" : "Play"} 
                      size={16} 
                      className={`${isPlaying === voice.id ? 'text-primary' : 'text-text-secondary'}`} 
                    />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary">{voice.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Characteristics */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Voice Characteristics</h3>
        <div className="space-y-6">
          {/* Pitch Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">Pitch</label>
              <span className="text-sm text-text-secondary">
                {voiceSettings.pitch > 0 ? '+' : ''}{voiceSettings.pitch}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={voiceSettings.pitch}
              onChange={(e) => handleSliderChange('pitch', parseInt(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>Lower</span>
              <span>Higher</span>
            </div>
          </div>

          {/* Speed Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-text-primary">Speed</label>
              <span className="text-sm text-text-secondary">{voiceSettings.speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceSettings.speed}
              onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
              className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-secondary mt-1">
              <span>0.5x</span>
              <span>2.0x</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emotional Tone */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Emotional Tone</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              onClick={() => handleEmotionChange(emotion.value)}
              className={`
                p-3 rounded-lg border text-left transition-all duration-200
                ${voiceSettings.emotion === emotion.value
                  ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-background'
                }
              `}
            >
              <div className="font-medium mb-1">{emotion.label}</div>
              <div className="text-xs opacity-75">{emotion.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Voice Preview */}
      <div className="bg-background rounded-lg p-4 border border-border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-text-primary">Voice Preview</h4>
          <button
            onClick={() => playVoiceSample('preview')}
            disabled={audioLoading}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Icon 
              name={isPlaying === 'preview' ? "Pause" : "Play"} 
              size={16} 
              className={audioLoading ? "animate-spin" : ""} 
            />
            <span>{isPlaying === 'preview' ? 'Playing...' : 'Play Sample'}</span>
          </button>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {sampleText}
        </p>
        
        {/* Current Settings Summary */}
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Language:</span>
              <div className="font-medium text-text-primary">
                {languages.find(l => l.code === voiceSettings.language)?.name || 'English (US)'}
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Voice:</span>
              <div className="font-medium text-text-primary">
                {currentVoices.find(v => v.id === voiceSettings.voiceId)?.name || 'Sarah'}
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Emotion:</span>
              <div className="font-medium text-text-primary capitalize">
                {voiceSettings.emotion}
              </div>
            </div>
            <div>
              <span className="text-text-secondary">Settings:</span>
              <div className="font-medium text-text-primary">
                {voiceSettings.speed}x, {voiceSettings.pitch > 0 ? '+' : ''}{voiceSettings.pitch}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;