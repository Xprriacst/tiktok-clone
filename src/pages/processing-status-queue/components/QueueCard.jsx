import React, { useState } from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const QueueCard = ({ job, index, isSelected, onSelect, onReorder, totalJobs }) => {
  const [isDragging, setIsDragging] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error text-white';
      case 'medium': return 'bg-warning text-white';
      case 'low': return 'bg-text-secondary text-white';
      default: return 'bg-text-secondary text-white';
    }
  };

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const dropIndex = index;
    
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }
  };

  const handleMoveUp = () => {
    if (index > 0) {
      onReorder(index, index - 1);
    }
  };

  const handleMoveDown = () => {
    if (index < totalJobs - 1) {
      onReorder(index, index + 1);
    }
  };

  return (
    <div
      className={`bg-surface border rounded-lg p-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95' : 'hover:shadow-sm'
      } ${isSelected ? 'border-primary bg-primary-50' : 'border-border'}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center space-x-4">
        {/* Selection Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(job.id, e.target.checked)}
            className="w-4 h-4 text-primary bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
          />
        </div>

        {/* Queue Position */}
        <div className="flex items-center justify-center w-8 h-8 bg-background border border-border rounded-full text-sm font-medium text-text-primary">
          {job.queuePosition}
        </div>

        {/* Thumbnail and Info */}
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative w-12 h-16 bg-background rounded overflow-hidden flex-shrink-0">
            <Image
              src={job.thumbnail}
              alt={job.projectName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <Icon name="Clock" size={12} className="text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-text-primary truncate">
                {job.projectName}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(job.priority)}`}>
                {job.priority}
              </span>
            </div>
            
            <p className="text-xs text-text-secondary truncate mb-1">
              {job.tiktokUrl}
            </p>
            
            <div className="flex items-center space-x-3 text-xs text-text-secondary">
              <span className="flex items-center space-x-1">
                <Icon name="Globe" size={10} />
                <span>{job.language}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={10} />
                <span>{job.duration}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Timer" size={10} />
                <span>~{job.estimatedStartTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Reorder Controls */}
        <div className="flex flex-col space-y-1">
          <button
            onClick={handleMoveUp}
            disabled={index === 0}
            className={`p-1 rounded transition-colors duration-200 ${
              index === 0 
                ? 'text-text-secondary cursor-not-allowed' :'text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
            title="Move up in queue"
          >
            <Icon name="ChevronUp" size={14} />
          </button>
          
          <button
            onClick={handleMoveDown}
            disabled={index === totalJobs - 1}
            className={`p-1 rounded transition-colors duration-200 ${
              index === totalJobs - 1 
                ? 'text-text-secondary cursor-not-allowed' :'text-text-secondary hover:text-text-primary hover:bg-background'
            }`}
            title="Move down in queue"
          >
            <Icon name="ChevronDown" size={14} />
          </button>
        </div>

        {/* Drag Handle */}
        <div className="cursor-move text-text-secondary hover:text-text-primary transition-colors duration-200">
          <Icon name="GripVertical" size={16} />
        </div>
      </div>
    </div>
  );
};

export default QueueCard;