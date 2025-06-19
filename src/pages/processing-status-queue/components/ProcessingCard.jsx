import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ProcessingCard = ({ job, onNavigate, isPaused }) => {
  const getStageIcon = (stage) => {
    const icons = {
      'download': 'Download',
      'transcription': 'FileText',
      'avatar-generation': 'User',
      'lip-sync': 'Mic',
      'rendering': 'Video'
    };
    return icons[stage] || 'Circle';
  };

  const getStageLabel = (stage) => {
    const labels = {
      'download': 'Downloading',
      'transcription': 'Transcribing',
      'avatar-generation': 'Generating Avatar',
      'lip-sync': 'Syncing Lips',
      'rendering': 'Rendering Video'
    };
    return labels[stage] || stage;
  };

  const getStageColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'pending': return 'text-text-secondary';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-text-secondary text-white';
      default: return 'bg-text-secondary text-white';
    }
  };

  const formatDuration = (startTime) => {
    const elapsed = Date.now() - startTime.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Thumbnail and Basic Info */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative w-16 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={job.thumbnail}
              alt={job.projectName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <Icon name="Play" size={16} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-semibold text-text-primary truncate">
                {job.projectName}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                {job.priority}
              </span>
            </div>
            
            <p className="text-xs text-text-secondary truncate mb-2">
              {job.tiktokUrl}
            </p>
            
            <div className="flex items-center space-x-4 text-xs text-text-secondary">
              <span className="flex items-center space-x-1">
                <Icon name="Globe" size={12} />
                <span>{job.language}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{job.duration}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Timer" size={12} />
                <span>{formatDuration(job.startTime)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Current Stage and Progress */}
        <div className="flex-1 lg:max-w-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Icon 
                name={getStageIcon(job.currentStage)} 
                size={16} 
                className={`${getStageColor(job.stages[job.currentStage]?.status)} ${
                  job.stages[job.currentStage]?.status === 'processing' && !isPaused ? 'animate-pulse' : ''
                }`}
              />
              <span className="text-sm font-medium text-text-primary">
                {getStageLabel(job.currentStage)}
              </span>
            </div>
            <span className="text-sm text-text-secondary">
              {job.progress}%
            </span>
          </div>
          
          <div className="w-full bg-border rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                isPaused ? 'bg-text-secondary' : 'bg-warning'
              }`}
              style={{ width: `${job.progress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>ETA: {isPaused ? 'Paused' : job.eta}</span>
            <button
              onClick={() => onNavigate(job.id)}
              className="text-primary hover:text-primary-700 font-medium transition-colors duration-200"
            >
              View Details
            </button>
          </div>
        </div>

        {/* Stage Progress Indicators */}
        <div className="flex items-center space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
          {Object.entries(job.stages).map(([stage, stageData]) => (
            <div
              key={stage}
              className="flex items-center space-x-2 lg:w-full"
              title={`${getStageLabel(stage)}: ${stageData.status}`}
            >
              <div className={`w-2 h-2 rounded-full ${
                stageData.status === 'completed' ? 'bg-success' :
                stageData.status === 'processing' ? 'bg-warning animate-pulse' :
                stageData.status === 'error'? 'bg-error' : 'bg-border'
              }`} />
              <span className="text-xs text-text-secondary hidden lg:inline">
                {getStageLabel(stage)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Stage Progress */}
      <div className="lg:hidden mt-4 pt-4 border-t border-border-light">
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(job.stages).map(([stage, stageData]) => (
            <div key={stage} className="text-center">
              <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                stageData.status === 'completed' ? 'bg-success' :
                stageData.status === 'processing' ? 'bg-warning animate-pulse' :
                stageData.status === 'error'? 'bg-error' : 'bg-border'
              }`} />
              <span className="text-xs text-text-secondary">
                {getStageLabel(stage).split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingCard;