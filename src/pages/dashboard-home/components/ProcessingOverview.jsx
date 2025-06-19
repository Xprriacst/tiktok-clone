import React from 'react';
import Icon from 'components/AppIcon';

const ProcessingOverview = ({ processingCount, onViewQueue }) => {
  const mockProcessingJobs = [
    {
      id: 1,
      name: 'Marketing Campaign Video',
      progress: 85,
      eta: '2 min',
      stage: 'Avatar Generation'
    },
    {
      id: 2,
      name: 'Product Demo Tutorial',
      progress: 45,
      eta: '8 min',
      stage: 'Voice Synthesis'
    },
    {
      id: 3,
      name: 'Social Media Content',
      progress: 15,
      eta: '12 min',
      stage: 'Audio Processing'
    }
  ];

  const activeJobs = mockProcessingJobs.slice(0, processingCount);

  if (processingCount === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6 mb-8">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">All Processing Complete</h3>
          <p className="text-text-secondary mb-4">No videos are currently being processed</p>
          <button
            onClick={onViewQueue}
            className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
          >
            View Processing History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-text-primary">Currently Processing</h3>
          <span className="bg-warning-100 text-warning px-2 py-1 rounded-full text-xs font-medium">
            {processingCount} active
          </span>
        </div>
        <button
          onClick={onViewQueue}
          className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
        >
          View Queue
        </button>
      </div>

      <div className="space-y-4">
        {activeJobs.map((job) => (
          <div key={job.id} className="border border-border-light rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <Icon name="Loader2" size={16} className="text-warning animate-spin" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{job.name}</h4>
                  <p className="text-sm text-text-secondary">{job.stage}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-text-primary">{job.progress}%</div>
                <div className="text-xs text-text-secondary">ETA: {job.eta}</div>
              </div>
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

      {processingCount > 3 && (
        <div className="mt-4 text-center">
          <button
            onClick={onViewQueue}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            +{processingCount - 3} more processing
          </button>
        </div>
      )}
    </div>
  );
};

export default ProcessingOverview;