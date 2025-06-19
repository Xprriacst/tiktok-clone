import React from 'react';
import Icon from 'components/AppIcon';

const QuickStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Videos',
      value: stats.totalVideos,
      icon: 'Video',
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Processing',
      value: stats.processing,
      icon: 'Loader2',
      color: 'warning',
      animated: true
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: 'CheckCircle',
      color: 'success',
      change: '+3',
      changeType: 'positive'
    },
    {
      label: 'Total Minutes',
      value: stats.totalMinutes,
      icon: 'Clock',
      color: 'secondary',
      suffix: 'min'
    },
    {
      label: 'This Week',
      value: stats.thisWeek,
      icon: 'TrendingUp',
      color: 'accent',
      change: '+25%',
      changeType: 'positive'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-100 text-primary',
      secondary: 'bg-secondary-100 text-secondary',
      success: 'bg-success-100 text-success',
      warning: 'bg-warning-100 text-warning',
      accent: 'bg-accent-100 text-accent'
    };
    return colorMap[color] || 'bg-primary-100 text-primary';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(item.color)}`}>
              <Icon 
                name={item.icon} 
                size={20} 
                className={item.animated ? 'animate-spin' : ''}
              />
            </div>
            {item.change && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                item.changeType === 'positive' ?'bg-success-100 text-success' :'bg-error-100 text-error'
              }`}>
                {item.change}
              </span>
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-text-primary">
                {item.value}
              </span>
              {item.suffix && (
                <span className="text-sm text-text-secondary">
                  {item.suffix}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;