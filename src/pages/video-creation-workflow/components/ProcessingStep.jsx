import React, { useState, useEffect, useRef } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ProcessingStep = ({ projectData, onComplete, onBack, onNavigateToProcessing }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [processingData, setProcessingData] = useState({
    videoProcessing: { status: 'pending', progress: 0, eta: '30s' },
    audioExtraction: { status: 'pending', progress: 0, eta: '15s' },
    transcription: { status: 'pending', progress: 0, eta: '45s' },
    languageDetection: { status: 'pending', progress: 0, eta: '10s' }
  });
  const [detectedContent, setDetectedContent] = useState(null);
  const videoRef = useRef(null);
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoMetadata, setVideoMetadata] = useState(null);

  const stages = [
    {
      key: 'videoProcessing',
      title: projectData.isLocalFile ? 'Processing Video' : 'Downloading Video',
      description: projectData.isLocalFile ? 'Analyzing video file' : 'Fetching video from TikTok servers',
      icon: 'Video',
      color: 'text-primary'
    },
    {
      key: 'audioExtraction',
      title: 'Extracting Audio',
      description: 'Separating audio track from video',
      icon: 'Volume2',
      color: 'text-secondary'
    },
    {
      key: 'transcription',
      title: 'Transcribing Speech',
      description: 'Converting speech to text using AI',
      icon: 'FileText',
      color: 'text-accent'
    },
    {
      key: 'languageDetection',
      title: 'Detecting Language',
      description: 'Identifying spoken language and accent',
      icon: 'Globe',
      color: 'text-warning'
    }
  ];

  useEffect(() => {
    // If local video file is provided, create an object URL and extract metadata
    if (projectData.isLocalFile && projectData.localVideoFile) {
      const videoUrl = URL.createObjectURL(projectData.localVideoFile);
      
      if (videoRef.current) {
        videoRef.current.src = videoUrl;
        videoRef.current.onloadedmetadata = () => {
          const video = videoRef.current;
          setVideoDuration(video.duration);
          setVideoMetadata({
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration
          });
          
          // Create thumbnail from video
          video.currentTime = video.duration * 0.25; // 25% into the video
        };
        
        videoRef.current.onseeked = () => {
          const canvas = document.createElement('canvas');
          const video = videoRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const thumbnailUrl = canvas.toDataURL('image/jpeg');
          setVideoThumbnail(thumbnailUrl);
          
          // Update source video with actual metadata
          const updatedSourceVideo = {
            ...projectData.sourceVideo,
            duration: Math.round(video.duration),
            thumbnail: thumbnailUrl,
            resolution: `${video.videoWidth}x${video.videoHeight}`
          };
          
          // Start processing after metadata extraction
          startProcessing(updatedSourceVideo);
        };
      }
      
      return () => {
        URL.revokeObjectURL(videoUrl);
      };
    } else {
      // If not a local file, start processing with existing data
      startProcessing();
    }
  }, []);

  const startProcessing = (updatedSourceVideo = null) => {
    const processStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        setCurrentStage(i);
        
        // Update stage to processing
        setProcessingData(prev => ({
          ...prev,
          [stage.key]: { ...prev[stage.key], status: 'processing' }
        }));

        // Simulate processing with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setProcessingData(prev => ({
            ...prev,
            [stage.key]: { ...prev[stage.key], progress }
          }));
        }

        // Mark stage as completed
        setProcessingData(prev => ({
          ...prev,
          [stage.key]: { ...prev[stage.key], status: 'completed', progress: 100 }
        }));

        // Add delay between stages
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Set detected content after processing
      const mockDetectedContent = {
        transcription: `Hey everyone! Welcome back to my channel. Today I'm going to show you this amazing life hack that will completely change how you organize your morning routine. Trust me, you're going to want to save this video because it's going to make your life so much easier. Let's get started!`,
        detectedLanguage: 'English (US)',
        confidence: 0.95,
        duration: updatedSourceVideo?.duration || projectData.sourceVideo.duration,
        wordCount: 52,
        speakingRate: 'Normal',
        audioQuality: 'High',
        backgroundNoise: 'Low'
      };

      setDetectedContent(mockDetectedContent);

      // Complete the step after a short delay
      setTimeout(() => {
        onComplete({
          transcription: mockDetectedContent.transcription,
          detectedLanguage: mockDetectedContent.detectedLanguage,
          processingComplete: true,
          audioAnalysis: {
            duration: mockDetectedContent.duration,
            quality: mockDetectedContent.audioQuality,
            speakingRate: mockDetectedContent.speakingRate
          },
          sourceVideo: updatedSourceVideo || projectData.sourceVideo
        });
      }, 2000);
    };

    processStages();
  };

  const getStageStatus = (stageIndex) => {
    if (stageIndex < currentStage) return 'completed';
    if (stageIndex === currentStage) return 'processing';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Loader2';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-primary';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Loader2" size={32} className="text-primary animate-spin" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          Processing Your Video
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto">
          We're analyzing your {projectData.isLocalFile ? 'uploaded' : 'TikTok'} video and preparing it for AI avatar generation. 
          This process typically takes 2-3 minutes.
        </p>
      </div>

      {/* Hidden video element for metadata extraction */}
      {projectData.isLocalFile && (
        <video 
          ref={videoRef} 
          className="hidden" 
          muted 
          playsInline
        />
      )}

      {/* Source Video Info */}
      {projectData.sourceVideo && (
        <div className="bg-surface rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-28 bg-background rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={videoThumbnail || projectData.sourceVideo.thumbnail}
                alt="Source video thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {projectData.sourceVideo.title}
              </h3>
              <p className="text-sm text-text-secondary mb-2">
                {projectData.isLocalFile ? 'Local Upload' : `by ${projectData.sourceVideo.author}`}
              </p>
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{projectData.sourceVideo.duration}s</span>
                </span>
                {!projectData.isLocalFile && (
                  <>
                    <span className="flex items-center space-x-1">
                      <Icon name="Eye" size={12} />
                      <span>{projectData.sourceVideo.views}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Heart" size={12} />
                      <span>{projectData.sourceVideo.likes}</span>
                    </span>
                  </>
                )}
                {videoMetadata && (
                  <span className="flex items-center space-x-1">
                    <Icon name="Maximize" size={12} />
                    <span>{videoMetadata.width}x{videoMetadata.height}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing Stages */}
      <div className="bg-surface rounded-lg border border-border p-6 md:p-8 mb-8">
        <div className="space-y-6">
          {stages.map((stage, index) => {
            const stageData = processingData[stage.key];
            const status = getStageStatus(index);
            
            return (
              <div key={stage.key} className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  status === 'completed' 
                    ? 'bg-success border-success' 
                    : status === 'processing' ?'bg-primary-50 border-primary' :'bg-background border-border'
                }`}>
                  <Icon 
                    name={status === 'processing' ? 'Loader2' : getStatusIcon(stageData.status)} 
                    size={20} 
                    className={`${
                      status === 'completed' 
                        ? 'text-white' 
                        : status === 'processing' ?'text-primary animate-spin' :'text-text-secondary'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-sm font-medium ${
                      status === 'completed' ? 'text-success' : 
                      status === 'processing' ? 'text-text-primary' : 'text-text-secondary'
                    }`}>
                      {stage.title}
                    </h3>
                    {status === 'processing' && (
                      <span className="text-xs text-text-secondary">
                        ETA: {stageData.eta}
                      </span>
                    )}
                    {status === 'completed' && (
                      <Icon name="Check" size={16} className="text-success" />
                    )}
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-2">
                    {stage.description}
                  </p>
                  
                  {(status === 'processing' || status === 'completed') && (
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          status === 'completed' ? 'bg-success' : 'bg-primary'
                        }`}
                        style={{ width: `${stageData.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detected Content Preview */}
      {detectedContent && (
        <div className="bg-surface rounded-lg border border-border p-6 md:p-8 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h3 className="text-lg font-semibold text-text-primary">Processing Complete</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-2">Transcribed Text</h4>
              <div className="bg-background rounded-lg p-4 text-sm text-text-secondary max-h-32 overflow-y-auto">
                {detectedContent.transcription}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-text-secondary">Language</div>
                  <div className="text-sm font-medium text-text-primary">
                    {detectedContent.detectedLanguage}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Confidence</div>
                  <div className="text-sm font-medium text-text-primary">
                    {Math.round(detectedContent.confidence * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Duration</div>
                  <div className="text-sm font-medium text-text-primary">
                    {detectedContent.duration}s
                  </div>
                </div>
                <div>
                  <div className="text-xs text-text-secondary">Word Count</div>
                  <div className="text-sm font-medium text-text-primary">
                    {detectedContent.wordCount}
                  </div>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border-light">
                <div className="text-xs text-text-secondary mb-2">Audio Analysis</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Speaking Rate:</span>
                    <span className="text-text-primary">{detectedContent.speakingRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Audio Quality:</span>
                    <span className="text-text-primary">{detectedContent.audioQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Background Noise:</span>
                    <span className="text-text-primary">{detectedContent.backgroundNoise}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowLeft" size={16} />
          <span>Back to {projectData.isLocalFile ? 'Video Upload' : 'URL Input'}</span>
        </button>

        <div className="flex space-x-4">
          <button
            onClick={onNavigateToProcessing}
            className="px-6 py-3 border border-border text-text-secondary hover:text-text-primary hover:bg-background rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="Activity" size={16} />
            <span>View Queue</span>
          </button>
          
          {detectedContent && (
            <button
              onClick={() => onComplete()}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue to Customization</span>
              <Icon name="ArrowRight" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStep;