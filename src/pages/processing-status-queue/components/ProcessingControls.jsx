import React from 'react';
import Icon from 'components/AppIcon';

const ProcessingControls = ({ 
  globalState, 
  onPauseAll, 
  onCancelSelected, 
  selectedCount, 
  isConnected 
}) => {
  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-success animate-pulse-gentle' : 'bg-error'
        }`} />
        <span className="text-sm text-text-secondary">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Selected Jobs Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 border border-primary-100 rounded-lg">
          <span className="text-sm text-primary font-medium">
            {selectedCount} selected
          </span>
          <button
            onClick={onCancelSelected}
            className="flex items-center space-x-1 px-2 py-1 text-sm text-error hover:text-error-600 font-medium transition-colors duration-200"
          >
            <Icon name="X" size={14} />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Global Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onPauseAll}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            globalState === 'running' ?'bg-warning text-white hover:bg-warning-600' :'bg-success text-white hover:bg-success-600'
          }`}
        >
          <Icon 
            name={globalState === 'running' ? 'Pause' : 'Play'} 
            size={16} 
          />
          <span className="hidden sm:inline">
            {globalState === 'running' ? 'Pause All' : 'Resume All'}
          </span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 bg-background border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200">
          <Icon name="Settings" size={16} />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ProcessingControls;