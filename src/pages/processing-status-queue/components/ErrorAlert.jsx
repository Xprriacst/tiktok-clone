import React from 'react';
import Icon from 'components/AppIcon';

const ErrorAlert = ({ title, message, type = 'error', className = '', action }) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-warning-50 border-warning-200',
          icon: 'text-warning-600',
          title: 'text-warning-800',
          message: 'text-warning-700',
          button: 'text-warning-700 hover:text-warning-800'
        };
      case 'error':
        return {
          container: 'bg-error-50 border-error-200',
          icon: 'text-error-600',
          title: 'text-error-800',
          message: 'text-error-700',
          button: 'text-error-700 hover:text-error-800'
        };
      case 'info':
        return {
          container: 'bg-primary-50 border-primary-200',
          icon: 'text-primary-600',
          title: 'text-primary-800',
          message: 'text-primary-700',
          button: 'text-primary-700 hover:text-primary-800'
        };
      default:
        return {
          container: 'bg-background border-border',
          icon: 'text-text-secondary',
          title: 'text-text-primary',
          message: 'text-text-secondary',
          button: 'text-text-primary hover:text-text-secondary'
        };
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'AlertCircle';
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`border rounded-lg p-4 ${styles.container} ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon 
          name={getAlertIcon()} 
          size={20} 
          className={`flex-shrink-0 mt-0.5 ${styles.icon}`} 
        />
        
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${styles.title} mb-1`}>
            {title}
          </h3>
          <p className={`text-sm ${styles.message}`}>
            {message}
          </p>
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className={`text-sm font-medium ${styles.button} transition-colors duration-200`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;