/**
 * Progress Bar Component
 */
export function ProgressBar({ 
  progress = 0, 
  label, 
  showPercentage = true, 
  className = '',
  size = 'md'
}) {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };
  
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  return (
    <div className={`progress-bar-container ${className}`}>
      {(label || showPercentage) && (
        <div className="progress-header">
          {label && <span className="progress-label">{label}</span>}
          {showPercentage && (
            <span className="progress-percentage">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`progress-track ${sizeClasses[size]}`}>
        <div 
          className="progress-fill"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `${Math.round(clampedProgress)}% complete`}
        />
      </div>
      
      <style jsx>{`
        .progress-bar-container {
          width: 100%;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .progress-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }
        
        .progress-percentage {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .progress-track {
          width: 100%;
          background-color: #e5e7eb;
          border-radius: 9999px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #10b981;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
}

export default ProgressBar;