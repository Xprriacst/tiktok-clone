import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const AvatarGrid = ({ selectedAvatar, onAvatarSelect }) => {
  const [filters, setFilters] = useState({
    category: 'all',
    ethnicity: 'all',
    age: 'all',
    style: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock avatar data
  const avatars = [
    {
      id: 'avatar_001',
      name: 'Professional Female',
      category: 'business',
      ethnicity: 'caucasian',
      age: 'adult',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
      tags: ['professional', 'confident', 'business']
    },
    {
      id: 'avatar_002',
      name: 'Casual Male',
      category: 'casual',
      ethnicity: 'african',
      age: 'young',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      tags: ['casual', 'friendly', 'approachable']
    },
    {
      id: 'avatar_003',
      name: 'Tech Presenter',
      category: 'tech',
      ethnicity: 'asian',
      age: 'adult',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
      tags: ['tech', 'presenter', 'modern']
    },
    {
      id: 'avatar_004',
      name: 'Creative Artist',
      category: 'creative',
      ethnicity: 'hispanic',
      age: 'young',
      style: 'artistic',
      thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
      tags: ['creative', 'artistic', 'expressive']
    },
    {
      id: 'avatar_005',
      name: 'Executive Male',
      category: 'business',
      ethnicity: 'caucasian',
      age: 'mature',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=600&fit=crop&crop=face',
      tags: ['executive', 'authoritative', 'experienced']
    },
    {
      id: 'avatar_006',
      name: 'Friendly Teacher',
      category: 'education',
      ethnicity: 'mixed',
      age: 'adult',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face',
      tags: ['teacher', 'friendly', 'educational']
    },
    {
      id: 'avatar_007',
      name: 'Fitness Coach',
      category: 'fitness',
      ethnicity: 'african',
      age: 'adult',
      style: 'realistic',
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop&crop=face',
      tags: ['fitness', 'energetic', 'motivational']
    },
    {
      id: 'avatar_008',
      name: 'Fashion Model',
      category: 'fashion',
      ethnicity: 'asian',
      age: 'young',
      style: 'stylized',
      thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
      tags: ['fashion', 'stylish', 'trendy']
    }
  ];

  const filterOptions = {
    category: [
      { value: 'all', label: 'All Categories' },
      { value: 'business', label: 'Business' },
      { value: 'casual', label: 'Casual' },
      { value: 'tech', label: 'Technology' },
      { value: 'creative', label: 'Creative' },
      { value: 'education', label: 'Education' },
      { value: 'fitness', label: 'Fitness' },
      { value: 'fashion', label: 'Fashion' }
    ],
    ethnicity: [
      { value: 'all', label: 'All Ethnicities' },
      { value: 'caucasian', label: 'Caucasian' },
      { value: 'african', label: 'African' },
      { value: 'asian', label: 'Asian' },
      { value: 'hispanic', label: 'Hispanic' },
      { value: 'mixed', label: 'Mixed' }
    ],
    age: [
      { value: 'all', label: 'All Ages' },
      { value: 'young', label: 'Young (18-30)' },
      { value: 'adult', label: 'Adult (30-50)' },
      { value: 'mature', label: 'Mature (50+)' }
    ],
    style: [
      { value: 'all', label: 'All Styles' },
      { value: 'realistic', label: 'Realistic' },
      { value: 'artistic', label: 'Artistic' },
      { value: 'stylized', label: 'Stylized' }
    ]
  };

  const filteredAvatars = useMemo(() => {
    return avatars.filter(avatar => {
      const matchesCategory = filters.category === 'all' || avatar.category === filters.category;
      const matchesEthnicity = filters.ethnicity === 'all' || avatar.ethnicity === filters.ethnicity;
      const matchesAge = filters.age === 'all' || avatar.age === filters.age;
      const matchesStyle = filters.style === 'all' || avatar.style === filters.style;
      const matchesSearch = searchQuery === '' || 
        avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        avatar.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesEthnicity && matchesAge && matchesStyle && matchesSearch;
    });
  }, [filters, searchQuery]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAvatarClick = (avatar) => {
    onAvatarSelect(avatar);
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      ethnicity: 'all',
      age: 'all',
      style: 'all'
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== 'all').length + (searchQuery ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search avatars by name or style..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              <Icon name="X" size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(filterOptions).map(([filterType, options]) => (
            <div key={filterType}>
              <label className="block text-sm font-medium text-text-primary mb-1 capitalize">
                {filterType}
              </label>
              <select
                value={filters[filterType]}
                onChange={(e) => handleFilterChange(filterType, e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              >
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Active Filters & Clear */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {filteredAvatars.length} avatar{filteredAvatars.length !== 1 ? 's' : ''} found
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount !== 1 ? 's' : ''} active)`}
            </span>
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-700 font-medium transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Avatar Grid */}
      {filteredAvatars.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAvatars.map((avatar) => (
            <div
              key={avatar.id}
              onClick={() => handleAvatarClick(avatar)}
              className={`
                relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
                ${selectedAvatar?.id === avatar.id
                  ? 'border-primary shadow-lg ring-2 ring-primary-100'
                  : 'border-border hover:border-primary-300 hover:shadow-md'
                }
              `}
            >
              {/* Avatar Image */}
              <div className="aspect-[3/4] overflow-hidden bg-background">
                <Image
                  src={avatar.thumbnail}
                  alt={avatar.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Avatar Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-medium text-sm mb-1">{avatar.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {avatar.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedAvatar?.id === avatar.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} />
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full capitalize">
                  {avatar.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="User" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No avatars found</h3>
          <p className="text-text-secondary mb-4">
            Try adjusting your filters or search terms to find the perfect avatar.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Selected Avatar Summary */}
      {selectedAvatar && (
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0">
              <Image
                src={selectedAvatar.thumbnail}
                alt={selectedAvatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary">{selectedAvatar.name}</h4>
              <p className="text-sm text-text-secondary capitalize">
                {selectedAvatar.category} • {selectedAvatar.ethnicity} • {selectedAvatar.age} • {selectedAvatar.style}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedAvatar.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-100 text-primary text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Icon name="CheckCircle" size={20} className="text-primary" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGrid;