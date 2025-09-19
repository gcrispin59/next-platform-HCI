import { useState } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

/**
 * Help System Component
 * Provides contextual help and guidance for forms
 */
export function HelpSystem({ formType, helpContent }) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const openHelp = () => {
    setIsHelpOpen(true);
  };

  const closeHelp = () => {
    setIsHelpOpen(false);
  };

  if (!helpContent || !helpContent.sections) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => alert('Help content not available')}
        className="help-button"
      >
        📖 Help
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={openHelp}
        className="help-button"
        aria-label="Open form help"
      >
        📖 Help
      </Button>
      
      <Modal 
        isOpen={isHelpOpen}
        onClose={closeHelp}
        title={helpContent.title}
        size="large"
      >
        <div className="help-content">
          <div className="help-navigation">
            <div className="help-sections-list">
              {helpContent.sections.map((section, index) => (
                <button
                  key={section.id}
                  className={`help-section-link ${
                    index === activeSection ? 'active' : ''
                  }`}
                  onClick={() => setActiveSection(index)}
                >
                  {section.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className="help-section-content">
            {helpContent.sections[activeSection] && (
              <div>
                <h3>{helpContent.sections[activeSection].title}</h3>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: helpContent.sections[activeSection].content 
                  }}
                  className="help-text"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="help-footer">
          <p className="help-contact">
            Need additional assistance? Contact your Care Advisor or call the HCI-CDS program office.
          </p>
        </div>
      </Modal>
      
      <style jsx>{`
        .help-content {
          display: flex;
          min-height: 400px;
          gap: 2rem;
        }
        
        .help-navigation {
          flex: 0 0 250px;
          border-right: 1px solid #e5e7eb;
          padding-right: 1rem;
        }
        
        .help-sections-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .help-section-link {
          text-align: left;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }
        
        .help-section-link:hover {
          background-color: #f3f4f6;
        }
        
        .help-section-link.active {
          background-color: #3b82f6;
          color: white;
        }
        
        .help-section-content {
          flex: 1;
          padding-left: 1rem;
        }
        
        .help-section-content h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #1f2937;
        }
        
        .help-text {
          line-height: 1.6;
          color: #4b5563;
        }
        
        .help-text ul {
          padding-left: 1.5rem;
        }
        
        .help-text li {
          margin-bottom: 0.5rem;
        }
        
        .help-text h4 {
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .help-footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .help-contact {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .help-content {
            flex-direction: column;
          }
          
          .help-navigation {
            flex: none;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
            padding-right: 0;
            padding-bottom: 1rem;
          }
          
          .help-sections-list {
            flex-direction: row;
            overflow-x: auto;
            gap: 0.25rem;
          }
          
          .help-section-link {
            white-space: nowrap;
            flex-shrink: 0;
          }
          
          .help-section-content {
            padding-left: 0;
            padding-top: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export default HelpSystem;