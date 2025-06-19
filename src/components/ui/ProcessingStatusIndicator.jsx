import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const ProcessingStatusIndicator = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [processingData, setProcessingData] = useState({
    activeJobs: [
      { id: 1, name: 'Marketing Video v2', progress: 75, status: 'processing', eta: '2 min' },
      { id: 2, name: 'Product Demo', progress: 45, status: 'processing', eta: '5 min' }
    ],
    queuedJobs: 3,
    completedToday: 8,
    totalProcessingTime: '1h 23m',
    isConnected: true
  });

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleViewFullStatus = () => {
    navigate('/processing-status-queue');
    setIsExpanded(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'text-warning';
      case 'completed': return 'text-success';
      case 'error': return 'text-error';
      case 'queued': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return 'Loader2';
      case 'completed': return 'CheckCircle';
      case 'error': return 'AlertCircle';
      case 'queued': return 'Clock';
      default: return 'Circle';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingData(prev => ({
        ...prev,
        activeJobs: prev.activeJobs.map(job => ({
          ...job,
          progress: Math.min(100, job.progress + Math.random() * 5),
          eta: job.progress > 95 ? 'Finishing...' : job.eta
        }))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const hasActiveProcessing = processingData.activeJobs.length > 0;
  const totalActiveJobs = processingData.activeJobs.length + processingData.queuedJobs;

  return (
    <div className="relative">
      {/* Main Status Button */}
      <button
        onClick={handleExpandToggle}
        className={`
          flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all duration-200
          ${hasActiveProcessing 
            ? 'bg-warning-50 border-warning-100 hover:bg-warning-100' :'bg-background border-border hover:bg-surface'
          }
        `}
        title="Processing Status"
      >
        {/* Connection Status */}
        <div className={`w-2 h-2 rounded-full ${processingData.isConnected ? 'bg-success animate-pulse-gentle' : 'bg-error'}`} />
        
        {/* Processing Info */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={hasActiveProcessing ? 'Activity' : 'CheckCircle'} 
            size={16} 
            className={hasActiveProcessing ? 'text-warning animate-pulse' : 'text-success'} 
          />
          <span className="text-sm font-medium text-text-primary">
            {hasActiveProcessing ? `${totalActiveJobs} active` : 'All complete'}
          </span>
        </div>

        {/* Expand Arrow */}
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`text-text-secondary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Expanded Status Panel */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border rounded-lg shadow-lg z-1100 animate-slide-in">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">Processing Status</h3>
              <button
                onClick={handleViewFullStatus}
                className="text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
              >
                View All
              </button>
            </div>

            {/* Active Jobs */}
            {processingData.activeJobs.length > 0 && (
              <div className="space-y-3 mb-4">
                <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">Active Jobs</h4>
                {processingData.activeJobs.map((job) => (
                  <div key={job.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={getStatusIcon(job.status)} 
                          size={14} 
                          className={`${getStatusColor(job.status)} ${job.status === 'processing' ? 'animate-spin' : ''}`} 
                        />
                        <span className="text-sm font-medium text-text-primary truncate max-w-[180px]">
                          {job.name}
                        </span>
                      </div>
                      <span className="text-xs text-text-secondary">{job.eta}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-warning h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Queue Summary */}
            {processingData.queuedJobs > 0 && (
              <div className="flex items-center justify-between py-2 px-3 bg-background rounded-lg mb-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={14} className="text-text-secondary" />
                  <span className="text-sm text-text-secondary">In Queue</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{processingData.queuedJobs}</span>
              </div>
            )}

            {/* Daily Summary */}
            <div className="border-t border-border-light pt-3">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-text-primary">{processingData.completedToday}</div>
                  <div className="text-xs text-text-secondary">Completed Today</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary">{processingData.totalProcessingTime}</div>
                  <div className="text-xs text-text-secondary">Total Time</div>
                </div>
              </div>
            </div>

            {/* No Active Jobs State */}
            {processingData.activeJobs.length === 0 && processingData.queuedJobs === 0 && (
              <div className="text-center py-6">
                <Icon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
                <p className="text-sm text-text-secondary">All processing complete</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click Outside Handler */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-1000" 
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default ProcessingStatusIndicator;