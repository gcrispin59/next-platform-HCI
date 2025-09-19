import { Button } from './Button';

/**
 * Error Alert Component
 */
export function ErrorAlert({ 
  title = 'Error', 
  message, 
  onRetry, 
  onDismiss,
  className = '' 
}) {
  return (
    <div className={`error-alert ${className}`} role="alert">
      <div className="error-icon">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-message">{message}</p>
        
        <div className="error-actions">
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
            >
              Try Again
            </Button>
          )}
          
          {onDismiss && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .error-alert {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        
        .error-icon {
          flex-shrink: 0;
          color: #dc2626;
        }
        
        .error-content {
          flex: 1;
        }
        
        .error-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #dc2626;
          margin: 0 0 0.5rem 0;
        }
        
        .error-message {
          color: #7f1d1d;
          margin: 0 0 1rem 0;
          line-height: 1.5;
        }
        
        .error-actions {
          display: flex;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default ErrorAlert;