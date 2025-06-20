import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Simplification: suppression des éléments de statut non fonctionnels

  const navigationTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      tooltip: 'Accueil'
    },
    {
      id: 'create',
      label: 'Create Video',
      paths: ['/video-creation-workflow', '/avatar-voice-customization'],
      icon: 'Video',
      tooltip: 'Créer une nouvelle vidéo'
    },
    {
      id: 'export',
      label: 'Export',
      path: '/video-preview-export',
      icon: 'Share2',
      tooltip: 'Prévisualiser et exporter'
    }
  ];

  const isTabActive = (tab) => {
    if (tab.path) {
      return location.pathname === tab.path;
    }
    if (tab.paths) {
      return tab.paths.includes(location.pathname);
    }
    return false;
  };

  const handleTabClick = (tab) => {
    if (tab.path) {
      navigate(tab.path);
    } else if (tab.paths && tab.paths.length > 0) {
      navigate(tab.paths[0]);
    }
  };

  // Suppression des fonctions de recherche et de mise à jour de statut non fonctionnelles

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-heading font-semibold text-text-primary">
              AI VideoStudio
            </span>
          </div>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`
                  relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isTabActive(tab)
                    ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-background'
                  }
                `}
                title={tab.tooltip}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {/* Suppression des badges non fonctionnels */}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Processing Status Indicator */}
          <div className="hidden lg:flex items-center space-x-3 px-3 py-2 bg-background rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${processingStatus.isProcessing ? 'bg-accent animate-pulse' : 'bg-text-secondary'}`} />
              <span className="text-sm text-text-secondary">
                {processingStatus.activeJobs} active
              </span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-sm text-text-secondary">
              {processingStatus.completedToday} completed
            </span>
          </div>

          {/* Search Interface */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className={`
              flex items-center transition-all duration-200
              ${isSearchExpanded ? 'w-64' : 'w-10'}
              md:w-64
            `}>
              <div className="relative w-full">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Search projects..."
                  className={`
                    w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200
                    ${!isSearchExpanded ? 'md:opacity-100 opacity-0' : 'opacity-100'}
                  `}
                />
              </div>
            </div>
          </form>

          {/* Mobile Processing Status */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-background transition-colors duration-200">
            <div className="relative">
              <Icon name="Activity" size={20} className="text-text-secondary" />
              {processingStatus.isProcessing && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-1000">
        <nav className="flex items-center justify-around py-2">
          {navigationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200
                ${isTabActive(tab)
                  ? 'text-primary' :'text-text-secondary'
                }
              `}
            >
              <div className="relative">
                <Icon name={tab.icon} size={20} />
                {tab.badge && (
                  <span className={`
                    absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[16px] h-[16px] text-xs font-medium rounded-full
                    ${tab.badge === 'active' ?'bg-accent text-white' :'bg-secondary text-white'
                    }
                  `}>
                    {tab.badge === 'active' ? '' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;