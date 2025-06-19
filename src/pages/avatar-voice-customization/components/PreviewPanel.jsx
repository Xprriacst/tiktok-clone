import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const PreviewPanel = ({ customization, projectContext, onClose, isMobile = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(45); // Mock duration in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState('avatar'); // avatar, voice, background
  const intervalRef = useRef(null);

  const sampleScript = `Welcome to our TikTok Avatar Cloner! This revolutionary AI technology transforms any TikTok video into a personalized avatar presentation. Watch as your chosen avatar speaks with natural expressions and synchronized lip movements, bringing your content to life in ways you never imagined possible.`;

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      setIsLoading(true);
      
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        
        // Simulate playback progress
        intervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= duration) {
              setIsPlaying(false);
              clearInterval(intervalRef.current);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }, 1500);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBackgroundStyle = () => {
    switch (customization.background.type) {
      case 'solid':
        return { backgroundColor: customization.background.color };
      case 'gradient':
        return { background: customization.background.gradient };
      case 'studio': case'dynamic':
        return { 
          backgroundImage: `url(${customization.background.thumbnail || 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`bg-surface rounded-lg border border-border ${isMobile ? 'h-full' : 'sticky top-32'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-text-primary">Live Preview</h3>
        <div className="flex items-center space-x-2">
          {!isMobile && (
            <div className="flex items-center space-x-1 bg-background rounded-lg p-1">
              {['avatar', 'voice', 'background'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`
                    px-2 py-1 text-xs font-medium rounded transition-colors duration-200 capitalize
                    ${previewMode === mode
                      ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-background transition-colors duration-200"
            >
              <Icon name="X" size={16} className="text-text-secondary" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="p-4">
        <div className="relative">
          {/* Video Preview Container */}
          <div 
            className="aspect-[9/16] max-h-96 rounded-lg overflow-hidden relative"
            style={getBackgroundStyle()}
          >
            {/* Avatar */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-32 h-40 rounded-lg overflow-hidden border-2 border-white/20 shadow-lg">
                  <Image
                    src={customization.avatar.thumbnail}
                    alt={customization.avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Speaking Animation Indicator */}
                {isPlaying && !isLoading && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="flex items-center space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 h-4 bg-accent rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
                  <p className="text-sm">Generating preview...</p>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
                >
                  <Icon name="Play" size={24} />
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="w-full h-2 bg-background rounded-full cursor-pointer"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-200"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                className="p-2 rounded-full hover:bg-background transition-colors duration-200"
                title="Rewind 10s"
              >
                <Icon name="RotateCcw" size={16} className="text-text-secondary" />
              </button>
              
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon 
                  name={isLoading ? "Loader2" : isPlaying ? "Pause" : "Play"} 
                  size={20} 
                  className={isLoading ? "animate-spin" : ""} 
                />
              </button>
              
              <button
                onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                className="p-2 rounded-full hover:bg-background transition-colors duration-200"
                title="Forward 10s"
              >
                <Icon name="RotateCw" size={16} className="text-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Information */}
        <div className="mt-6 space-y-4">
          {/* Current Settings */}
          <div className="bg-background rounded-lg p-3">
            <h4 className="text-sm font-medium text-text-primary mb-2">Current Settings</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Avatar:</span>
                <span className="text-text-primary font-medium">{customization.avatar.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Voice:</span>
                <span className="text-text-primary font-medium">
                  {customization.voice.language} • {customization.voice.emotion}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Background:</span>
                <span className="text-text-primary font-medium capitalize">
                  {customization.background.type}
                </span>
              </div>
            </div>
          </div>

          {/* Sample Script */}
          <div className="bg-background rounded-lg p-3">
            <h4 className="text-sm font-medium text-text-primary mb-2">Sample Script</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {sampleScript}
            </p>
          </div>

          {/* Quality Settings */}
          <div className="bg-background rounded-lg p-3">
            <h4 className="text-sm font-medium text-text-primary mb-2">Output Quality</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Resolution:</span>
                <span className="text-text-primary font-medium">1080x1920 (9:16)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Frame Rate:</span>
                <span className="text-text-primary font-medium">30 FPS</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-text-primary font-medium">{projectContext.duration}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isMobile && (
          <div className="mt-6 space-y-2">
            <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200">
              Generate Full Preview
            </button>
            <button className="w-full px-4 py-2 bg-background border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200">
              Download Sample
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;