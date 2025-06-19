import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import ProcessingCard from './components/ProcessingCard';
import QueueCard from './components/QueueCard';
import ProcessingHistory from './components/ProcessingHistory';
import ProcessingControls from './components/ProcessingControls';
import ErrorAlert from './components/ErrorAlert';

const ProcessingStatusQueue = () => {
  const navigate = useNavigate();
  const [activeJobs, setActiveJobs] = useState([]);
  const [queuedJobs, setQueuedJobs] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [errorJobs, setErrorJobs] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [globalProcessingState, setGlobalProcessingState] = useState('running');
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [systemStats, setSystemStats] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    queueCapacity: 85
  });

  // Mock data initialization
  useEffect(() => {
    const mockActiveJobs = [
      {
        id: 'job_001',
        projectName: 'Viral Dance Challenge',
        tiktokUrl: 'https://tiktok.com/@user/video/123456789',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop',
        currentStage: 'avatar-generation',
        progress: 75,
        eta: '2 min 30 sec',
        startTime: new Date(Date.now() - 300000),
        stages: {
          'download': { status: 'completed', progress: 100, duration: '15s' },
          'transcription': { status: 'completed', progress: 100, duration: '45s' },
          'avatar-generation': { status: 'processing', progress: 75, duration: '2m 30s' },
          'lip-sync': { status: 'pending', progress: 0, duration: '1m 15s' },
          'rendering': { status: 'pending', progress: 0, duration: '3m 45s' }
        },
        priority: 'high',
        language: 'English',
        duration: '45s'
      },
      {
        id: 'job_002',
        projectName: 'Cooking Tutorial Remix',
        tiktokUrl: 'https://tiktok.com/@chef/video/987654321',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=600&fit=crop',
        currentStage: 'lip-sync',
        progress: 45,
        eta: '4 min 15 sec',
        startTime: new Date(Date.now() - 180000),
        stages: {
          'download': { status: 'completed', progress: 100, duration: '12s' },
          'transcription': { status: 'completed', progress: 100, duration: '38s' },
          'avatar-generation': { status: 'completed', progress: 100, duration: '2m 15s' },
          'lip-sync': { status: 'processing', progress: 45, duration: '4m 15s' },
          'rendering': { status: 'pending', progress: 0, duration: '2m 30s' }
        },
        priority: 'medium',
        language: 'Spanish',
        duration: '1m 23s'
      }
    ];

    const mockQueuedJobs = [
      {
        id: 'queue_001',
        projectName: 'Fashion Trend Analysis',
        tiktokUrl: 'https://tiktok.com/@fashion/video/456789123',
        thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop',
        priority: 'low',
        estimatedStartTime: '8 min',
        language: 'French',
        duration: '58s',
        queuePosition: 1
      },
      {
        id: 'queue_002',
        projectName: 'Tech Review Summary',
        tiktokUrl: 'https://tiktok.com/@tech/video/789123456',
        thumbnail: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=600&fit=crop',
        priority: 'medium',
        estimatedStartTime: '12 min',
        language: 'German',
        duration: '1m 45s',
        queuePosition: 2
      },
      {
        id: 'queue_003',
        projectName: 'Music Performance Cover',
        tiktokUrl: 'https://tiktok.com/@music/video/321654987',
        thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=600&fit=crop',
        priority: 'high',
        estimatedStartTime: '15 min',
        language: 'Korean',
        duration: '2m 12s',
        queuePosition: 3
      }
    ];

    const mockCompletedJobs = [
      {
        id: 'completed_001',
        projectName: 'Comedy Skit Recreation',
        tiktokUrl: 'https://tiktok.com/@comedy/video/111222333',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        completedAt: new Date(Date.now() - 3600000),
        processingTime: '8m 45s',
        outputSize: '24.5 MB',
        language: 'English',
        duration: '1m 15s',
        downloadUrl: '/downloads/comedy-skit-recreation.mp4'
      },
      {
        id: 'completed_002',
        projectName: 'Educational Content',
        tiktokUrl: 'https://tiktok.com/@edu/video/444555666',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop',
        completedAt: new Date(Date.now() - 7200000),
        processingTime: '12m 30s',
        outputSize: '31.2 MB',
        language: 'Portuguese',
        duration: '1m 58s',
        downloadUrl: '/downloads/educational-content.mp4'
      }
    ];

    const mockErrorJobs = [
      {
        id: 'error_001',
        projectName: 'Failed Processing Test',
        tiktokUrl: 'https://tiktok.com/@test/video/777888999',
        thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop',
        errorAt: new Date(Date.now() - 1800000),
        errorStage: 'transcription',
        errorMessage: 'Audio quality too low for accurate transcription. Please try with a higher quality source video.',
        errorCode: 'TRANSCRIPTION_QUALITY_ERROR',
        retryCount: 2,
        canRetry: true
      }
    ];

    setActiveJobs(mockActiveJobs);
    setQueuedJobs(mockQueuedJobs);
    setCompletedJobs(mockCompletedJobs);
    setErrorJobs(mockErrorJobs);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveJobs(prev => prev.map(job => ({
        ...job,
        progress: Math.min(100, job.progress + Math.random() * 5),
        eta: job.progress > 95 ? 'Finishing...' : job.eta
      })));

      setSystemStats(prev => ({
        cpuUsage: Math.max(20, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(95, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        queueCapacity: Math.max(50, Math.min(100, prev.queueCapacity + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handlePauseAll = () => {
    setGlobalProcessingState(prev => prev === 'running' ? 'paused' : 'running');
  };

  const handleCancelSelected = () => {
    if (selectedJobs.length === 0) return;
    
    setQueuedJobs(prev => prev.filter(job => !selectedJobs.includes(job.id)));
    setSelectedJobs([]);
  };

  const handleRetryJob = (jobId) => {
    const errorJob = errorJobs.find(job => job.id === jobId);
    if (errorJob) {
      const newQueueJob = {
        id: `retry_${Date.now()}`,
        projectName: `${errorJob.projectName} (Retry)`,
        tiktokUrl: errorJob.tiktokUrl,
        thumbnail: errorJob.thumbnail,
        priority: 'high',
        estimatedStartTime: '2 min',
        language: 'English',
        duration: '1m 30s',
        queuePosition: queuedJobs.length + 1
      };
      
      setQueuedJobs(prev => [newQueueJob, ...prev]);
      setErrorJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleReorderQueue = (dragIndex, dropIndex) => {
    const updatedQueue = [...queuedJobs];
    const draggedItem = updatedQueue[dragIndex];
    updatedQueue.splice(dragIndex, 1);
    updatedQueue.splice(dropIndex, 0, draggedItem);
    
    // Update queue positions
    const reorderedQueue = updatedQueue.map((job, index) => ({
      ...job,
      queuePosition: index + 1
    }));
    
    setQueuedJobs(reorderedQueue);
  };

  const handleJobSelection = (jobId, isSelected) => {
    setSelectedJobs(prev => 
      isSelected 
        ? [...prev, jobId]
        : prev.filter(id => id !== jobId)
    );
  };

  const handleNavigateToProject = (projectId) => {
    navigate('/video-preview-export', { 
      state: { projectId, fromProcessing: true } 
    });
  };

  const getTotalJobs = () => activeJobs.length + queuedJobs.length;
  const getCompletionRate = () => {
    const total = getTotalJobs() + completedJobs.length;
    return total > 0 ? Math.round((completedJobs.length / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Processing Status & Queue
              </h1>
              <p className="text-text-secondary">
                Monitor video generation progress and manage processing queue
              </p>
            </div>
            
            <ProcessingControls
              globalState={globalProcessingState}
              onPauseAll={handlePauseAll}
              onCancelSelected={handleCancelSelected}
              selectedCount={selectedJobs.length}
              isConnected={isConnected}
            />
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Activity" size={20} className="text-warning" />
                <span className="text-sm font-medium text-text-secondary">Active</span>
              </div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {activeJobs.length}
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-text-secondary" />
                <span className="text-sm font-medium text-text-secondary">Queued</span>
              </div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {queuedJobs.length}
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <span className="text-sm font-medium text-text-secondary">Completed</span>
              </div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {completedJobs.length}
              </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                <span className="text-sm font-medium text-text-secondary">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-text-primary mt-1">
                {getCompletionRate()}%
              </div>
            </div>
          </div>
        </div>

        {/* Connection Status Alert */}
        {!isConnected && (
          <ErrorAlert
            title="Connection Lost"
            message="Real-time updates are currently unavailable. Attempting to reconnect..."
            type="warning"
            className="mb-6"
          />
        )}

        {/* Error Jobs Alert */}
        {errorJobs.length > 0 && (
          <ErrorAlert
            title={`${errorJobs.length} Job${errorJobs.length > 1 ? 's' : ''} Failed`}
            message="Some processing jobs have encountered errors and require attention."
            type="error"
            className="mb-6"
            action={{
              label: 'View Errors',
              onClick: () => setShowHistory(true)
            }}
          />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Active Processing Jobs */}
            <div className="bg-surface border border-border rounded-lg">
              <div className="p-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Active Processing
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${globalProcessingState === 'running' ? 'bg-success animate-pulse' : 'bg-warning'}`} />
                    <span className="text-sm text-text-secondary capitalize">
                      {globalProcessingState}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {activeJobs.length > 0 ? (
                  <div className="space-y-4">
                    {activeJobs.map((job) => (
                      <ProcessingCard
                        key={job.id}
                        job={job}
                        onNavigate={handleNavigateToProject}
                        isPaused={globalProcessingState === 'paused'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Zap" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      No Active Processing
                    </h3>
                    <p className="text-text-secondary mb-4">
                      All jobs are completed or queued for processing
                    </p>
                    <button
                      onClick={() => navigate('/video-creation-workflow')}
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Create New Project
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Processing Queue */}
            <div className="bg-surface border border-border rounded-lg">
              <div className="p-6 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">
                    Processing Queue
                  </h2>
                  {selectedJobs.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">
                        {selectedJobs.length} selected
                      </span>
                      <button
                        onClick={handleCancelSelected}
                        className="text-error hover:text-error-600 text-sm font-medium transition-colors duration-200"
                      >
                        Cancel Selected
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {queuedJobs.length > 0 ? (
                  <div className="space-y-3">
                    {queuedJobs.map((job, index) => (
                      <QueueCard
                        key={job.id}
                        job={job}
                        index={index}
                        isSelected={selectedJobs.includes(job.id)}
                        onSelect={handleJobSelection}
                        onReorder={handleReorderQueue}
                        totalJobs={queuedJobs.length}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="Clock" size={48} className="text-text-secondary mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      Queue is Empty
                    </h3>
                    <p className="text-text-secondary">
                      No jobs waiting for processing
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Resources */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                System Resources
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">CPU Usage</span>
                    <span className="text-sm font-medium text-text-primary">
                      {systemStats.cpuUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        systemStats.cpuUsage > 80 ? 'bg-error' :
                        systemStats.cpuUsage > 60 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${systemStats.cpuUsage}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Memory Usage</span>
                    <span className="text-sm font-medium text-text-primary">
                      {systemStats.memoryUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        systemStats.memoryUsage > 85 ? 'bg-error' :
                        systemStats.memoryUsage > 70 ? 'bg-warning' : 'bg-primary'
                      }`}
                      style={{ width: `${systemStats.memoryUsage}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Queue Capacity</span>
                    <span className="text-sm font-medium text-text-primary">
                      {systemStats.queueCapacity}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${systemStats.queueCapacity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/video-creation-workflow')}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Icon name="Plus" size={20} />
                  <span>New Project</span>
                </button>
                
                <button
                  onClick={() => setShowHistory(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-background border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200"
                >
                  <Icon name="History" size={20} />
                  <span>View History</span>
                </button>
                
                <button
                  onClick={() => navigate('/project-history-library')}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-background border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200"
                >
                  <Icon name="FolderOpen" size={20} />
                  <span>Project Library</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Processing History Modal */}
        {showHistory && (
          <ProcessingHistory
            completedJobs={completedJobs}
            errorJobs={errorJobs}
            onClose={() => setShowHistory(false)}
            onRetry={handleRetryJob}
            onNavigate={handleNavigateToProject}
          />
        )}
      </div>
    </div>
  );
};

export default ProcessingStatusQueue;