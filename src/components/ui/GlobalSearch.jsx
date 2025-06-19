import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'Marketing Video Campaign',
    'Product Demo 2024',
    'Social Media Content'
  ]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search data
  const mockProjects = [
    { id: 1, name: 'Marketing Video Campaign', type: 'project', status: 'completed', lastModified: '2 hours ago', thumbnail: '/assets/images/project1.jpg' },
    { id: 2, name: 'Product Demo 2024', type: 'project', status: 'processing', lastModified: '1 day ago', thumbnail: '/assets/images/project2.jpg' },
    { id: 3, name: 'Social Media Content', type: 'project', status: 'draft', lastModified: '3 days ago', thumbnail: '/assets/images/project3.jpg' },
    { id: 4, name: 'Training Materials', type: 'project', status: 'completed', lastModified: '1 week ago', thumbnail: '/assets/images/project4.jpg' },
    { id: 5, name: 'Avatar Customization', type: 'template', category: 'avatar', lastModified: '2 days ago' },
    { id: 6, name: 'Voice Settings', type: 'template', category: 'voice', lastModified: '5 days ago' }
  ];

  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filteredResults = mockProjects.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.type && item.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleSearch = (searchTerm) => {
    // Add to recent searches
    setRecentSearches(prev => {
      const updated = [searchTerm, ...prev.filter(item => item !== searchTerm)].slice(0, 5);
      return updated;
    });

    // Navigate to library with search query
    navigate('/project-history-library', { 
      state: { searchQuery: searchTerm } 
    });
    
    setQuery('');
    setIsExpanded(false);
    inputRef.current?.blur();
  };

  const handleResultClick = (result) => {
    if (result.type === 'project') {
      navigate('/video-preview-export', { 
        state: { projectId: result.id, projectName: result.name } 
      });
    } else {
      navigate('/avatar-voice-customization', { 
        state: { template: result.category } 
      });
    }
    setQuery('');
    setIsExpanded(false);
  };

  const handleRecentSearchClick = (searchTerm) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
    handleSearch(searchTerm);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'processing': return 'text-warning';
      case 'draft': return 'text-text-secondary';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
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

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project': return 'Video';
      case 'template': return 'Layout';
      default: return 'File';
    }
  };

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          flex items-center transition-all duration-200
          ${isExpanded ? 'w-80' : 'w-64'}
          md:w-80
        `}>
          <div className="relative w-full">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary z-10" 
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              placeholder="Search projects, templates..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setResults([]);
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-surface border border-border rounded-lg shadow-lg z-1200 animate-slide-in max-h-96 overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader2" size={20} className="text-text-secondary animate-spin" />
              <span className="ml-2 text-sm text-text-secondary">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              <div className="p-3 border-b border-border-light">
                <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Search Results ({results.length})
                </h4>
              </div>
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-background transition-colors duration-200 text-left"
                  >
                    <div className="flex-shrink-0">
                      <Icon 
                        name={getTypeIcon(result.type)} 
                        size={16} 
                        className="text-text-secondary" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-text-primary truncate">
                          {result.name}
                        </span>
                        {result.status && (
                          <Icon 
                            name={getStatusIcon(result.status)} 
                            size={12} 
                            className={`${getStatusColor(result.status)} ${result.status === 'processing' ? 'animate-spin' : ''}`} 
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-text-secondary capitalize">
                          {result.type}
                        </span>
                        {result.category && (
                          <>
                            <span className="text-xs text-text-secondary">•</span>
                            <span className="text-xs text-text-secondary capitalize">
                              {result.category}
                            </span>
                          </>
                        )}
                        <span className="text-xs text-text-secondary">•</span>
                        <span className="text-xs text-text-secondary">
                          {result.lastModified}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-8">
              <Icon name="Search" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">No results found for "{query}"</p>
              <button
                onClick={() => handleSearch(query)}
                className="mt-2 text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Search in all projects
              </button>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && !query && recentSearches.length > 0 && (
            <div>
              <div className="p-3 border-b border-border-light">
                <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                  Recent Searches
                </h4>
              </div>
              <div className="py-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-background transition-colors duration-200 text-left"
                  >
                    <Icon name="Clock" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-primary">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {!query && (
            <div className="border-t border-border-light p-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/video-creation-workflow')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors duration-200"
                >
                  <Icon name="Plus" size={14} />
                  <span>New Project</span>
                </button>
                <button
                  onClick={() => navigate('/project-history-library')}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded transition-colors duration-200"
                >
                  <Icon name="FolderOpen" size={14} />
                  <span>Browse All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;