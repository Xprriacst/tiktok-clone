import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const BackgroundOptions = ({ backgroundSettings, onBackgroundChange }) => {
  const [activeCategory, setActiveCategory] = useState('studio');
  const [customColor, setCustomColor] = useState(backgroundSettings.color || '#ffffff');

  const backgroundCategories = [
    { id: 'studio', label: 'Studio', icon: 'Camera' },
    { id: 'solid', label: 'Solid Colors', icon: 'Palette' },
    { id: 'gradient', label: 'Gradients', icon: 'Zap' },
    { id: 'dynamic', label: 'AI Generated', icon: 'Sparkles' }
  ];

  const studioBackgrounds = [
    {
      id: 'white_studio',
      name: 'White Studio',
      thumbnail: 'https://images.pexels.com/photos/1111597/pexels-photo-1111597.jpeg?w=400&h=600&fit=crop',
      lighting: 'soft',
      description: 'Clean white background with soft lighting'
    },
    {
      id: 'gray_studio',
      name: 'Gray Studio',
      thumbnail: 'https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?w=400&h=600&fit=crop',
      lighting: 'neutral',
      description: 'Professional gray backdrop'
    },
    {
      id: 'dark_studio',
      name: 'Dark Studio',
      thumbnail: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?w=400&h=600&fit=crop',
      lighting: 'dramatic',
      description: 'Dark background with dramatic lighting'
    },
    {
      id: 'warm_studio',
      name: 'Warm Studio',
      thumbnail: 'https://images.pexels.com/photos/1111318/pexels-photo-1111318.jpeg?w=400&h=600&fit=crop',
      lighting: 'warm',
      description: 'Warm-toned studio environment'
    },
    {
      id: 'modern_office',
      name: 'Modern Office',
      thumbnail: 'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?w=400&h=600&fit=crop',
      lighting: 'bright',
      description: 'Contemporary office setting'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=400&h=600&fit=crop',
      lighting: 'clean',
      description: 'Ultra-minimal clean background'
    }
  ];

  const solidColors = [
    { color: '#ffffff', name: 'Pure White' },
    { color: '#f8f9fa', name: 'Off White' },
    { color: '#e9ecef', name: 'Light Gray' },
    { color: '#6c757d', name: 'Medium Gray' },
    { color: '#343a40', name: 'Dark Gray' },
    { color: '#000000', name: 'Black' },
    { color: '#007bff', name: 'Blue' },
    { color: '#28a745', name: 'Green' },
    { color: '#dc3545', name: 'Red' },
    { color: '#ffc107', name: 'Yellow' },
    { color: '#6f42c1', name: 'Purple' },
    { color: '#fd7e14', name: 'Orange' }
  ];

  const gradientBackgrounds = [
    {
      id: 'blue_gradient',
      name: 'Blue Gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Smooth blue to purple gradient'
    },
    {
      id: 'sunset_gradient',
      name: 'Sunset',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      description: 'Warm sunset colors'
    },
    {
      id: 'ocean_gradient',
      name: 'Ocean',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      description: 'Ocean blue gradient'
    },
    {
      id: 'forest_gradient',
      name: 'Forest',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      description: 'Fresh green gradient'
    },
    {
      id: 'royal_gradient',
      name: 'Royal',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      description: 'Royal purple gradient'
    },
    {
      id: 'fire_gradient',
      name: 'Fire',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      description: 'Warm fire colors'
    }
  ];

  const dynamicBackgrounds = [
    {
      id: 'ai_office',
      name: 'AI Office',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=600&fit=crop',
      description: 'AI-generated modern office environment'
    },
    {
      id: 'ai_library',
      name: 'AI Library',
      thumbnail: 'https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?w=400&h=600&fit=crop',
      description: 'Sophisticated library setting'
    },
    {
      id: 'ai_tech',
      name: 'AI Tech Hub',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=400&h=600&fit=crop',
      description: 'Futuristic technology environment'
    },
    {
      id: 'ai_nature',
      name: 'AI Nature',
      thumbnail: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?w=400&h=600&fit=crop',
      description: 'Natural outdoor setting'
    }
  ];

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleStudioSelect = (studio) => {
    onBackgroundChange({
      type: 'studio',
      value: studio.id,
      lighting: studio.lighting
    });
  };

  const handleColorSelect = (color) => {
    onBackgroundChange({
      type: 'solid',
      value: color,
      color: color
    });
  };

  const handleCustomColorChange = (color) => {
    setCustomColor(color);
    onBackgroundChange({
      type: 'solid',
      value: color,
      color: color
    });
  };

  const handleGradientSelect = (gradient) => {
    onBackgroundChange({
      type: 'gradient',
      value: gradient.id,
      gradient: gradient.gradient
    });
  };

  const handleDynamicSelect = (dynamic) => {
    onBackgroundChange({
      type: 'dynamic',
      value: dynamic.id,
      thumbnail: dynamic.thumbnail
    });
  };

  const renderStudioBackgrounds = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {studioBackgrounds.map((studio) => (
        <div
          key={studio.id}
          onClick={() => handleStudioSelect(studio)}
          className={`
            relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
            ${backgroundSettings.value === studio.id
              ? 'border-primary shadow-lg ring-2 ring-primary-100'
              : 'border-border hover:border-primary-300 hover:shadow-md'
            }
          `}
        >
          <div className="aspect-[4/3] overflow-hidden">
            <Image
              src={studio.thumbnail}
              alt={studio.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-white font-medium text-sm mb-1">{studio.name}</h4>
              <p className="text-white/80 text-xs">{studio.description}</p>
            </div>
          </div>
          {backgroundSettings.value === studio.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
              <Icon name="Check" size={14} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSolidColors = () => (
    <div className="space-y-6">
      {/* Preset Colors */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Preset Colors</h4>
        <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
          {solidColors.map((colorOption) => (
            <button
              key={colorOption.color}
              onClick={() => handleColorSelect(colorOption.color)}
              className={`
                w-12 h-12 rounded-lg border-2 transition-all duration-200 relative
                ${backgroundSettings.color === colorOption.color
                  ? 'border-primary shadow-lg ring-2 ring-primary-100'
                  : 'border-border hover:border-primary-300'
                }
              `}
              style={{ backgroundColor: colorOption.color }}
              title={colorOption.name}
            >
              {backgroundSettings.color === colorOption.color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon 
                    name="Check" 
                    size={16} 
                    className={colorOption.color === '#ffffff' || colorOption.color === '#f8f9fa' ? 'text-text-primary' : 'text-white'} 
                  />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Custom Color</h4>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border border-border cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={customColor}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              placeholder="#ffffff"
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            onClick={() => handleCustomColorChange(customColor)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  const renderGradients = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {gradientBackgrounds.map((gradient) => (
        <div
          key={gradient.id}
          onClick={() => handleGradientSelect(gradient)}
          className={`
            relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
            ${backgroundSettings.value === gradient.id
              ? 'border-primary shadow-lg ring-2 ring-primary-100'
              : 'border-border hover:border-primary-300 hover:shadow-md'
            }
          `}
        >
          <div 
            className="aspect-[4/3] w-full"
            style={{ background: gradient.gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h4 className="text-white font-medium text-sm mb-1">{gradient.name}</h4>
              <p className="text-white/80 text-xs">{gradient.description}</p>
            </div>
          </div>
          {backgroundSettings.value === gradient.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
              <Icon name="Check" size={14} />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDynamicBackgrounds = () => (
    <div className="space-y-6">
      <div className="bg-warning-50 border border-warning-100 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Sparkles" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-warning mb-1">AI-Generated Backgrounds</h4>
            <p className="text-sm text-warning/80">
              These backgrounds are dynamically generated based on your content and avatar selection for optimal visual harmony.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dynamicBackgrounds.map((dynamic) => (
          <div
            key={dynamic.id}
            onClick={() => handleDynamicSelect(dynamic)}
            className={`
              relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
              ${backgroundSettings.value === dynamic.id
                ? 'border-primary shadow-lg ring-2 ring-primary-100'
                : 'border-border hover:border-primary-300 hover:shadow-md'
              }
            `}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={dynamic.thumbnail}
                alt={dynamic.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-white font-medium text-sm mb-1">{dynamic.name}</h4>
                <p className="text-white/80 text-xs">{dynamic.description}</p>
              </div>
            </div>
            {backgroundSettings.value === dynamic.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                <Icon name="Check" size={14} />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-accent text-white text-xs rounded-full flex items-center space-x-1">
                <Icon name="Sparkles" size={10} />
                <span>AI</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {backgroundCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryChange(category.id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200
              ${activeCategory === category.id
                ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-background'
              }
            `}
          >
            <Icon name={category.icon} size={16} />
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div>
        {activeCategory === 'studio' && renderStudioBackgrounds()}
        {activeCategory === 'solid' && renderSolidColors()}
        {activeCategory === 'gradient' && renderGradients()}
        {activeCategory === 'dynamic' && renderDynamicBackgrounds()}
      </div>

      {/* Background Settings */}
      {backgroundSettings.type === 'studio' && (
        <div className="bg-background rounded-lg p-4 border border-border">
          <h4 className="font-medium text-text-primary mb-3">Lighting Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Lighting Intensity
              </label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="75"
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>Dim</span>
                <span>Bright</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Background Blur
              </label>
              <input
                type="range"
                min="0"
                max="10"
                defaultValue="0"
                className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>Sharp</span>
                <span>Blurred</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Selection Summary */}
      <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-2">Current Background</h4>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-12 rounded border border-primary-200 overflow-hidden flex-shrink-0">
            {backgroundSettings.type === 'solid' && (
              <div 
                className="w-full h-full" 
                style={{ backgroundColor: backgroundSettings.color }}
              />
            )}
            {backgroundSettings.type === 'gradient' && (
              <div 
                className="w-full h-full" 
                style={{ background: backgroundSettings.gradient }}
              />
            )}
            {(backgroundSettings.type === 'studio' || backgroundSettings.type === 'dynamic') && (
              <div className="w-full h-full bg-background flex items-center justify-center">
                <Icon name="Image" size={16} className="text-text-secondary" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary capitalize">
              {backgroundSettings.type} Background
            </p>
            <p className="text-xs text-text-secondary">
              {backgroundSettings.type === 'solid' && `Color: ${backgroundSettings.color}`}
              {backgroundSettings.type === 'studio' && `Lighting: ${backgroundSettings.lighting}`}
              {backgroundSettings.type === 'gradient' && 'Custom gradient applied'}
              {backgroundSettings.type === 'dynamic' && 'AI-generated environment'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundOptions;