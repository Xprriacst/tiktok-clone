import React from 'react';
import Icon from 'components/AppIcon';

const ProjectStats = ({ projects }) => {
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    processing: projects.filter(p => p.status === 'processing').length,
    draft: projects.filter(p => p.status === 'draft').length,
    error: projects.filter(p => p.status === 'error').length,
    totalViews: projects.reduce((sum, p) => sum + p.views, 0),
    totalDownloads: projects.reduce((sum, p) => sum + p.downloads, 0),
    totalSize: projects.filter(p => p.fileSize).reduce((sum, p) => {
      const sizeInMB = parseFloat(p.fileSize.replace(' MB', ''));
      return sum + sizeInMB;
    }, 0)
  };

  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.total,
      icon: 'FolderOpen',
      color: 'text-primary',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success-50'
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: 'Loader2',
      color: 'text-warning',
      bgColor: 'bg-warning-50',
      animate: stats.processing > 0
    },
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: 'Eye',
      color: 'text-secondary',
      bgColor: 'bg-secondary-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon 
                name={stat.icon} 
                size={24} 
                className={`${stat.color} ${stat.animate ? 'animate-spin' : ''}`} 
              />
            </div>
          </div>
          
          {/* Additional Info */}
          {stat.label === 'Completed' && stats.total > 0 && (
            <div className="mt-3 pt-3 border-t border-border-light">
              <div className="flex items-center justify-between text-xs text-text-secondary">
                <span>Completion Rate</span>
                <span className="font-medium">{completionRate}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2 mt-1">
                <div 
                  className="bg-success h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          )}
          
          {stat.label === 'Processing' && stats.processing > 0 && (
            <div className="mt-2">
              <p className="text-xs text-text-secondary">
                {stats.processing} project{stats.processing !== 1 ? 's' : ''} in queue
              </p>
            </div>
          )}
          
          {stat.label === 'Total Views' && (
            <div className="mt-2">
              <p className="text-xs text-text-secondary">
                {stats.totalDownloads.toLocaleString()} downloads
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Storage Usage Card */}
      <div className="sm:col-span-2 lg:col-span-4 bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-text-primary">Storage Usage</h3>
          <div className="flex items-center space-x-4 text-xs text-text-secondary">
            <span>{stats.totalSize.toFixed(1)} MB used</span>
            <span>•</span>
            <span>5 GB available</span>
          </div>
        </div>
        
        <div className="w-full bg-background rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((stats.totalSize / 5000) * 100, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-text-secondary">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Completed ({stats.completed})</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Processing ({stats.processing})</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-text-secondary rounded-full"></div>
              <span>Draft ({stats.draft})</span>
            </div>
            {stats.error > 0 && (
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-error rounded-full"></div>
                <span>Error ({stats.error})</span>
              </div>
            )}
          </div>
          
          <button className="text-primary hover:text-primary-700 font-medium transition-colors duration-200">
            Manage Storage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;