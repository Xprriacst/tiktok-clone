import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const PreviewExportStep = ({ projectData, onBack, onComplete, onSaveDraft }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(45);
  const [exportSettings, setExportSettings] = useState({
    quality: '1080p',
    format: 'mp4',
    includeWatermark: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const videoRef = useRef(null);

  const qualityOptions = [
    { id: '720p', name: '720p HD', size: '~15MB', description: 'Good quality, smaller file' },
    { id: '1080p', name: '1080p Full HD', size: '~25MB', description: 'High quality, recommended' },
    { id: '1440p', name: '1440p 2K', size: '~45MB', description: 'Premium quality, larger file' }
  ];

  const formatOptions = [
    { id: 'mp4', name: 'MP4', description: 'Universal compatibility' },
    { id: 'mov', name: 'MOV', description: 'High quality, Apple devices' },
    { id: 'webm', name: 'WebM', description: 'Web optimized' }
  ];

  // Simulate video generation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            setIsGenerating(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  // Simulate video playback
  useEffect(() => {
    let interval;
    if (isPlaying && !isGenerating) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isGenerating]);

  const handlePlayPause = () => {
    if (isGenerating) return;
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (isGenerating) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    setCurrentTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setExportProgress(i);
    }

    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${projectData.name || 'tiktok-avatar-clone'}.${exportSettings.format}`;
    link.click();

    setIsExporting(false);
    setExportProgress(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEstimatedFileSize = () => {
    const quality = qualityOptions.find(q => q.id === exportSettings.quality);
    return quality?.size || '~25MB';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Eye" size={32} className="text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Preview & Export
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          Review your AI avatar video and export it in your preferred format and quality.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Preview */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-border p-6">
            <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden relative max-w-sm mx-auto">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                  <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
                    <Icon name="Loader2" size={32} className="text-primary animate-spin" />
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-text-primary mb-1">
                      Generating Video
                    </div>
                    <div className="text-sm text-text-secondary">
                      Creating your AI avatar video...
                    </div>
                  </div>
                  <div className="w-48 bg-background rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-text-secondary">
                    {generationProgress}% Complete
                  </div>
                </div>
              ) : (
                <>
                  {/* Mock Video Preview */}
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white">
                          <Image
                            src={projectData.selectedAvatar?.thumbnail || 'https://randomuser.me/api/portraits/women/1.jpg'}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-white text-sm font-medium px-4">
                          AI Avatar Speaking
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Play/Pause Overlay */}
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Icon 
                        name={isPlaying ? 'Pause' : 'Play'} 
                        size={24} 
                        className="text-black ml-1" 
                      />
                    </div>
                  </button>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
                    <div className="flex items-center space-x-3 text-white text-sm">
                      <span>{formatTime(currentTime)}</span>
                      <div 
                        className="flex-1 h-1 bg-white bg-opacity-30 rounded-full cursor-pointer"
                        onClick={handleSeek}
                      >
                        <div 
                          className="h-1 bg-white rounded-full transition-all duration-100"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                        />
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Video Controls */}
            {!isGenerating && (
              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
                  title="Restart"
                >
                  <Icon name="RotateCcw" size={20} className="text-text-secondary" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
                </button>
                <button
                  onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                  className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
                  title="Forward 10s"
                >
                  <Icon name="FastForward" size={20} className="text-text-secondary" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Export Settings */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Project Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Avatar:</span>
                <span className="text-text-primary">{projectData.selectedAvatar?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Language:</span>
                <span className="text-text-primary">{projectData.detectedLanguage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Duration:</span>
                <span className="text-text-primary">{duration}s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Resolution:</span>
                <span className="text-text-primary">1080x1920</span>
              </div>
            </div>
          </div>

          {/* Export Settings */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Export Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Quality
                </label>
                <div className="space-y-2">
                  {qualityOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setExportSettings(prev => ({ ...prev, quality: option.id }))}
                      className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                        exportSettings.quality === option.id
                          ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-background'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-xs text-text-secondary">{option.description}</div>
                        </div>
                        <div className="text-xs text-text-secondary">{option.size}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Format
                </label>
                <div className="space-y-2">
                  {formatOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setExportSettings(prev => ({ ...prev, format: option.id }))}
                      className={`w-full p-3 text-left rounded-lg border transition-colors duration-200 ${
                        exportSettings.format === option.id
                          ? 'border-secondary bg-secondary-50 text-secondary' :'border-border hover:border-secondary-300 hover:bg-background'
                      }`}
                    >
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-text-secondary">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="watermark"
                  checked={exportSettings.includeWatermark}
                  onChange={(e) => setExportSettings(prev => ({ ...prev, includeWatermark: e.target.checked }))}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500"
                />
                <label htmlFor="watermark" className="text-sm text-text-primary">
                  Include AI-generated watermark
                </label>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">Estimated file size:</span>
                <span className="text-text-primary font-medium">{getEstimatedFileSize()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Export time:</span>
                <span className="text-text-primary font-medium">~30 seconds</span>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isGenerating || isExporting}
            className="w-full bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isExporting ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Exporting... {exportProgress}%</span>
              </>
            ) : (
              <>
                <Icon name="Download" size={16} />
                <span>Export Video</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Back to Customization</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={onSaveDraft}
            className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="Save" size={16} />
            <span>Save Project</span>
          </button>
          
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <span>View in Library</span>
            <Icon name="ArrowRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewExportStep;