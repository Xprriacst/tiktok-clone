import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ProcessingHistory = ({ completedJobs, errorJobs, onClose, onRetry, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('completed');

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDownload = (downloadUrl, projectName) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getErrorSeverity = (errorCode) => {
    if (errorCode.includes('QUALITY')) return 'warning';
    if (errorCode.includes('NETWORK')) return 'error';
    if (errorCode.includes('TIMEOUT')) return 'warning';
    return 'error';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary">
            Processing History
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background rounded-lg transition-colors duration-200"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-light">
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'completed'
                ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Completed ({completedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'errors' ?'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary'
            }`}
          >
            Errors ({errorJobs.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedJobs.length > 0 ? (
                completedJobs.map((job) => (
                  <div key={job.id} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-20 bg-surface rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={job.thumbnail}
                          alt={job.projectName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Icon name="CheckCircle" size={16} className="text-success" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-text-primary">
                            {job.projectName}
                          </h3>
                          <Icon name="CheckCircle" size={14} className="text-success" />
                        </div>
                        
                        <p className="text-xs text-text-secondary truncate mb-2">
                          {job.tiktokUrl}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-text-secondary">
                          <span>Completed: {formatDate(job.completedAt)}</span>
                          <span>Processing Time: {job.processingTime}</span>
                          <span>Size: {job.outputSize}</span>
                          <span>Language: {job.language}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onNavigate(job.id)}
                          className="px-3 py-2 text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownload(job.downloadUrl, job.projectName)}
                          className="px-3 py-2 bg-primary text-white text-sm rounded hover:bg-primary-700 transition-colors duration-200"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="CheckCircle" size={48} className="text-text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No Completed Jobs
                  </h3>
                  <p className="text-text-secondary">
                    Completed processing jobs will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-4">
              {errorJobs.length > 0 ? (
                errorJobs.map((job) => (
                  <div key={job.id} className="bg-error-50 border border-error-100 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-16 h-20 bg-surface rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={job.thumbnail}
                          alt={job.projectName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <Icon name="AlertCircle" size={16} className="text-error" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-semibold text-text-primary">
                            {job.projectName}
                          </h3>
                          <Icon name="AlertCircle" size={14} className="text-error" />
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getErrorSeverity(job.errorCode) === 'warning' ?'bg-warning-100 text-warning-700' :'bg-error-100 text-error-700'
                          }`}>
                            {job.errorStage}
                          </span>
                        </div>
                        
                        <p className="text-xs text-text-secondary truncate mb-2">
                          {job.tiktokUrl}
                        </p>
                        
                        <div className="bg-white border border-error-200 rounded p-3 mb-3">
                          <p className="text-sm text-error-700 mb-1">
                            {job.errorMessage}
                          </p>
                          <p className="text-xs text-error-600">
                            Error Code: {job.errorCode}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-text-secondary">
                          <span>Failed: {formatDate(job.errorAt)}</span>
                          <span>Retry Count: {job.retryCount}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        {job.canRetry && (
                          <button
                            onClick={() => onRetry(job.id)}
                            className="px-3 py-2 bg-primary text-white text-sm rounded hover:bg-primary-700 transition-colors duration-200"
                          >
                            Retry
                          </button>
                        )}
                        <button className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    No Processing Errors
                  </h3>
                  <p className="text-text-secondary">
                    All processing jobs completed successfully
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border-light bg-background">
          <div className="text-sm text-text-secondary">
            Total: {completedJobs.length + errorJobs.length} jobs processed
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessingHistory;