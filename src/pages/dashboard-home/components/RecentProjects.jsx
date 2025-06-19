import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecentProjects = ({ onViewAll }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const mockProjects = [
    {
      id: 1,
      name: 'Marketing Campaign Video',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=400&fit=crop',
      status: 'completed',
      duration: '1:45',
      createdAt: new Date(Date.now() - 86400000),
      language: 'English',
      sourceUrl: 'https://tiktok.com/@user/video1'
    },
    {
      id: 2,
      name: 'Product Demo Tutorial',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
      status: 'processing',
      duration: '2:30',
      createdAt: new Date(Date.now() - 172800000),
      language: 'Spanish',
      progress: 75,
      sourceUrl: 'https://tiktok.com/@user/video2'
    },
    {
      id: 3,
      name: 'Social Media Content',
      thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=400&fit=crop',
      status: 'draft',
      duration: '1:20',
      createdAt: new Date(Date.now() - 259200000),
      language: 'French',
      sourceUrl: 'https://tiktok.com/@user/video3'
    },
    {
      id: 4,
      name: 'Training Materials',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop',
      status: 'completed',
      duration: '3:15',
      createdAt: new Date(Date.now() - 345600000),
      language: 'German',
      sourceUrl: 'https://tiktok.com/@user/video4'
    },
    {
      id: 5,
      name: 'Educational Content',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=400&fit=crop',
      status: 'error',
      duration: '1:55',
      createdAt: new Date(Date.now() - 432000000),
      language: 'Italian',
      error: 'Audio processing failed',
      sourceUrl: 'https://tiktok.com/@user/video5'
    },
    {
      id: 6,
      name: 'Brand Storytelling',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=400&fit=crop',
      status: 'completed',
      duration: '2:10',
      createdAt: new Date(Date.now() - 518400000),
      language: 'Portuguese',
      sourceUrl: 'https://tiktok.com/@user/video6'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success bg-success-100';
      case 'processing': return 'text-warning bg-warning-100';
      case 'draft': return 'text-text-secondary bg-background';
      case 'error': return 'text-error bg-error-100';
      default: return 'text-text-secondary bg-background';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Loader2';
      case 'draft': return 'FileText';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const handleProjectClick = (project) => {
    if (project.status === 'completed') {
      navigate('/video-preview-export', { state: { projectId: project.id } });
    } else if (project.status === 'processing') {
      navigate('/processing-status-queue', { state: { projectId: project.id } });
    } else {
      navigate('/video-creation-workflow', { state: { projectId: project.id } });
    }
  };

  const handleDropdownAction = (action, project) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'edit': navigate('/video-creation-workflow', { state: { projectId: project.id, mode: 'edit' } });
        break;
      case 'duplicate': navigate('/video-creation-workflow', { state: { duplicateFrom: project.id } });
        break;
      case 'preview': navigate('/video-preview-export', { state: { projectId: project.id } });
        break;
      case 'delete':
        // Handle delete action
        console.log('Delete project:', project.id);
        break;
      default:
        break;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Recent Projects</h3>
        <button
          onClick={onViewAll}
          className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProjects.map((project) => (
          <div key={project.id} className="group relative bg-background border border-border-light rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
            {/* Thumbnail */}
            <div className="relative aspect-[9/16] bg-background overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                <div className="flex items-center space-x-1">
                  <Icon 
                    name={getStatusIcon(project.status)} 
                    size={12} 
                    className={project.status === 'processing' ? 'animate-spin' : ''}
                  />
                  <span className="capitalize">{project.status}</span>
                </div>
              </div>

              {/* Duration */}
              <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                {project.duration}
              </div>

              {/* Language */}
              <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {project.language}
              </div>

              {/* Processing Progress */}
              {project.status === 'processing' && project.progress && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-warning h-1 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Play Button Overlay */}
              <button
                onClick={() => handleProjectClick(project)}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-all duration-200"
              >
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200">
                  <Icon name="Play" size={20} className="text-text-primary ml-1" />
                </div>
              </button>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary truncate mb-1">
                    {project.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {formatTimeAgo(project.createdAt)}
                  </p>
                  {project.status === 'error' && project.error && (
                    <p className="text-xs text-error mt-1">
                      {project.error}
                    </p>
                  )}
                </div>

                {/* Actions Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === project.id ? null : project.id)}
                    className="p-1 text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
                  >
                    <Icon name="MoreVertical" size={16} />
                  </button>

                  {activeDropdown === project.id && (
                    <>
                      <div className="absolute right-0 top-8 w-48 bg-surface border border-border rounded-lg shadow-lg z-50 py-1">
                        <button
                          onClick={() => handleDropdownAction('preview', project)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-200"
                        >
                          <Icon name="Eye" size={14} />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => handleDropdownAction('edit', project)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-200"
                        >
                          <Icon name="Edit" size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDropdownAction('duplicate', project)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-primary hover:bg-background transition-colors duration-200"
                        >
                          <Icon name="Copy" size={14} />
                          <span>Duplicate</span>
                        </button>
                        <div className="border-t border-border-light my-1" />
                        <button
                          onClick={() => handleDropdownAction('delete', project)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-error hover:bg-error-50 transition-colors duration-200"
                        >
                          <Icon name="Trash2" size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActiveDropdown(null)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {mockProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Video" size={32} className="text-primary" />
          </div>
          <h4 className="text-lg font-semibold text-text-primary mb-2">No Projects Yet</h4>
          <p className="text-text-secondary mb-6">
            Create your first AI avatar video from a TikTok URL
          </p>
          <button
            onClick={() => navigate('/video-creation-workflow')}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            Create Your First Video
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProjects;