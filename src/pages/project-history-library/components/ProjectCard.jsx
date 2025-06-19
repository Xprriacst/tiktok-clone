import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const ProjectCard = ({ 
  project, 
  viewMode, 
  isSelected, 
  isFavorite, 
  onSelect, 
  onFavorite, 
  onAction,
  getStatusColor,
  getStatusIcon 
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.action-button') || e.target.closest('.checkbox-container')) {
      return;
    }
    onAction('preview', project.id);
  };

  const menuActions = [
    { id: 'preview', label: 'Preview', icon: 'Eye' },
    { id: 'edit', label: 'Edit', icon: 'Edit' },
    { id: 'duplicate', label: 'Duplicate', icon: 'Copy' },
    { id: 'download', label: 'Download', icon: 'Download' },
    { id: 'share', label: 'Share', icon: 'Share2' },
    { id: 'delete', label: 'Delete', icon: 'Trash2', danger: true }
  ];

  if (viewMode === 'list') {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-4">
          {/* Selection Checkbox */}
          <div className="checkbox-container flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(project.id, e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          {/* Thumbnail */}
          <div className="flex-shrink-0 w-16 h-20 bg-background rounded-lg overflow-hidden">
            <Image
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Project Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary truncate mb-1">
                  {project.title}
                </h3>
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={getStatusIcon(project.status)} 
                      size={12} 
                      className={`${getStatusColor(project.status)} ${project.status === 'processing' ? 'animate-spin' : ''}`} 
                    />
                    <span className="capitalize">{project.status}</span>
                  </div>
                  <span>{project.language}</span>
                  <span>{project.duration}</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onFavorite(project.id)}
                  className="action-button p-1 hover:bg-background rounded transition-colors duration-200"
                >
                  <Icon 
                    name={isFavorite ? 'Heart' : 'Heart'} 
                    size={16} 
                    className={isFavorite ? 'text-error fill-current' : 'text-text-secondary'} 
                  />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="action-button p-1 hover:bg-background rounded transition-colors duration-200"
                  >
                    <Icon name="MoreVertical" size={16} className="text-text-secondary" />
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg z-50">
                      {menuActions.map((action) => (
                        <button
                          key={action.id}
                          onClick={() => {
                            onAction(action.id, project.id);
                            setIsMenuOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-background transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                            action.danger ? 'text-error hover:bg-error-50' : 'text-text-primary'
                          }`}
                        >
                          <Icon name={action.icon} size={14} />
                          <span>{action.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4 mt-2 text-xs text-text-secondary">
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={12} />
                <span>{project.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Download" size={12} />
                <span>{project.downloads}</span>
              </div>
              {project.fileSize && (
                <span>{project.fileSize}</span>
              )}
            </div>
          </div>
        </div>

        {/* Processing Progress */}
        {project.status === 'processing' && project.processingProgress && (
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>Processing...</span>
              <span>{project.processingProgress}%</span>
            </div>
            <div className="w-full bg-background rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.processingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {project.status === 'error' && project.errorMessage && (
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="flex items-start space-x-2 text-xs text-error">
              <Icon name="AlertCircle" size={12} className="mt-0.5 flex-shrink-0" />
              <span>{project.errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid View
  return (
    <div 
      className="bg-surface border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-background overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(project.id, e.target.checked)}
                className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
              />
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(project.id);
              }}
              className="action-button p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200"
            >
              <Icon 
                name={isFavorite ? 'Heart' : 'Heart'} 
                size={16} 
                className={isFavorite ? 'text-error fill-current' : 'text-text-secondary'} 
              />
            </button>
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
            <div className={`
              inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
              ${project.status === 'completed' ? 'bg-success-100 text-success' :
                project.status === 'processing' ? 'bg-warning-100 text-warning' :
                project.status === 'error'? 'bg-error-100 text-error' : 'bg-background text-text-secondary'
              }
            `}>
              <Icon 
                name={getStatusIcon(project.status)} 
                size={12} 
                className={project.status === 'processing' ? 'animate-spin' : ''} 
              />
              <span className="capitalize">{project.status}</span>
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2">
            <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {project.duration}
            </span>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Icon name="Play" size={24} className="text-primary ml-1" />
            </div>
          </div>
        </div>

        {/* Processing Progress */}
        {project.status === 'processing' && project.processingProgress && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <span>Processing...</span>
              <span>{project.processingProgress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div 
                className="bg-warning h-1 rounded-full transition-all duration-300"
                style={{ width: `${project.processingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold text-text-primary line-clamp-2 flex-1">
            {project.title}
          </h3>
          
          <div className="relative ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="action-button p-1 hover:bg-background rounded transition-colors duration-200"
            >
              <Icon name="MoreVertical" size={16} className="text-text-secondary" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg z-50">
                {menuActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction(action.id, project.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-background transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                      action.danger ? 'text-error hover:bg-error-50' : 'text-text-primary'
                    }`}
                  >
                    <Icon name={action.icon} size={14} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-2 text-xs text-text-secondary">
          <div className="flex items-center justify-between">
            <span>{project.language}</span>
            <span>{formatDate(project.createdAt)}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>{project.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Download" size={12} />
              <span>{project.downloads}</span>
            </div>
            {project.isShared && (
              <div className="flex items-center space-x-1">
                <Icon name="Share2" size={12} />
                <span>Shared</span>
              </div>
            )}
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-background text-text-secondary text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-background text-text-secondary text-xs rounded-full">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Error Message */}
        {project.status === 'error' && project.errorMessage && (
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="flex items-start space-x-2 text-xs text-error">
              <Icon name="AlertCircle" size={12} className="mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{project.errorMessage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;