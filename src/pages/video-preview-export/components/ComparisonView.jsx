import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ComparisonView = ({ originalVideo, generatedVideo, lipSyncAccuracy }) => {
  const originalRef = useRef(null);
  const generatedRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynced, setIsSynced] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isOriginalReady, setIsOriginalReady] = useState(false);
  const [isGeneratedReady, setIsGeneratedReady] = useState(false);
  const [isOriginalLoading, setIsOriginalLoading] = useState(true);
  const [isGeneratedLoading, setIsGeneratedLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const controlsTimeoutRef = useRef(null);

  // Setup video elements when sources change
  useEffect(() => {
    setIsOriginalLoading(true);
    setIsGeneratedLoading(true);
    setVideoError(null);
    setIsOriginalReady(false);
    setIsGeneratedReady(false);
    setIsPlaying(false);
    
    // Handle original video
    if (originalRef.current) {
      if (typeof originalVideo === 'object' && originalVideo instanceof Blob) {
        const objectUrl = URL.createObjectURL(originalVideo);
        originalRef.current.src = objectUrl;
        
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof originalVideo === 'string') {
        originalRef.current.src = originalVideo;
        originalRef.current.load();
      }
    }
    
    // Handle generated video
    if (generatedRef.current) {
      if (typeof generatedVideo === 'object' && generatedVideo instanceof Blob) {
        const objectUrl = URL.createObjectURL(generatedVideo);
        generatedRef.current.src = objectUrl;
        
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof generatedVideo === 'string') {
        generatedRef.current.src = generatedVideo;
        generatedRef.current.load();
      }
    }
  }, [originalVideo, generatedVideo]);

  useEffect(() => {
    const originalVideo = originalRef.current;
    const generatedVideo = generatedRef.current;
    
    if (!originalVideo || !generatedVideo) return;

    const handleOriginalLoaded = () => {
      setIsOriginalLoading(false);
      setIsOriginalReady(true);
    };

    const handleGeneratedLoaded = () => {
      setIsGeneratedLoading(false);
      setIsGeneratedReady(true);
    };

    const handleOriginalError = (e) => {
      console.error('Original video error:', e);
      setVideoError('Error loading original video');
      setIsOriginalLoading(false);
    };

    const handleGeneratedError = (e) => {
      console.error('Generated video error:', e);
      setVideoError('Error loading generated video');
      setIsGeneratedLoading(false);
    };

    const handleTimeUpdate = () => {
      if (isSynced && isPlaying) {
        // Keep videos in sync
        if (Math.abs(originalVideo.currentTime - generatedVideo.currentTime) > 0.5) {
          generatedVideo.currentTime = originalVideo.currentTime;
        }
      }
    };

    originalVideo.addEventListener('canplay', handleOriginalLoaded);
    generatedVideo.addEventListener('canplay', handleGeneratedLoaded);
    originalVideo.addEventListener('error', handleOriginalError);
    generatedVideo.addEventListener('error', handleGeneratedError);
    originalVideo.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      originalVideo.removeEventListener('canplay', handleOriginalLoaded);
      generatedVideo.removeEventListener('canplay', handleGeneratedLoaded);
      originalVideo.removeEventListener('error', handleOriginalError);
      generatedVideo.removeEventListener('error', handleGeneratedError);
      originalVideo.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isSynced, isPlaying]);

  const togglePlay = () => {
    if (!isOriginalReady || !isGeneratedReady || videoError) return;

    if (isPlaying) {
      originalRef.current.pause();
      generatedRef.current.pause();
    } else {
      // Try to play both videos
      Promise.all([
        originalRef.current.play().catch(err => {
          console.error('Error playing original video:', err);
          setVideoError('Error playing original video');
          return Promise.reject(err);
        }),
        generatedRef.current.play().catch(err => {
          console.error('Error playing generated video:', err);
          setVideoError('Error playing generated video');
          return Promise.reject(err);
        })
      ])
      .then(() => {
        setIsPlaying(true);
      })
      .catch(() => {
        // Error handling already done in the individual catch blocks
        setIsPlaying(false);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e) => {
    setSliderPosition(parseInt(e.target.value, 10));
  };

  const resetVideos = () => {
    if (originalRef.current) originalRef.current.currentTime = 0;
    if (generatedRef.current) generatedRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const toggleSync = () => {
    setIsSynced(!isSynced);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleRetry = () => {
    if (originalRef.current) originalRef.current.load();
    if (generatedRef.current) generatedRef.current.load();
    setIsOriginalLoading(true);
    setIsGeneratedLoading(true);
    setVideoError(null);
  };

  const isLoading = isOriginalLoading || isGeneratedLoading;

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Video Comparison</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Lip-sync Accuracy:</span>
              <span className="text-sm font-medium text-success">{lipSyncAccuracy}%</span>
            </div>
            <button
              onClick={toggleSync}
              className={`px-3 py-1 rounded-lg text-xs font-medium ${isSynced ? 'bg-primary text-white' : 'bg-background text-text-secondary hover:text-text-primary'}`}
            >
              {isSynced ? 'Synced' : 'Independent'}
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Container */}
      <div 
        className="relative bg-black aspect-[9/16] max-w-lg mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
            <Icon name="Loader2" size={48} className="text-white animate-spin" />
          </div>
        )}

        {/* Error Overlay */}
        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-30 px-4 text-center">
            <Icon name="AlertTriangle" size={48} className="text-error mb-4" />
            <p className="text-white mb-4">{videoError}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Original Video */}
        <video 
          ref={originalRef}
          className="absolute inset-0 w-full h-full object-cover" 
          muted
          playsInline
        />

        {/* Generated Video with Clip Path */}
        <video 
          ref={generatedRef}
          className="absolute inset-0 w-full h-full object-cover" 
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
          muted
          playsInline
        />

        {/* Slider Divider */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white z-10"
          style={{ left: `${sliderPosition}%` }}
        />

        {/* Slider Thumb */}
        <div 
          className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg z-20 flex items-center justify-center cursor-move"
          style={{ left: `${sliderPosition}%`, marginLeft: '-16px' }}
        >
          <div className="flex items-center">
            <Icon name="ArrowLeft" size={10} className="text-black" />
            <Icon name="ArrowRight" size={10} className="text-black" />
          </div>
        </div>

        {/* Video Labels */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium z-10">
          Original
        </div>
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium z-10">
          AI Generated
        </div>

        {/* Slider Input (invisible, for accessibility) */}
        <input
          type="range"
          min="1"
          max="99"
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute bottom-16 left-0 right-0 w-full opacity-0 cursor-pointer z-20 h-8"
          aria-label="Comparison slider"
        />

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={resetVideos}
              className="p-2 text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              disabled={isLoading || videoError}
            >
              <Icon name="RotateCcw" size={18} />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 disabled:opacity-50"
              disabled={isLoading || videoError}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={20} className="text-black ml-0.5" />
            </button>

            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="99"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="w-48 h-1 bg-white bg-opacity-30 rounded-full appearance-none slider"
                aria-label="Comparison slider"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="text-sm font-medium text-text-primary mb-1">Original</h4>
            <p className="text-xs text-text-secondary">Source video without modifications</p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-text-primary mb-1">AI Generated</h4>
            <p className="text-xs text-text-secondary">Avatar version with synced speech</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
