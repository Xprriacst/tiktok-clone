import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ projectContext = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/dashboard-home': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/video-creation-workflow': { label: 'Video Creation', icon: 'Video', parent: 'Create' },
    '/avatar-voice-customization': { label: 'Avatar & Voice', icon: 'User', parent: 'Create' },
    '/processing-status-queue': { label: 'Processing Status', icon: 'Activity', parent: 'Monitor' },
    '/video-preview-export': { label: 'Preview & Export', icon: 'Eye', parent: 'Library' },
    '/project-history-library': { label: 'Project Library', icon: 'FolderOpen', parent: 'Library' }
  };

  const generateBreadcrumbs = () => {
    const currentRoute = routeMap[location.pathname];
    if (!currentRoute) return [];

    const breadcrumbs = [];

    if (currentRoute.parent) {
      breadcrumbs.push({
        label: currentRoute.parent,
        path: null,
        icon: getParentIcon(currentRoute.parent),
        isParent: true
      });
    }

    breadcrumbs.push({
      label: currentRoute.label,
      path: location.pathname,
      icon: currentRoute.icon,
      isActive: true
    });

    if (projectContext) {
      breadcrumbs.push({
        label: projectContext.name || 'Untitled Project',
        path: null,
        icon: 'FileVideo',
        isProject: true
      });
    }

    return breadcrumbs;
  };

  const getParentIcon = (parent) => {
    const parentIcons = {
      'Create': 'Video',
      'Monitor': 'Activity',
      'Library': 'FolderOpen'
    };
    return parentIcons[parent] || 'Folder';
  };

  const handleBreadcrumbClick = (breadcrumb) => {
    if (breadcrumb.path && !breadcrumb.isActive) {
      navigate(breadcrumb.path);
    } else if (breadcrumb.isParent) {
      const parentRoutes = {
        'Create': '/video-creation-workflow',
        'Monitor': '/processing-status-queue',
        'Library': '/project-history-library'
      };
      if (parentRoutes[breadcrumb.label]) {
        navigate(parentRoutes[breadcrumb.label]);
      }
    }
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 px-6 py-3 bg-background border-b border-border-light" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-text-secondary mx-2" 
              />
            )}
            <button
              onClick={() => handleBreadcrumbClick(breadcrumb)}
              className={`
                flex items-center space-x-2 px-2 py-1 rounded text-sm font-medium transition-colors duration-200
                ${breadcrumb.isActive
                  ? 'text-text-primary cursor-default'
                  : breadcrumb.path || breadcrumb.isParent
                    ? 'text-text-secondary hover:text-text-primary hover:bg-surface' :'text-text-secondary cursor-default'
                }
                ${breadcrumb.isProject ? 'bg-primary-50 text-primary border border-primary-100' : ''}
              `}
              disabled={breadcrumb.isActive && !breadcrumb.isParent}
              title={breadcrumb.isProject ? `Project: ${breadcrumb.label}` : breadcrumb.label}
            >
              <Icon 
                name={breadcrumb.icon} 
                size={14} 
                className={breadcrumb.isProject ? 'text-primary' : 'current'} 
              />
              <span className={`
                ${window.innerWidth < 768 && breadcrumb.label.length > 15 
                  ? 'truncate max-w-[120px]' 
                  : ''
                }
              `}>
                {breadcrumb.label}
              </span>
              {breadcrumb.isProject && projectContext?.status && (
                <span className={`
                  inline-flex items-center justify-center w-2 h-2 rounded-full ml-1
                  ${projectContext.status === 'processing' ? 'bg-warning animate-pulse' :
                    projectContext.status === 'completed' ? 'bg-success' :
                    projectContext.status === 'error'? 'bg-error' : 'bg-text-secondary'
                  }
                `} />
              )}
            </button>
          </li>
        ))}
      </ol>
      
      {/* Quick Actions */}
      {location.pathname !== '/dashboard-home' && (
        <div className="flex items-center ml-auto space-x-2">
          <button
            onClick={() => navigate('/dashboard-home')}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded transition-colors duration-200"
            title="Back to Dashboard"
          >
            <Icon name="Home" size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Breadcrumb;