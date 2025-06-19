import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkActions = ({ selectedCount, onAction, onSelectAll, isAllSelected }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const bulkActions = [
    { id: 'download', label: 'Download Selected', icon: 'Download' },
    { id: 'export', label: 'Export as ZIP', icon: 'Archive' },
    { id: 'move', label: 'Move to Folder', icon: 'FolderPlus' },
    { id: 'delete', label: 'Delete Selected', icon: 'Trash2', danger: true }
  ];

  const handleAction = (actionId) => {
    onAction(actionId);
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={onSelectAll}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} project{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <button
            onClick={() => handleAction('download')}
            className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
          >
            <Icon name="Download" size={14} />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={() => handleAction('export')}
            className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-background transition-colors duration-200"
          >
            <Icon name="Archive" size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* More Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border text-text-primary rounded-lg text-sm font-medium hover:bg-background transition-colors duration-200"
            >
              <Icon name="MoreHorizontal" size={14} />
              <span className="hidden sm:inline">More</span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
                {bulkActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-background transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                      action.danger ? 'text-error hover:bg-error-50' : 'text-text-primary'
                    }`}
                  >
                    <Icon name={action.icon} size={14} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Descriptions */}
      <div className="mt-3 pt-3 border-t border-primary-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={12} />
            <span>Download individual files</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Archive" size={12} />
            <span>Export as compressed archive</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="FolderPlus" size={12} />
            <span>Organize into folders</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Trash2" size={12} />
            <span>Permanently delete projects</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;