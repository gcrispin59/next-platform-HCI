import { useState, useEffect } from 'react';
import { FormGenerator } from './FormGenerator';
import { FormValidation } from './FormValidation';
import { HelpSystem } from './HelpSystem';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorAlert } from '../ui/ErrorAlert';

/**
 * HCI Form Container Component
 * Main container for HCI-CDS form generation and management
 */
export function HCIFormContainer({ 
  formType, 
  userId, 
  context = {}, 
  prePopulateData = {},
  onSubmitSuccess,
  onSubmitError 
}) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflow, setWorkflow] = useState(null);

  useEffect(() => {
    initializeForm();
  }, [formType, userId]);

  const initializeForm = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize multi-agent orchestration
      const orchestrationResponse = await fetch('/api/multi-agent-orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          intent: getIntentFromFormType(formType),
          context,
          action: 'orchestrate'
        })
      });

      if (!orchestrationResponse.ok) {
        throw new Error('Failed to initialize workflow');
      }

      const orchestrationData = await orchestrationResponse.json();
      setWorkflow(orchestrationData.data);

      // Generate the form
      const formResponse = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType,
          context: {
            ...context,
            workflow: orchestrationData.data.workflow
          },
          prePopulateData,
          userRole: context.userRole || 'participant'
        })
      });

      if (!formResponse.ok) {
        throw new Error('Failed to generate form');
      }

      const formResult = await formResponse.json();
      setFormData(formResult.form);
    } catch (err) {
      console.error('Form initialization error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (submissionData) => {
    try {
      setIsSubmitting(true);
      setValidationErrors({});

      // Validate form data
      const validationResponse = await fetch('/api/forms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: submissionData,
          formType
        })
      });

      const validationResult = await validationResponse.json();
      
      if (!validationResult.validation.isValid) {
        setValidationErrors(validationResult.validation.errors);
        return;
      }

      // Submit to ARMS
      const submissionResponse = await fetch('/api/arms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          formData: submissionData,
          submissionType: formType
        })
      });

      if (!submissionResponse.ok) {
        throw new Error('Submission failed');
      }

      const submissionResult = await submissionResponse.json();
      
      if (onSubmitSuccess) {
        onSubmitSuccess(submissionResult);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      if (onSubmitError) {
        onSubmitError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (draftData) => {
    try {
      const response = await fetch('/api/forms/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: draftData,
          formType,
          userId
        })
      });

      if (response.ok) {
        // Show success message
        console.log('Draft saved successfully');
      }
    } catch (err) {
      console.error('Draft save error:', err);
    }
  };

  const getIntentFromFormType = (type) => {
    const intentMap = {
      'participant_enrollment': 'participant_onboarding',
      'care_plan': 'participant_onboarding',
      'fms_authorization': 'fms_vendor_setup',
      'care_advisor_certification': 'care_advisor_certification'
    };
    return intentMap[type] || 'participant_onboarding';
  };

  if (loading) {
    return (
      <div className="hci-form-container">
        <LoadingSpinner message="Initializing form..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="hci-form-container">
        <ErrorAlert 
          title="Form Initialization Error"
          message={error}
          onRetry={initializeForm}
        />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="hci-form-container">
        <ErrorAlert 
          title="Form Not Available"
          message="Unable to load form data"
          onRetry={initializeForm}
        />
      </div>
    );
  }

  return (
    <div className="hci-form-container">
      {workflow && (
        <div className="workflow-header">
          <h1>{workflow.workflow.name}</h1>
          <p className="workflow-description">
            Estimated time: {workflow.workflow.estimatedTime}
          </p>
          {workflow.guidance && (
            <div className="ai-guidance">
              <h3>AI Assistant Guidance:</h3>
              <p>{workflow.guidance.response || JSON.stringify(workflow.guidance, null, 2)}</p>
            </div>
          )}
        </div>
      )}
      
      <FormGenerator 
        formData={formData}
        validationErrors={validationErrors}
        onSubmit={handleFormSubmit}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
      />
      
      <HelpSystem 
        formType={formType}
        helpContent={formData.helpContent}
      />
    </div>
  );
}

export default HCIFormContainer;