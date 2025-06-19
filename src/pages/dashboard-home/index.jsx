import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import RecentProjects from './components/RecentProjects';
import QuickStats from './components/QuickStats';
import ProcessingOverview from './components/ProcessingOverview';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalVideos: 24,
    processing: 3,
    completed: 21,
    totalMinutes: 156,
    thisWeek: 8
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'video_completed',
      title: 'Marketing Campaign Video',
      description: 'AI avatar video generation completed successfully',
      timestamp: new Date(Date.now() - 300000),
      status: 'completed'
    },
    {
      id: 2,
      type: 'video_processing',
      title: 'Product Demo Tutorial',
      description: 'Currently processing - 75% complete',
      timestamp: new Date(Date.now() - 900000),
      status: 'processing'
    },
    {
      id: 3,
      type: 'video_created',
      title: 'Social Media Content',
      description: 'New project created from TikTok URL',
      timestamp: new Date(Date.now() - 1800000),
      status: 'draft'
    }
  ]);

  const handleCreateNewVideo = () => {
    navigate('/video-creation-workflow');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setDashboardStats(prev => ({
        ...prev,
        processing: Math.max(0, prev.processing + Math.floor(Math.random() * 3) - 1),
        completed: prev.completed + (Math.random() > 0.7 ? 1 : 0)
      }));
      setRefreshing(false);
    }, 1000);
  };

  const handleViewAllProjects = () => {
    navigate('/project-history-library');
  };

  const handleViewProcessingQueue = () => {
    navigate('/processing-status-queue');
  };

  useEffect(() => {
    // Auto-refresh stats every 30 seconds
    const interval = setInterval(() => {
      setDashboardStats(prev => ({
        ...prev,
        processing: Math.max(0, prev.processing + Math.floor(Math.random() * 2) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Welcome to TikTok Avatar Cloner
              </h1>
              <p className="text-text-secondary">
                Transform TikTok videos into AI-powered avatar content
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Icon 
                name="RefreshCw" 
                size={16} 
                className={refreshing ? 'animate-spin' : ''} 
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Hero Section - Create New Video */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 sm:p-8 mb-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0 lg:flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-3">
                Create Your Next AI Avatar Video
              </h2>
              <p className="text-primary-100 mb-6 max-w-2xl">
                Simply paste a TikTok URL and watch as our AI transforms it into a professional avatar video with synchronized speech and realistic expressions.
              </p>
              <button
                onClick={handleCreateNewVideo}
                className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center space-x-2"
              >
                <Icon name="Plus" size={20} />
                <span>Create New Video</span>
              </button>
            </div>
            <div className="lg:flex-shrink-0 lg:ml-8">
              <div className="w-full lg:w-64 h-40 bg-white/10 rounded-lg flex items-center justify-center">
                <Icon name="Video" size={48} className="text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={dashboardStats} />

        {/* Processing Overview */}
        <ProcessingOverview 
          processingCount={dashboardStats.processing}
          onViewQueue={handleViewProcessingQueue}
        />

        {/* Recent Projects */}
        <RecentProjects onViewAll={handleViewAllProjects} />

        {/* Recent Activity */}
        <div className="bg-surface rounded-xl border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
            <button
              onClick={() => navigate('/project-history-library')}
              className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-background rounded-lg transition-colors duration-200">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${activity.status === 'completed' ? 'bg-success-100 text-success' :
                    activity.status === 'processing'? 'bg-warning-100 text-warning' : 'bg-primary-100 text-primary'
                  }
                `}>
                  <Icon 
                    name={
                      activity.status === 'completed' ? 'CheckCircle' :
                      activity.status === 'processing'? 'Loader2' : 'Plus'
                    } 
                    size={20}
                    className={activity.status === 'processing' ? 'animate-spin' : ''}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {activity.title}
                  </h4>
                  <p className="text-sm text-text-secondary mb-2">
                    {activity.description}
                  </p>
                  <span className="text-xs text-text-secondary">
                    {activity.timestamp.toLocaleTimeString()} • {activity.timestamp.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/video-creation-workflow')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Video" size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">New Project</h3>
            <p className="text-sm text-text-secondary">Start creating from TikTok URL</p>
          </button>

          <button
            onClick={() => navigate('/avatar-voice-customization')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="User" size={24} className="text-secondary" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Customize Avatar</h3>
            <p className="text-sm text-text-secondary">Personalize voice and appearance</p>
          </button>

          <button
            onClick={() => navigate('/processing-status-queue')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="Activity" size={24} className="text-warning" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Processing Queue</h3>
            <p className="text-sm text-text-secondary">Monitor video generation</p>
          </button>

          <button
            onClick={() => navigate('/project-history-library')}
            className="bg-surface border border-border rounded-lg p-6 hover:bg-background transition-colors duration-200 text-left"
          >
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="FolderOpen" size={24} className="text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary mb-2">Project Library</h3>
            <p className="text-sm text-text-secondary">Browse all your videos</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;