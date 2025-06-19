import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ExportProgress = ({ progress, projectName, settings, onCancel }) => {
  const [currentStage, setCurrentStage] = useState('preparing');
  const [timeRemaining, setTimeRemaining] = useState('Calculating...');
  const [processingSpeed, setProcessingSpeed] = useState('0 MB/s');

  const stages = [
    { id: 'preparing', label: 'Preparing Export', range: [0, 10] },
    { id: 'encoding', label: 'Encoding Video', range: [10, 70] },
    { id: 'optimizing', label: 'Optimizing Quality', range: [70, 90] },
    { id: 'finalizing', label: 'Finalizing', range: [90, 100] }
  ];

  useEffect(() => {
    // Determine current stage based on progress
    const stage = stages.find(s => progress >= s.range[0] && progress < s.range[1]) || stages[stages.length - 1];
    setCurrentStage(stage.id);

    // Calculate time remaining (mock calculation)
    if (progress > 0 && progress < 100) {
      const remainingProgress = 100 - progress;
      const estimatedSeconds = Math.ceil((remainingProgress / progress) * 30); // Rough estimate
      const minutes = Math.floor(estimatedSeconds / 60);
      const seconds = estimatedSeconds % 60;
      
      if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    } else if (progress >= 100) {
      setTimeRemaining('Complete!');
    }

    // Mock processing speed
    setProcessingSpeed(`${(2.5 + Math.random() * 1.5).toFixed(1)} MB/s`);
  }, [progress]);

  const getCurrentStageProgress = () => {
    const stage = stages.find(s => s.id === currentStage);
    if (!stage) return 0;
    
    const stageProgress = ((progress - stage.range[0]) / (stage.range[1] - stage.range[0])) * 100;
    return Math.max(0, Math.min(100, stageProgress));
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">Exporting Video</h3>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg hover:bg-background transition-colors duration-200"
            title="Cancel Export"
          >
            <Icon name="X" size={16} className="text-text-secondary" />
          </button>
        </div>
        <p className="text-sm text-text-secondary mt-1">{projectName}</p>
      </div>

      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-3 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Current Stage */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
              <Icon name="Loader2" size={16} className="text-primary animate-spin" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                {stages.find(s => s.id === currentStage)?.label}
              </div>
              <div className="text-xs text-text-secondary">{timeRemaining}</div>
            </div>
          </div>

          {/* Stage Progress */}
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full bg-secondary transition-all duration-300"
              style={{ width: `${getCurrentStageProgress()}%` }}
            />
          </div>
        </div>

        {/* Export Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Quality</div>
            <div className="text-sm font-medium text-text-primary">{settings.quality}</div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Format</div>
            <div className="text-sm font-medium text-text-primary">{settings.format}</div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Compression</div>
            <div className="text-sm font-medium text-text-primary capitalize">{settings.compression}</div>
          </div>
          <div className="bg-background rounded-lg p-3">
            <div className="text-xs text-text-secondary mb-1">Speed</div>
            <div className="text-sm font-medium text-text-primary">{processingSpeed}</div>
          </div>
        </div>

        {/* Stage Timeline */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
            Processing Stages
          </div>
          {stages.map((stage, index) => {
            const isCompleted = progress > stage.range[1];
            const isCurrent = currentStage === stage.id;
            const isPending = progress < stage.range[0];

            return (
              <div key={stage.id} className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-success' 
                    : isCurrent 
                      ? 'bg-primary' :'bg-background border border-border-light'
                }`}>
                  {isCompleted ? (
                    <Icon name="Check" size={10} color="white" />
                  ) : isCurrent ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : (
                    <div className="w-2 h-2 bg-text-secondary rounded-full opacity-30" />
                  )}
                </div>
                <div className={`text-sm ${
                  isCompleted 
                    ? 'text-success font-medium' 
                    : isCurrent 
                      ? 'text-primary font-medium' :'text-text-secondary'
                }`}>
                  {stage.label}
                </div>
                {isCurrent && (
                  <div className="text-xs text-text-secondary">
                    {Math.round(getCurrentStageProgress())}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full mt-6 px-4 py-2 bg-background border border-border-light text-text-secondary rounded-lg hover:bg-surface hover:text-text-primary transition-colors duration-200 text-sm font-medium"
        >
          Cancel Export
        </button>
      </div>
    </div>
  );
};

export default ExportProgress;