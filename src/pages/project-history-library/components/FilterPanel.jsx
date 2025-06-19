import React from 'react';
import Icon from 'components/AppIcon';

const FilterPanel = ({ filters, onFiltersChange, projects }) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', count: projects.length },
    { value: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { value: 'processing', label: 'Processing', count: projects.filter(p => p.status === 'processing').length },
    { value: 'draft', label: 'Draft', count: projects.filter(p => p.status === 'draft').length },
    { value: 'error', label: 'Error', count: projects.filter(p => p.status === 'error').length }
  ];

  const languageOptions = [
    { value: 'all', label: 'All Languages', count: projects.length },
    { value: 'English', label: 'English', count: projects.filter(p => p.language === 'English').length },
    { value: 'Spanish', label: 'Spanish', count: projects.filter(p => p.language === 'Spanish').length },
    { value: 'French', label: 'French', count: projects.filter(p => p.language === 'French').length },
    { value: 'German', label: 'German', count: projects.filter(p => p.language === 'German').length },
    { value: 'Italian', label: 'Italian', count: projects.filter(p => p.language === 'Italian').length }
  ];

  const avatarTypeOptions = [
    { value: 'all', label: 'All Avatar Types', count: projects.length },
    { value: 'Professional Female', label: 'Professional Female', count: projects.filter(p => p.avatarType === 'Professional Female').length },
    { value: 'Tech Expert Male', label: 'Tech Expert Male', count: projects.filter(p => p.avatarType === 'Tech Expert Male').length },
    { value: 'Teacher Female', label: 'Teacher Female', count: projects.filter(p => p.avatarType === 'Teacher Female').length },
    { value: 'Business Analyst', label: 'Business Analyst', count: projects.filter(p => p.avatarType === 'Business Analyst').length },
    { value: 'Fitness Coach Male', label: 'Fitness Coach Male', count: projects.filter(p => p.avatarType === 'Fitness Coach Male').length }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const allTags = [...new Set(projects.flatMap(p => p.tags))];
  const popularTags = allTags.slice(0, 10);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleTagToggle = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      language: 'all',
      avatarType: 'all',
      dateRange: 'all',
      tags: []
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.language !== 'all' || 
                          filters.avatarType !== 'all' || 
                          filters.dateRange !== 'all' || 
                          filters.tags.length > 0;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Status</h4>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={filters.status === option.value}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary-500 focus:ring-2"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm text-text-primary">{option.label}</span>
                <span className="text-xs text-text-secondary">{option.count}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Language</h4>
        <div className="space-y-2">
          {languageOptions.filter(opt => opt.count > 0).map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="language"
                value={option.value}
                checked={filters.language === option.value}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary-500 focus:ring-2"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm text-text-primary">{option.label}</span>
                <span className="text-xs text-text-secondary">{option.count}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Avatar Type Filter */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Avatar Type</h4>
        <div className="space-y-2">
          {avatarTypeOptions.filter(opt => opt.count > 0).map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="avatarType"
                value={option.value}
                checked={filters.avatarType === option.value}
                onChange={(e) => handleFilterChange('avatarType', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary-500 focus:ring-2"
              />
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm text-text-primary truncate">{option.label}</span>
                <span className="text-xs text-text-secondary">{option.count}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Date Range</h4>
        <div className="space-y-2">
          {dateRangeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="dateRange"
                value={option.value}
                checked={filters.dateRange === option.value}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-4 h-4 text-primary bg-background border-border focus:ring-primary-500 focus:ring-2"
              />
              <span className="text-sm text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags Filter */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200
                ${filters.tags.includes(tag)
                  ? 'bg-primary text-white' :'bg-background text-text-secondary hover:text-text-primary hover:bg-surface border border-border'
                }
              `}
            >
              #{tag}
              {filters.tags.includes(tag) && (
                <Icon name="X" size={12} className="ml-1" />
              )}
            </button>
          ))}
        </div>
        
        {filters.tags.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary">
                {filters.tags.length} tag{filters.tags.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => handleFilterChange('tags', [])}
                className="text-xs text-primary hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Clear Tags
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">Quick Filters</h4>
        <div className="space-y-2">
          <button
            onClick={() => onFiltersChange({
              ...filters,
              status: 'completed',
              dateRange: 'week'
            })}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200 text-left"
          >
            <Icon name="CheckCircle" size={14} />
            <span>Recent Completed</span>
          </button>
          
          <button
            onClick={() => onFiltersChange({
              ...filters,
              status: 'processing'
            })}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200 text-left"
          >
            <Icon name="Loader2" size={14} />
            <span>Currently Processing</span>
          </button>
          
          <button
            onClick={() => onFiltersChange({
              ...filters,
              status: 'error'
            })}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors duration-200 text-left"
          >
            <Icon name="AlertCircle" size={14} />
            <span>Need Attention</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;