import { useState, useEffect } from 'react';
import { FormField } from './FormField';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';

/**
 * Dynamic Form Generator Component
 * Renders forms based on generated HTML and handles interactions
 */
export function FormGenerator({ 
  formData, 
  validationErrors = {}, 
  onSubmit, 
  onSaveDraft, 
  isSubmitting = false 
}) {
  const [formValues, setFormValues] = useState({});
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Parse the generated HTML to extract form structure
    if (formData && formData.html) {
      initializeFormFromHTML();
    }
  }, [formData]);

  useEffect(() => {
    updateProgress();
  }, [formValues]);

  const initializeFormFromHTML = () => {
    try {
      // Create a temporary DOM element to parse the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.html;
      
      // Extract form fields and initialize values
      const fields = tempDiv.querySelectorAll('.field-input');
      const initialValues = {};
      
      fields.forEach(field => {
        initialValues[field.name] = field.value || '';
      });
      
      setFormValues(initialValues);
    } catch (error) {
      console.error('Form initialization error:', error);
    }
  };

  const updateProgress = () => {
    const totalFields = Object.keys(formValues).length;
    const completedFields = Object.values(formValues).filter(value => 
      value !== null && value !== undefined && value.toString().trim() !== ''
    ).length;
    
    const newProgress = totalFields > 0 ? (completedFields / totalFields) * 100 : 0;
    setProgress(newProgress);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formValues);
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formValues);
    }
  };

  if (!formData) {
    return <div>No form data available</div>;
  }

  return (
    <div className="form-generator">
      <div className="form-header">
        <h2>{formData.metadata?.formType?.replace('_', ' ').toUpperCase() || 'HCI Form'}</h2>
        <ProgressBar 
          progress={progress} 
          label={`${Math.round(progress)}% Complete`}
        />
      </div>
      
      <form onSubmit={handleSubmit} className="hci-generated-form">
        {/* Render the generated HTML */}
        <div 
          dangerouslySetInnerHTML={{ __html: formData.html }}
          className="form-content"
        />
        
        {/* Custom form interactions overlay */}
        <FormInteractions 
          formValues={formValues}
          validationErrors={validationErrors}
          onFieldChange={handleFieldChange}
          formStructure={formData.validation}
        />
        
        <div className="form-actions">
          {Object.keys(validationErrors).length > 0 && (
            <div className="validation-summary" role="alert">
              <h3>Please correct the following errors:</h3>
              <ul>
                {Object.entries(validationErrors).map(([field, errors]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="button-group">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleSaveDraft}
              disabled={isSubmitting}
            >
              Save Draft
            </Button>
            
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit to ARMS'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

/**
 * Form Interactions Component
 * Overlays interactive behavior on generated HTML
 */
function FormInteractions({ formValues, validationErrors, onFieldChange, formStructure }) {
  useEffect(() => {
    // Attach event listeners to form fields
    const attachFieldListeners = () => {
      const fields = document.querySelectorAll('.field-input');
      
      fields.forEach(field => {
        const handleChange = (e) => {
          let value = e.target.value;
          
          // Handle different input types
          if (e.target.type === 'checkbox') {
            const checkboxes = document.querySelectorAll(`[name="${e.target.name}"]`);
            value = Array.from(checkboxes)
              .filter(cb => cb.checked)
              .map(cb => cb.value);
          } else if (e.target.type === 'radio') {
            value = e.target.value;
          }
          
          onFieldChange(e.target.name, value);
        };
        
        field.addEventListener('input', handleChange);
        field.addEventListener('change', handleChange);
      });
    };
    
    // Use setTimeout to ensure DOM is ready
    setTimeout(attachFieldListeners, 100);
    
    return () => {
      // Cleanup event listeners
      const fields = document.querySelectorAll('.field-input');
      fields.forEach(field => {
        field.removeEventListener('input', () => {});
        field.removeEventListener('change', () => {});
      });
    };
  }, [formValues, onFieldChange]);

  // Apply validation errors to fields
  useEffect(() => {
    Object.entries(validationErrors).forEach(([fieldName, errors]) => {
      const field = document.querySelector(`[name="${fieldName}"]`);
      const errorElement = document.getElementById(`field-${fieldName}-error`);
      
      if (field) {
        field.classList.add('error');
      }
      
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.textContent = Array.isArray(errors) ? errors[0] : errors;
      }
    });
    
    // Clear errors for fields that are now valid
    Object.keys(formValues).forEach(fieldName => {
      if (!validationErrors[fieldName]) {
        const field = document.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`field-${fieldName}-error`);
        
        if (field) {
          field.classList.remove('error');
        }
        
        if (errorElement) {
          errorElement.style.display = 'none';
          errorElement.textContent = '';
        }
      }
    });
  }, [validationErrors, formValues]);

  return null; // This component only adds behavior, no visual output
}

export default FormGenerator;