import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExportOptions = ({ settings, onSettingsChange, onExport, getFileSize, projectName }) => {
  const [expandedSection, setExpandedSection] = useState('quality');

  const qualityOptions = [
    { value: '1080p', label: '1080p HD', description: 'Best quality, larger file size' },
    { value: '720p', label: '720p', description: 'Good quality, balanced size' },
    { value: '480p', label: '480p', description: 'Smaller size, faster upload' }
  ];

  const formatOptions = [
    { value: 'MP4', label: 'MP4', description: 'Universal compatibility' },
    { value: 'MOV', label: 'MOV', description: 'Apple optimized' }
  ];

  const compressionOptions = [
    { value: 'high', label: 'High Quality', description: 'Minimal compression' },
    { value: 'balanced', label: 'Balanced', description: 'Good quality & size' },
    { value: 'compressed', label: 'Compressed', description: 'Smaller file size' }
  ];

  const handleSettingChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const estimatedFileSize = getFileSize(settings.quality);

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border-light">
        <h3 className="text-lg font-semibold text-text-primary">Export Options</h3>
        <p className="text-sm text-text-secondary mt-1">Configure your video export settings</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Quality Settings */}
        <div className="border border-border-light rounded-lg">
          <button
            onClick={() => toggleSection('quality')}
            className="w-full flex items-center justify-between p-3 hover:bg-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Settings" size={16} className="text-text-secondary" />
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Quality & Format</div>
                <div className="text-xs text-text-secondary">{settings.quality} • {settings.format}</div>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform duration-200 ${
                expandedSection === 'quality' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {expandedSection === 'quality' && (
            <div className="px-3 pb-3 space-y-4">
              {/* Quality Selection */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Resolution</label>
                <div className="space-y-2">
                  {qualityOptions.map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="quality"
                        value={option.value}
                        checked={settings.quality === option.value}
                        onChange={(e) => handleSettingChange('quality', e.target.value)}
                        className="w-4 h-4 text-primary focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">{option.label}</div>
                        <div className="text-xs text-text-secondary">{option.description}</div>
                      </div>
                      <div className="text-xs text-text-secondary">
                        ~{getFileSize(option.value)} MB
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {formatOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('format', option.value)}
                      className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                        settings.format === option.value
                          ? 'border-primary bg-primary-50 text-primary' :'border-border-light hover:bg-background'
                      }`}
                    >
                      <div className="text-sm font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compression */}
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">Compression</label>
                <select
                  value={settings.compression}
                  onChange={(e) => handleSettingChange('compression', e.target.value)}
                  className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                >
                  {compressionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Options */}
        <div className="border border-border-light rounded-lg">
          <button
            onClick={() => toggleSection('advanced')}
            className="w-full flex items-center justify-between p-3 hover:bg-background transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Sliders" size={16} className="text-text-secondary" />
              <div className="text-left">
                <div className="text-sm font-medium text-text-primary">Advanced Options</div>
                <div className="text-xs text-text-secondary">Watermark, branding, and more</div>
              </div>
            </div>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform duration-200 ${
                expandedSection === 'advanced' ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {expandedSection === 'advanced' && (
            <div className="px-3 pb-3 space-y-4">
              {/* Remove Watermark */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.removeWatermark}
                  onChange={(e) => handleSettingChange('removeWatermark', e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary-500 rounded"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">Remove Watermark</div>
                  <div className="text-xs text-text-secondary">Remove AI-generated watermark</div>
                </div>
              </label>

              {/* Add Branding */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={settings.addBranding}
                    onChange={(e) => handleSettingChange('addBranding', e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary-500 rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">Add Custom Branding</div>
                    <div className="text-xs text-text-secondary">Add your logo or text overlay</div>
                  </div>
                </label>

                {settings.addBranding && (
                  <input
                    type="text"
                    placeholder="Enter branding text..."
                    value={settings.brandingText}
                    onChange={(e) => handleSettingChange('brandingText', e.target.value)}
                    className="w-full px-3 py-2 border border-border-light rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* File Size Estimate */}
        <div className="bg-background rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">Estimated File Size</span>
            <span className="text-lg font-semibold text-primary">{estimatedFileSize} MB</span>
          </div>
          <div className="text-xs text-text-secondary">
            Based on {settings.quality} quality with {settings.compression} compression
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <Icon name="Download" size={20} />
          <span>Export Video</span>
        </button>

        {/* Quick Export Options */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              handleSettingChange('quality', '1080p');
              handleSettingChange('format', 'MP4');
              handleSettingChange('compression', 'high');
              onExport();
            }}
            className="px-3 py-2 bg-background border border-border-light rounded-lg hover:bg-surface transition-colors duration-200 text-sm font-medium text-text-primary"
          >
            <Icon name="Zap" size={14} className="mr-1" />
            Quick HD
          </button>
          <button
            onClick={() => {
              handleSettingChange('quality', '720p');
              handleSettingChange('format', 'MP4');
              handleSettingChange('compression', 'compressed');
              onExport();
            }}
            className="px-3 py-2 bg-background border border-border-light rounded-lg hover:bg-surface transition-colors duration-200 text-sm font-medium text-text-primary"
          >
            <Icon name="Smartphone" size={14} className="mr-1" />
            Mobile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;