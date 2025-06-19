import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const VideoPlayer = ({ videoUrl, thumbnail, title, duration, transcription }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showTranscription, setShowTranscription] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const controlsTimeoutRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error('Video error:', e);
      setVideoError('There was an error loading the video');
      setIsLoading(false);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset video player when videoUrl changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      setIsLoading(true);
      setVideoError(null);
      setCurrentTime(0);
      setIsPlaying(false);
      
      // Check if the videoUrl is a Blob/Object URL (from file upload) or a remote URL
      if (typeof videoUrl === 'object' && videoUrl instanceof Blob) {
        const objectUrl = URL.createObjectURL(videoUrl);
        videoRef.current.src = objectUrl;
        
        return () => URL.revokeObjectURL(objectUrl);
      } else if (typeof videoUrl === 'string') {
        videoRef.current.src = videoUrl;
        videoRef.current.load();
      }
    }
  }, [videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || isLoading || videoError) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error('Play error:', err);
        setVideoError('Video playback failed. Please try again.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || isLoading || videoError) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * videoDuration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

  const skipTime = (seconds) => {
    const video = videoRef.current;
    if (!video || isLoading || videoError) return;

    const newTime = Math.max(0, Math.min(videoDuration, currentTime + seconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRetry = () => {
    if (!videoRef.current) return;
    
    setVideoError(null);
    setIsLoading(true);
    videoRef.current.load();
  };

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Video Container */}
      <div 
        className="relative aspect-[9/16] bg-black group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <Icon name="Loader2" size={48} className="text-white animate-spin" />
          </div>
        )}

        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 px-4 text-center">
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

        <video
          ref={videoRef}
          src={typeof videoUrl === 'object' ? undefined : videoUrl}
          poster={thumbnail}
          className="w-full h-full object-cover"
          onClick={togglePlay}
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          playsInline
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && !isLoading && !videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
            >
              <Icon name="Play" size={24} className="text-black ml-1" />
            </button>
          </div>
        )}

        {/* Controls */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div className="mb-4">
            <div 
              className="w-full h-1 bg-white bg-opacity-30 rounded-full cursor-pointer"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-white rounded-full transition-all duration-100"
                style={{ width: `${(currentTime / videoDuration) * 100 || 0}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                disabled={isLoading || videoError}
                className="text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={20} />
              </button>
              
              <button
                onClick={() => skipTime(-10)}
                disabled={isLoading || videoError}
                className="text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon name="RotateCcw" size={18} />
              </button>
              
              <button
                onClick={() => skipTime(10)}
                disabled={isLoading || videoError}
                className="text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon name="RotateCw" size={18} />
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  disabled={isLoading || videoError}
                  className="text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
                >
                  <Icon name={isMuted ? "VolumeX" : "Volume2"} size={18} />
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  disabled={isLoading || videoError}
                  className="w-16 h-1 bg-white bg-opacity-30 rounded-full appearance-none slider disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
              
              <button
                onClick={toggleFullscreen}
                disabled={isLoading || videoError}
                className="text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Touch Controls */}
        <div className="absolute inset-0 md:hidden z-10">
          <div className="grid grid-cols-3 h-full">
            <div onClick={() => skipTime(-10)} className="flex items-center justify-center">
              <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 active:opacity-100 transition-opacity duration-200">
                <Icon name="RotateCcw" size={20} className="text-white" />
              </div>
            </div>
            <div onClick={togglePlay} className="flex items-center justify-center" />
            <div onClick={() => skipTime(10)} className="flex items-center justify-center">
              <div className="w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 active:opacity-100 transition-opacity duration-200">
                <Icon name="RotateCw" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          <button
            onClick={() => setShowTranscription(!showTranscription)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
              showTranscription 
                ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon name="FileText" size={14} className="mr-1" />
            Transcript
          </button>
        </div>

        {showTranscription && transcription && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border-light">
            <h4 className="text-sm font-semibold text-text-primary mb-2">Transcription</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;