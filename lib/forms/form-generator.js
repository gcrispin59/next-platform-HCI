import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';
import { ValidationEngine } from './validation-engine.js';
import { HelpSystem } from '../help/help-system.js';

/**
 * Dynamic Form Generation System
 * Creates accessible, compliant forms based on HCI policies and user context
 */
export class FormGenerator {
  static async create(formSpec) {
    try {
      const { formType, context, prePopulateData, userRole } = formSpec;
      
      const formTemplate = await this.getFormTemplate(formType);
      const dynamicFields = await this.generateDynamicFields(context, userRole);
      const validationRules = await this.buildValidationRules(formType);
      const helpContent = await HelpSystem.getFormHelp(formType);

      return {
        formId: this.generateFormId(formType),
        html: this.buildFormHTML(formTemplate, dynamicFields, prePopulateData),
        validation: validationRules,
        submission: this.buildSubmissionHandler(formType),
        helpContent: helpContent,
        metadata: {
          formType,
          generatedAt: new Date().toISOString(),
          context,
          version: '1.0.0'
        }
      };
    } catch (error) {
      console.error('Form generation error:', error);
      throw new Error(`Form generation failed: ${error.message}`);
    }
  }

  static async getFormTemplate(formType) {
    const templates = {
      'participant_enrollment': {
        title: 'HCI-CDS Participant Enrollment',
        sections: [
          {
            id: 'personal_information',
            title: 'Personal Information',
            fields: [
              { name: 'firstName', type: 'text', required: true, label: 'First Name' },
              { name: 'lastName', type: 'text', required: true, label: 'Last Name' },
              { name: 'middleName', type: 'text', required: false, label: 'Middle Name' },
              { name: 'ssn', type: 'ssn', required: true, label: 'Social Security Number' },
              { name: 'dob', type: 'date', required: true, label: 'Date of Birth' },
              { name: 'gender', type: 'select', required: true, label: 'Gender', options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
            ]
          },
          {
            id: 'contact_information',
            title: 'Contact Information',
            fields: [
              { name: 'primaryPhone', type: 'tel', required: true, label: 'Primary Phone' },
              { name: 'secondaryPhone', type: 'tel', required: false, label: 'Secondary Phone' },
              { name: 'email', type: 'email', required: false, label: 'Email Address' },
              { name: 'preferredContact', type: 'radio', required: true, label: 'Preferred Contact Method', options: ['Phone', 'Email', 'Mail'] }
            ]
          },
          {
            id: 'address_information',
            title: 'Address Information',
            fields: [
              { name: 'streetAddress', type: 'text', required: true, label: 'Street Address' },
              { name: 'city', type: 'text', required: true, label: 'City' },
              { name: 'state', type: 'select', required: true, label: 'State', options: ['NC'], default: 'NC' },
              { name: 'zipCode', type: 'text', required: true, label: 'ZIP Code', pattern: '^\\d{5}(-\\d{4})?$' }
            ]
          },
          {
            id: 'eligibility_criteria',
            title: 'Eligibility Information',
            fields: [
              { name: 'medicaidNumber', type: 'text', required: true, label: 'Medicaid Number' },
              { name: 'primaryDiagnosis', type: 'text', required: true, label: 'Primary Diagnosis' },
              { name: 'careLevel', type: 'select', required: true, label: 'Care Level', options: ['Level 1', 'Level 2', 'Level 3'] },
              { name: 'hasRepresentative', type: 'radio', required: true, label: 'Do you have a legal representative?', options: ['Yes', 'No'] }
            ]
          }
        ],
        requiredFields: ['firstName', 'lastName', 'ssn', 'dob', 'primaryPhone', 'streetAddress', 'city', 'zipCode', 'medicaidNumber'],
        dependencies: ['DA-101', 'self_assessment']
      },
      
      'care_plan': {
        title: 'HCI-CDS Care Plan',
        sections: [
          {
            id: 'participant_info',
            title: 'Participant Information',
            fields: [
              { name: 'participantId', type: 'text', required: true, label: 'Participant ID', readonly: true },
              { name: 'planEffectiveDate', type: 'date', required: true, label: 'Plan Effective Date' },
              { name: 'careAdvisor', type: 'text', required: true, label: 'Assigned Care Advisor' }
            ]
          },
          {
            id: 'care_goals',
            title: 'Care Goals and Objectives',
            fields: [
              { name: 'primaryGoal', type: 'textarea', required: true, label: 'Primary Care Goal' },
              { name: 'secondaryGoals', type: 'textarea', required: false, label: 'Secondary Goals' },
              { name: 'goalTimeframe', type: 'select', required: true, label: 'Goal Timeframe', options: ['3 months', '6 months', '12 months'] }
            ]
          },
          {
            id: 'service_schedule',
            title: 'Service Schedule',
            fields: [
              { name: 'weeklyHours', type: 'number', required: true, label: 'Weekly Service Hours', min: 1, max: 40 },
              { name: 'preferredDays', type: 'checkbox', required: true, label: 'Preferred Service Days', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
              { name: 'preferredTime', type: 'select', required: true, label: 'Preferred Time', options: ['Morning', 'Afternoon', 'Evening', 'Flexible'] }
            ]
          },
          {
            id: 'budget_allocation',
            title: 'Budget Information',
            fields: [
              { name: 'monthlyBudget', type: 'currency', required: true, label: 'Monthly Budget Allocation' },
              { name: 'budgetCategories', type: 'checkbox', required: true, label: 'Budget Categories', options: ['Personal Care', 'Homemaker', 'Transportation', 'Respite Care', 'Equipment'] }
            ]
          }
        ],
        requiredFields: ['participantId', 'planEffectiveDate', 'careAdvisor', 'primaryGoal', 'weeklyHours', 'monthlyBudget'],
        dependencies: ['participant_enrollment', 'needs_assessment']
      },

      'fms_authorization': {
        title: 'FMS Provider Authorization',
        sections: [
          {
            id: 'participant_details',
            title: 'Participant Information',
            fields: [
              { name: 'participantId', type: 'text', required: true, label: 'Participant ID', readonly: true },
              { name: 'participantName', type: 'text', required: true, label: 'Participant Name', readonly: true }
            ]
          },
          {
            id: 'pa_information',
            title: 'Personal Assistant Information',
            fields: [
              { name: 'paFirstName', type: 'text', required: true, label: 'PA First Name' },
              { name: 'paLastName', type: 'text', required: true, label: 'PA Last Name' },
              { name: 'paSSN', type: 'ssn', required: true, label: 'PA Social Security Number' },
              { name: 'paAddress', type: 'text', required: true, label: 'PA Address' },
              { name: 'paPhone', type: 'tel', required: true, label: 'PA Phone Number' }
            ]
          },
          {
            id: 'service_details',
            title: 'Service Authorization Details',
            fields: [
              { name: 'serviceHours', type: 'number', required: true, label: 'Authorized Hours per Week', min: 1, max: 40 },
              { name: 'hourlyRate', type: 'currency', required: true, label: 'Hourly Rate' },
              { name: 'startDate', type: 'date', required: true, label: 'Service Start Date' },
              { name: 'endDate', type: 'date', required: true, label: 'Service End Date' }
            ]
          }
        ],
        requiredFields: ['participantId', 'paFirstName', 'paLastName', 'paSSN', 'serviceHours', 'hourlyRate', 'startDate'],
        dependencies: ['care_plan', 'pa_background_check']
      }
    };

    return templates[formType] || templates['participant_enrollment'];
  }

  static async generateDynamicFields(context, userRole) {
    const dynamicFields = [];

    // Add role-specific fields
    if (userRole === 'care_advisor') {
      dynamicFields.push({
        name: 'advisorNotes',
        type: 'textarea',
        label: 'Care Advisor Notes',
        required: false
      });
    }

    // Add context-specific fields
    if (context?.hasEmergencyContact) {
      dynamicFields.push({
        name: 'emergencyContactName',
        type: 'text',
        label: 'Emergency Contact Name',
        required: true
      },
      {
        name: 'emergencyContactPhone',
        type: 'tel',
        label: 'Emergency Contact Phone',
        required: true
      });
    }

    return dynamicFields;
  }

  static async buildValidationRules(formType) {
    const commonRules = {
      ssn: {
        pattern: '^\\d{3}-\\d{2}-\\d{4}$',
        message: 'Please enter SSN in format: XXX-XX-XXXX'
      },
      phone: {
        pattern: '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$',
        message: 'Please enter a valid phone number'
      },
      email: {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Please enter a valid email address'
      },
      zipCode: {
        pattern: '^\\d{5}(-\\d{4})?$',
        message: 'Please enter a valid ZIP code'
      }
    };

    const formSpecificRules = {
      'participant_enrollment': {
        medicaidNumber: {
          minLength: 8,
          maxLength: 12,
          message: 'Medicaid number must be 8-12 characters'
        },
        dob: {
          custom: 'validateAge',
          message: 'Participant must be 18 or older'
        }
      },
      'care_plan': {
        monthlyBudget: {
          min: 100,
          max: 5000,
          message: 'Monthly budget must be between $100 and $5,000'
        },
        weeklyHours: {
          min: 1,
          max: 40,
          message: 'Weekly hours must be between 1 and 40'
        }
      },
      'fms_authorization': {
        hourlyRate: {
          min: 15,
          max: 50,
          message: 'Hourly rate must be between $15 and $50'
        }
      }
    };

    return {
      common: commonRules,
      specific: formSpecificRules[formType] || {}
    };
  }

  static buildFormHTML(template, dynamicFields, prePopulateData = {}) {
    const formId = this.generateFormId(template.title);
    
    return `
<form id="${formId}" class="hci-dynamic-form" novalidate aria-label="${template.title}">
  <div class="form-header">
    <h2 class="form-title">${template.title}</h2>
    <div class="form-actions-header">
      <button type="button" class="help-toggle btn btn-outline" data-help-topic="${template.title}" aria-label="Show form help">
        <span class="icon">📖</span> Help
      </button>
      <button type="button" class="save-draft btn btn-outline" onclick="saveDraft('${formId}')" aria-label="Save current progress">
        <span class="icon">💾</span> Save Draft
      </button>
    </div>
  </div>
  
  <div class="form-progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-fill"></div>
    </div>
    <span class="progress-text">0% Complete</span>
  </div>
  
  ${template.sections.map((section, index) => 
    this.buildSectionHTML(section, dynamicFields, prePopulateData, index)
  ).join('')}
  
  ${dynamicFields.length > 0 ? `
  <fieldset class="form-section dynamic-fields">
    <legend class="section-title">Additional Information</legend>
    <div class="fields-container">
      ${dynamicFields.map(field => this.buildFieldHTML(field, prePopulateData)).join('')}
    </div>
  </fieldset>
  ` : ''}
  
  <div class="form-actions">
    <div class="validation-summary" id="validation-summary" role="alert" aria-live="polite" style="display: none;">
      <h3>Please correct the following errors:</h3>
      <ul id="validation-errors"></ul>
    </div>
    
    <div class="button-group">
      <button type="button" class="btn btn-secondary" onclick="saveDraft('${formId}')">
        Save Draft
      </button>
      <button type="button" class="btn btn-primary" onclick="validateAndSubmit('${formId}')">
        Submit to ARMS
      </button>
    </div>
  </div>
</form>

<style>
.hci-dynamic-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
}

.form-title {
  margin: 0;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
}

.form-actions-header {
  display: flex;
  gap: 1rem;
}

.form-progress {
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  width: 0%;
  transition: width 0.3s ease;
}

.progress-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.form-section {
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
}

.section-title {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
}

.fields-container {
  display: grid;
  gap: 1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.required::after {
  content: " *";
  color: #dc2626;
}

.field-input {
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.field-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input.error {
  border-color: #dc2626;
}

.field-error {
  margin-top: 0.25rem;
  color: #dc2626;
  font-size: 0.875rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid transparent;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-outline {
  background-color: transparent;
  border-color: #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f9fafb;
}

.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.validation-summary {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.validation-summary h3 {
  margin: 0 0 0.5rem 0;
  color: #dc2626;
  font-size: 1rem;
}

.validation-summary ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #dc2626;
}

@media (max-width: 640px) {
  .hci-dynamic-form {
    padding: 1rem;
  }
  
  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .form-actions-header {
    width: 100%;
    justify-content: flex-end;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>`;
  }

  static buildSectionHTML(section, dynamicFields, prePopulateData, sectionIndex) {
    return `
<fieldset class="form-section" data-section="${section.id}">
  <legend class="section-title">${section.title}</legend>
  <div class="fields-container">
    ${section.fields.map(field => this.buildFieldHTML(field, prePopulateData)).join('')}
  </div>
</fieldset>`;
  }

  static buildFieldHTML(field, prePopulateData) {
    const value = prePopulateData[field.name] || field.default || '';
    const required = field.required ? 'required' : '';
    const readonly = field.readonly ? 'readonly' : '';
    const fieldId = `field-${field.name}`;
    
    let fieldHtml = '';
    
    switch (field.type) {
      case 'textarea':
        fieldHtml = `<textarea id="${fieldId}" name="${field.name}" class="field-input" ${required} ${readonly} aria-describedby="${fieldId}-error">${value}</textarea>`;
        break;
      case 'select':
        fieldHtml = `
<select id="${fieldId}" name="${field.name}" class="field-input" ${required} ${readonly} aria-describedby="${fieldId}-error">
  <option value="">Please select...</option>
  ${field.options.map(option => 
    `<option value="${option}" ${value === option ? 'selected' : ''}>${option}</option>`
  ).join('')}
</select>`;
        break;
      case 'radio':
        fieldHtml = `
<div class="radio-group" role="radiogroup" aria-labelledby="${fieldId}-label">
  ${field.options.map((option, index) => `
  <label class="radio-option">
    <input type="radio" name="${field.name}" value="${option}" ${value === option ? 'checked' : ''} ${required}>
    <span>${option}</span>
  </label>
  `).join('')}
</div>`;
        break;
      case 'checkbox':
        fieldHtml = `
<div class="checkbox-group" role="group" aria-labelledby="${fieldId}-label">
  ${field.options.map(option => `
  <label class="checkbox-option">
    <input type="checkbox" name="${field.name}[]" value="${option}" ${(Array.isArray(value) && value.includes(option)) ? 'checked' : ''}>
    <span>${option}</span>
  </label>
  `).join('')}
</div>`;
        break;
      default:
        const pattern = field.pattern ? `pattern="${field.pattern}"` : '';
        const min = field.min !== undefined ? `min="${field.min}"` : '';
        const max = field.max !== undefined ? `max="${field.max}"` : '';
        fieldHtml = `<input type="${field.type}" id="${fieldId}" name="${field.name}" class="field-input" value="${value}" ${required} ${readonly} ${pattern} ${min} ${max} aria-describedby="${fieldId}-error">`;
    }
    
    return `
<div class="field-group">
  <label for="${fieldId}" id="${fieldId}-label" class="field-label ${field.required ? 'required' : ''}">${field.label}</label>
  ${fieldHtml}
  <div id="${fieldId}-error" class="field-error" role="alert" style="display: none;"></div>
</div>`;
  }

  static buildSubmissionHandler(formType) {
    return {
      endpoint: `/api/forms/submit`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      onSuccess: (response) => {
        console.log('Form submitted successfully:', response);
        // Redirect or show success message
      },
      onError: (error) => {
        console.error('Form submission error:', error);
        // Show error message
      }
    };
  }

  static generateFormId(formTitle) {
    return `hci-form-${formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
  }

  static getFormTitle(formType) {
    const titles = {
      'participant_enrollment': 'HCI-CDS Participant Enrollment',
      'care_plan': 'HCI-CDS Care Plan',
      'fms_authorization': 'FMS Provider Authorization',
      'care_advisor_certification': 'Care Advisor Certification'
    };
    
    return titles[formType] || 'HCI-CDS Form';
  }
}