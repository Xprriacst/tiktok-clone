import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

import ProjectCard from './components/ProjectCard';
import FilterPanel from './components/FilterPanel';
import BulkActions from './components/BulkActions';
import ProjectStats from './components/ProjectStats';

const ProjectHistoryLibrary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date_desc');
  const [filters, setFilters] = useState({
    status: 'all',
    language: 'all',
    avatarType: 'all',
    dateRange: 'all',
    tags: []
  });
  const [favorites, setFavorites] = useState([1, 3, 7]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('root');

  // Mock project data
  const mockProjects = [
    {
      id: 1,
      title: "Marketing Campaign Q4",
      originalUrl: "https://tiktok.com/@user/video/123456789",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=600&fit=crop",
      status: "completed",
      language: "English",
      avatarType: "Professional Female",
      duration: "1:45",
      createdAt: "2024-01-15T10:30:00Z",
      processedAt: "2024-01-15T10:35:00Z",
      fileSize: "15.2 MB",
      views: 1250,
      downloads: 45,
      tags: ["marketing", "professional", "campaign"],
      transcription: `Welcome to our Q4 marketing campaign! This quarter we're focusing on innovative solutions that drive real results for our clients. Our team has been working tirelessly to bring you the best products and services in the industry.`,
      folder: "marketing",
      isShared: true,
      shareUrl: "https://app.com/share/abc123"
    },
    {
      id: 2,
      title: "Product Demo - New Features",
      originalUrl: "https://tiktok.com/@tech/video/987654321",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop",
      status: "processing",
      language: "Spanish",
      avatarType: "Tech Expert Male",
      duration: "2:00",
      createdAt: "2024-01-14T15:20:00Z",
      processedAt: null,
      fileSize: null,
      views: 0,
      downloads: 0,
      tags: ["product", "demo", "features"],
      transcription: `Hola a todos! Hoy les voy a mostrar las nuevas características de nuestro producto. Estas funcionalidades van a revolucionar la forma en que trabajas con datos y análisis.`,
      folder: "products",
      isShared: false,
      shareUrl: null,
      processingProgress: 65
    },
    {
      id: 3,
      title: "Educational Content - AI Basics",
      originalUrl: "https://tiktok.com/@educator/video/456789123",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      status: "completed",
      language: "French",
      avatarType: "Teacher Female",
      duration: "1:30",
      createdAt: "2024-01-13T09:15:00Z",
      processedAt: "2024-01-13T09:20:00Z",
      fileSize: "12.8 MB",
      views: 890,
      downloads: 23,
      tags: ["education", "AI", "tutorial"],
      transcription: `Bonjour tout le monde! Aujourd'hui nous allons explorer les bases de l'intelligence artificielle. C'est un sujet fascinant qui transforme notre monde de manière incroyable.`,
      folder: "education",
      isShared: true,
      shareUrl: "https://app.com/share/def456"
    },
    {
      id: 4,
      title: "Social Media Trend Analysis",
      originalUrl: "https://tiktok.com/@analyst/video/789123456",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=600&fit=crop",
      status: "error",
      language: "English",
      avatarType: "Business Analyst",
      duration: "1:55",
      createdAt: "2024-01-12T14:45:00Z",
      processedAt: null,
      fileSize: null,
      views: 0,
      downloads: 0,
      tags: ["social media", "trends", "analysis"],
      transcription: null,
      folder: "analytics",
      isShared: false,
      shareUrl: null,
      errorMessage: "Audio extraction failed - source video may be corrupted"
    },
    {
      id: 5,
      title: "Fitness Motivation Monday",
      originalUrl: "https://tiktok.com/@fitness/video/321654987",
      thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
      status: "completed",
      language: "German",
      avatarType: "Fitness Coach Male",
      duration: "1:20",
      createdAt: "2024-01-11T07:30:00Z",
      processedAt: "2024-01-11T07:35:00Z",
      fileSize: "10.5 MB",
      views: 2100,
      downloads: 78,
      tags: ["fitness", "motivation", "health"],
      transcription: `Guten Morgen! Heute ist Montag und das bedeutet, es ist Zeit für einen neuen Start. Lass uns gemeinsam an unseren Fitnesszielen arbeiten und stärker werden.`,
      folder: "lifestyle",
      isShared: true,
      shareUrl: "https://app.com/share/ghi789"
    },
    {
      id: 6,
      title: "Cooking Tutorial - Italian Pasta",
      originalUrl: "https://tiktok.com/@chef/video/654987321",
      thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop",
      status: "draft",
      language: "Italian",
      avatarType: "Chef Female",
      duration: "1:40",
      createdAt: "2024-01-10T18:20:00Z",
      processedAt: null,
      fileSize: null,
      views: 0,
      downloads: 0,
      tags: ["cooking", "italian", "tutorial"],
      transcription: `Ciao a tutti! Oggi prepareremo insieme una deliziosa pasta italiana. Gli ingredienti sono semplici ma il risultato sarà straordinario.`,
      folder: "lifestyle",
      isShared: false,
      shareUrl: null
    },
    {
      id: 7,
      title: "Tech Review - Latest Gadgets",
      originalUrl: "https://tiktok.com/@techreview/video/147258369",
      thumbnail: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=600&fit=crop",
      status: "completed",
      language: "English",
      avatarType: "Tech Reviewer Male",
      duration: "1:50",
      createdAt: "2024-01-09T16:10:00Z",
      processedAt: "2024-01-09T16:15:00Z",
      fileSize: "14.7 MB",
      views: 3200,
      downloads: 95,
      tags: ["tech", "review", "gadgets"],
      transcription: `Hey tech enthusiasts! Today we're diving into the latest gadgets that are revolutionizing the way we work and play. These devices are game-changers in every sense.`,
      folder: "technology",
      isShared: true,
      shareUrl: "https://app.com/share/jkl012"
    },
    {
      id: 8,
      title: "Travel Vlog - Paris Adventure",
      originalUrl: "https://tiktok.com/@traveler/video/963852741",
      thumbnail: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=600&fit=crop",
      status: "completed",
      language: "English",
      avatarType: "Travel Blogger Female",
      duration: "1:35",
      createdAt: "2024-01-08T12:45:00Z",
      processedAt: "2024-01-08T12:50:00Z",
      fileSize: "13.1 MB",
      views: 1800,
      downloads: 52,
      tags: ["travel", "paris", "adventure"],
      transcription: `Bonjour from the beautiful city of Paris! Today I'm taking you on an incredible journey through the most iconic landmarks and hidden gems of this amazing city.`,
      folder: "travel",
      isShared: false,
      shareUrl: null
    }
  ];

  const [projects, setProjects] = useState(mockProjects);
  const [filteredProjects, setFilteredProjects] = useState(mockProjects);

  const folders = [
    { id: 'root', name: 'All Projects', count: mockProjects.length, icon: 'FolderOpen' },
    { id: 'marketing', name: 'Marketing', count: 1, icon: 'TrendingUp' },
    { id: 'products', name: 'Products', count: 1, icon: 'Package' },
    { id: 'education', name: 'Education', count: 1, icon: 'GraduationCap' },
    { id: 'analytics', name: 'Analytics', count: 1, icon: 'BarChart3' },
    { id: 'lifestyle', name: 'Lifestyle', count: 2, icon: 'Heart' },
    { id: 'technology', name: 'Technology', count: 1, icon: 'Cpu' },
    { id: 'travel', name: 'Travel', count: 1, icon: 'MapPin' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
    { value: 'views_desc', label: 'Most Viewed' },
    { value: 'downloads_desc', label: 'Most Downloaded' }
  ];

  useEffect(() => {
    applyFiltersAndSort();
  }, [searchQuery, filters, sortBy, currentFolder]);

  const applyFiltersAndSort = () => {
    let filtered = [...projects];

    // Apply folder filter
    if (currentFolder !== 'root') {
      filtered = filtered.filter(project => project.folder === currentFolder);
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.transcription && project.transcription.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(project => project.status === filters.status);
    }

    // Apply language filter
    if (filters.language !== 'all') {
      filtered = filtered.filter(project => project.language === filters.language);
    }

    // Apply avatar type filter
    if (filters.avatarType !== 'all') {
      filtered = filtered.filter(project => project.avatarType === filters.avatarType);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(project => new Date(project.createdAt) >= filterDate);
      }
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(project =>
        filters.tags.some(tag => project.tags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date_asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        case 'views_desc':
          return b.views - a.views;
        case 'downloads_desc':
          return b.downloads - a.downloads;
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const handleProjectSelect = (projectId, isSelected) => {
    if (isSelected) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    }
  };

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  const handleFavoriteToggle = (projectId) => {
    if (favorites.includes(projectId)) {
      setFavorites(favorites.filter(id => id !== projectId));
    } else {
      setFavorites([...favorites, projectId]);
    }
  };

  const handleProjectAction = (action, projectId) => {
    const project = projects.find(p => p.id === projectId);
    
    switch (action) {
      case 'edit': navigate('/avatar-voice-customization', { state: { projectId, projectData: project } });
        break;
      case 'preview': navigate('/video-preview-export', { state: { projectId, projectData: project } });
        break;
      case 'duplicate':
        const duplicatedProject = {
          ...project,
          id: Date.now(),
          title: `${project.title} (Copy)`,
          status: 'draft',
          createdAt: new Date().toISOString(),
          processedAt: null,
          views: 0,
          downloads: 0,
          isShared: false,
          shareUrl: null
        };
        setProjects([duplicatedProject, ...projects]);
        break;
      case 'delete':
        setProjects(projects.filter(p => p.id !== projectId));
        setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        break;
      case 'download':
        // Simulate download
        console.log(`Downloading project: ${project.title}`);
        break;
      case 'share':
        // Simulate sharing
        console.log(`Sharing project: ${project.title}`);
        break;
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
        setSelectedProjects([]);
        break;
      case 'download':
        console.log(`Bulk downloading ${selectedProjects.length} projects`);
        break;
      case 'export':
        console.log(`Bulk exporting ${selectedProjects.length} projects`);
        break;
      case 'move':
        console.log(`Moving ${selectedProjects.length} projects to folder`);
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'error': return 'text-error';
      case 'draft': return 'text-text-secondary';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'processing': return 'Loader2';
      case 'error': return 'AlertCircle';
      case 'draft': return 'FileText';
      default: return 'Circle';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Project Library</h1>
            <p className="text-text-secondary">
              Manage and organize your AI avatar video projects
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/video-creation-workflow')}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <Icon name="Plus" size={16} />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <ProjectStats projects={projects} />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-text-primary mb-3">Folders</h3>
              <div className="space-y-1">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setCurrentFolder(folder.id)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200
                      ${currentFolder === folder.id
                        ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-background'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon name={folder.icon} size={16} />
                      <span>{folder.name}</span>
                    </div>
                    <span className="text-xs">{folder.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              projects={projects}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-surface border border-border rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                {/* Search and Filters */}
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1 sm:w-64">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search projects..."
                      className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    />
                  </div>
                  
                  <button
                    onClick={() => setIsFilterPanelOpen(true)}
                    className="lg:hidden flex items-center space-x-2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    <Icon name="Filter" size={16} />
                    <span>Filters</span>
                  </button>
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center bg-background border border-border rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded transition-colors duration-200 ${
                        viewMode === 'grid' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="Grid3X3" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded transition-colors duration-200 ${
                        viewMode === 'list' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || filters.status !== 'all' || filters.language !== 'all' || filters.avatarType !== 'all' || filters.dateRange !== 'all' || filters.tags.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border-light">
                  <span className="text-xs text-text-secondary">Active filters:</span>
                  
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary text-xs rounded-full">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 hover:text-primary-700"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  )}
                  
                  {filters.status !== 'all' && (
                    <span className="inline-flex items-center px-2 py-1 bg-secondary-50 text-secondary text-xs rounded-full">
                      Status: {filters.status}
                      <button
                        onClick={() => setFilters({...filters, status: 'all'})}
                        className="ml-1 hover:text-secondary-700"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({
                        status: 'all',
                        language: 'all',
                        avatarType: 'all',
                        dateRange: 'all',
                        tags: []
                      });
                    }}
                    className="text-xs text-text-secondary hover:text-text-primary"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedProjects.length > 0 && (
              <BulkActions
                selectedCount={selectedProjects.length}
                onAction={handleBulkAction}
                onSelectAll={handleSelectAll}
                isAllSelected={selectedProjects.length === filteredProjects.length}
              />
            )}

            {/* Projects Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="text-text-secondary animate-spin" />
                <span className="ml-3 text-text-secondary">Loading projects...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FolderOpen" size={48} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">No projects found</h3>
                <p className="text-text-secondary mb-6">
                  {searchQuery || Object.values(filters).some(f => f !== 'all' && (Array.isArray(f) ? f.length > 0 : true))
                    ? "Try adjusting your search or filters" :"Create your first AI avatar video project"
                  }
                </p>
                <button
                  onClick={() => navigate('/video-creation-workflow')}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2 mx-auto"
                >
                  <Icon name="Plus" size={16} />
                  <span>Create New Project</span>
                </button>
              </div>
            ) : (
              <div className={`
                ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' :'space-y-4'
                }
              `}>
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    viewMode={viewMode}
                    isSelected={selectedProjects.includes(project.id)}
                    isFavorite={favorites.includes(project.id)}
                    onSelect={handleProjectSelect}
                    onFavorite={handleFavoriteToggle}
                    onAction={handleProjectAction}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProjects.length > 0 && filteredProjects.length % 12 === 0 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setIsLoading(true)}
                  className="bg-surface border border-border text-text-primary px-6 py-3 rounded-lg font-medium hover:bg-background transition-colors duration-200"
                >
                  Load More Projects
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {isFilterPanelOpen && (
        <div className="lg:hidden fixed inset-0 z-1200 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-80 bg-surface shadow-lg transform transition-transform duration-300">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="p-2 hover:bg-background rounded-lg transition-colors duration-200"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto h-full pb-20">
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                projects={projects}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHistoryLibrary;