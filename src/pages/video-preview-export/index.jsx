import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from 'components/AppIcon';

import VideoPlayer from './components/VideoPlayer';
import ExportOptions from './components/ExportOptions';
import ComparisonView from './components/ComparisonView';
import ExportProgress from './components/ExportProgress';

const VideoPreviewExport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentProject, setCurrentProject] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [exportSettings, setExportSettings] = useState({
    quality: '1080p',
    format: 'MP4',
    compression: 'balanced',
    removeWatermark: false,
    addBranding: false,
    brandingText: ''
  });
  const [videoBlob, setVideoBlob] = useState(null);

  // Mock project data
  const mockProjects = [
    {
      id: 1,
      name: 'Marketing Campaign Avatar',
      status: 'completed',
      duration: '00:45',
      resolution: '1080x1920',
      language: 'English',
      avatar: 'Professional Female',
      voice: 'Natural Female Voice',
      background: 'Studio White',
      createdAt: '2024-01-15T10:30:00Z',
      originalUrl: 'https://www.tiktok.com/@user/video/123456789',
      generatedVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      originalVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616c9c0b8d3?w=400&h=600&fit=crop',
      fileSize: '15.2 MB',
      transcription: `Welcome to our amazing product demonstration! Today I'll show you how our innovative solution can transform your business workflow and increase productivity by up to 300%. Let's dive into the key features that make this platform stand out from the competition.`,
      lipSyncAccuracy: 94,
      processingTime: '2m 34s',
      exportCount: 3,
      lastExported: '2024-01-15T14:20:00Z'
    }
  ];

  useEffect(() => {
    // Get project from location state or use default
    if (location.state?.projectData) {
      const projectData = location.state.projectData;
      
      // Check if the project has a local video file
      if (projectData.localVideoFile) {
        setVideoBlob(projectData.localVideoFile);
        
        // Create project data with appropriate values
        setCurrentProject({
          id: `local_${Date.now()}`,
          name: projectData.name || projectData.sourceVideo.title,
          status: 'completed',
          duration: formatDuration(projectData.sourceVideo.duration),
          resolution: projectData.sourceVideo.resolution || '1080x1920',
          language: projectData.detectedLanguage || 'English',
          avatar: projectData.selectedAvatar?.name || 'Default Avatar',
          voice: 'Natural Voice',
          background: projectData.backgroundSettings?.preset || 'Studio White',
          createdAt: new Date().toISOString(),
          originalUrl: projectData.tiktokUrl || 'Local Upload',
          generatedVideoUrl: null, // We'll use the Blob directly
          originalVideoUrl: null, // We'll use the Blob directly
          thumbnail: projectData.sourceVideo.thumbnail,
          fileSize: formatFileSize(projectData.localVideoFile.size),
          transcription: projectData.transcription || 'No transcription available',
          lipSyncAccuracy: 92,
          processingTime: '2m 12s',
          exportCount: 0,
          lastExported: null,
          isLocalFile: true,
          localVideoFile: projectData.localVideoFile
        });
      } else {
        // Regular TikTok URL project
        const projectId = Date.now();
        setCurrentProject({
          id: projectId,
          name: projectData.name || 'TikTok Avatar Clone',
          status: 'completed',
          duration: formatDuration(projectData.sourceVideo.duration),
          resolution: '1080x1920',
          language: projectData.detectedLanguage || 'English',
          avatar: projectData.selectedAvatar?.name || 'Default Avatar',
          voice: 'Natural Voice',
          background: projectData.backgroundSettings?.preset || 'Studio White',
          createdAt: new Date().toISOString(),
          originalUrl: projectData.tiktokUrl,
          generatedVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          originalVideoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          thumbnail: projectData.sourceVideo.thumbnail,
          fileSize: '15.2 MB',
          transcription: projectData.transcription || 'No transcription available',
          lipSyncAccuracy: 94,
          processingTime: '2m 34s',
          exportCount: 0,
          lastExported: null
        });
      }
    } else {
      // Use mock data if no state
      const projectId = location.state?.projectId || 1;
      const project = mockProjects.find(p => p.id === projectId) || mockProjects[0];
      setCurrentProject(project);
    }
  }, [location.state]);

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const megabytes = bytes / (1024 * 1024);
    return `${megabytes.toFixed(1)} MB`;
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          // Simulate download
          if (currentProject?.isLocalFile && videoBlob) {
            // For local files, use the blob directly
            const url = URL.createObjectURL(videoBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${currentProject?.name || 'avatar-video'}.${exportSettings.format.toLowerCase()}`;
            link.click();
            URL.revokeObjectURL(url);
          } else {
            // For remote URLs, use the generatedVideoUrl
            const link = document.createElement('a');
            link.href = currentProject?.generatedVideoUrl || '#';
            link.download = `${currentProject?.name || 'avatar-video'}.${exportSettings.format.toLowerCase()}`;
            link.click();
          }
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleCreateSimilar = () => {
    navigate('/video-creation-workflow', {
      state: {
        template: {
          avatar: currentProject?.avatar,
          voice: currentProject?.voice,
          background: currentProject?.background,
          settings: exportSettings
        }
      }
    });
  };

  const handleShareProject = () => {
    if (navigator.share) {
      navigator.share({
        title: currentProject?.name,
        text: `Check out my AI avatar video: ${currentProject?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy link:', err);
        });
    }
  };

  const getQualityFileSize = (quality) => {
    const baseSizes = {
      '1080p': 25.6,
      '720p': 15.2,
      '480p': 8.4
    };
    const compressionMultiplier = {
      'high': 1.2,
      'balanced': 1.0,
      'compressed': 0.7
    };
    return (baseSizes[quality] * compressionMultiplier[exportSettings.compression]).toFixed(1);
  };

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border sticky top-16 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/project-history-library')}
                className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
              >
                <Icon name="ArrowLeft" size={20} className="text-text-secondary" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-text-primary">{currentProject.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>{currentProject.duration}</span>
                  <span>•</span>
                  <span>{currentProject.resolution}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Icon name="CheckCircle" size={14} className="text-success" />
                    <span>Ready</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  showComparison 
                    ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name="GitCompare" size={16} className="mr-2" />
                Compare
              </button>
              <button
                onClick={handleShareProject}
                className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
              >
                <Icon name="Share2" size={20} className="text-text-secondary" />
              </button>
              <button
                onClick={handleCreateSimilar}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200 text-sm font-medium"
              >
                <Icon name="Copy" size={16} className="mr-2" />
                Create Similar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Preview Section */}
          <div className="lg:col-span-2">
            {showComparison ? (
              <ComparisonView
                originalVideo={currentProject.isLocalFile ? videoBlob : currentProject.originalVideoUrl}
                generatedVideo={currentProject.isLocalFile ? videoBlob : currentProject.generatedVideoUrl}
                lipSyncAccuracy={currentProject.lipSyncAccuracy}
              />
            ) : (
              <VideoPlayer
                videoUrl={currentProject.isLocalFile ? videoBlob : currentProject.generatedVideoUrl}
                thumbnail={currentProject.thumbnail}
                title={currentProject.name}
                duration={currentProject.duration}
                transcription={currentProject.transcription}
              />
            )}

            {/* Project Details */}
            <div className="mt-6 bg-surface rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Project Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-text-secondary mb-1">Avatar</div>
                  <div className="text-sm font-medium text-text-primary">{currentProject.avatar}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Voice</div>
                  <div className="text-sm font-medium text-text-primary">{currentProject.voice}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Language</div>
                  <div className="text-sm font-medium text-text-primary">{currentProject.language}</div>
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">Background</div>
                  <div className="text-sm font-medium text-text-primary">{currentProject.background}</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Icon name="Target" size={16} className="text-success" />
                      <span className="text-sm text-text-secondary">Lip-sync Accuracy</span>
                      <span className="text-sm font-medium text-success">{currentProject.lipSyncAccuracy}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name="Clock" size={16} className="text-text-secondary" />
                      <span className="text-sm text-text-secondary">Processing Time</span>
                      <span className="text-sm font-medium text-text-primary">{currentProject.processingTime}</span>
                    </div>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {currentProject.exportCount > 0 
                      ? `Exported ${currentProject.exportCount} times` 
                      : 'Not yet exported'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export Options Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              {isExporting ? (
                <ExportProgress
                  progress={exportProgress}
                  projectName={currentProject.name}
                  settings={exportSettings}
                  onCancel={() => {
                    setIsExporting(false);
                    setExportProgress(0);
                  }}
                />
              ) : (
                <ExportOptions
                  settings={exportSettings}
                  onSettingsChange={setExportSettings}
                  onExport={handleExport}
                  getFileSize={getQualityFileSize}
                  projectName={currentProject.name}
                />
              )}

              {/* Quick Actions */}
              <div className="mt-6 bg-surface rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate('/avatar-voice-customization', {
                      state: { projectId: currentProject.id }
                    })}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200"
                  >
                    <Icon name="User" size={16} />
                    <span>Customize Avatar</span>
                  </button>
                  <button
                    onClick={() => navigate('/video-creation-workflow', {
                      state: { editProject: currentProject.id }
                    })}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200"
                  >
                    <Icon name="Edit" size={16} />
                    <span>Edit Project</span>
                  </button>
                  <button
                    onClick={() => navigate('/processing-status-queue')}
                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200"
                  >
                    <Icon name="Activity" size={16} />
                    <span>Processing Queue</span>
                  </button>
                </div>
              </div>

              {/* Original Source */}
              <div className="mt-6 bg-surface rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold text-text-primary mb-3">Original Source</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Icon name={currentProject.isLocalFile ? "Upload" : "Music"} size={20} color="white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {currentProject.isLocalFile ? 'Local Upload' : 'TikTok Video'}
                    </div>
                    <div className="text-xs text-text-secondary truncate">
                      {currentProject.isLocalFile ? 'Uploaded video file' : currentProject.originalUrl}
                    </div>
                  </div>
                  {!currentProject.isLocalFile && (
                    <button
                      onClick={() => window.open(currentProject.originalUrl, '_blank')}
                      className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
                    >
                      <Icon name="ExternalLink" size={16} className="text-text-secondary" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewExport;
