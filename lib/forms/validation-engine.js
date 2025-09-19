/**
 * Form Validation Engine
 * Handles client and server-side validation for HCI-CDS forms
 */
export class ValidationEngine {
  static async validate(formData, formType, validationRules) {
    try {
      const results = {
        isValid: true,
        errors: {},
        warnings: [],
        summary: {
          totalFields: Object.keys(formData).length,
          validFields: 0,
          invalidFields: 0
        }
      };

      // Run field-level validations
      for (const [fieldName, value] of Object.entries(formData)) {
        const fieldValidation = await this.validateField(fieldName, value, validationRules);
        
        if (!fieldValidation.isValid) {
          results.isValid = false;
          results.errors[fieldName] = fieldValidation.errors;
          results.summary.invalidFields++;
        } else {
          results.summary.validFields++;
        }

        if (fieldValidation.warnings.length > 0) {
          results.warnings.push(...fieldValidation.warnings);
        }
      }

      // Run form-level validations
      const formLevelValidation = await this.validateFormLevel(formData, formType);
      if (!formLevelValidation.isValid) {
        results.isValid = false;
        results.errors._form = formLevelValidation.errors;
      }

      // Run business rule validations
      const businessRuleValidation = await this.validateBusinessRules(formData, formType);
      if (!businessRuleValidation.isValid) {
        results.isValid = false;
        results.errors._business = businessRuleValidation.errors;
      }

      return results;
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        errors: { _system: ['Validation system error. Please try again.'] },
        warnings: [],
        summary: { totalFields: 0, validFields: 0, invalidFields: 0 }
      };
    }
  }

  static async validateField(fieldName, value, validationRules) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const rules = {
      ...validationRules.common,
      ...validationRules.specific
    };

    const fieldRule = rules[fieldName];
    if (!fieldRule) {
      return result; // No validation rules for this field
    }

    // Required field validation
    if (fieldRule.required && (!value || value.toString().trim() === '')) {
      result.isValid = false;
      result.errors.push('This field is required.');
      return result;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.toString().trim() === '') {
      return result;
    }

    // Pattern validation
    if (fieldRule.pattern) {
      const regex = new RegExp(fieldRule.pattern);
      if (!regex.test(value)) {
        result.isValid = false;
        result.errors.push(fieldRule.message || 'Invalid format.');
      }
    }

    // Length validations
    if (fieldRule.minLength && value.length < fieldRule.minLength) {
      result.isValid = false;
      result.errors.push(`Must be at least ${fieldRule.minLength} characters.`);
    }

    if (fieldRule.maxLength && value.length > fieldRule.maxLength) {
      result.isValid = false;
      result.errors.push(`Must be no more than ${fieldRule.maxLength} characters.`);
    }

    // Numeric validations
    if (fieldRule.min !== undefined) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < fieldRule.min) {
        result.isValid = false;
        result.errors.push(`Must be at least ${fieldRule.min}.`);
      }
    }

    if (fieldRule.max !== undefined) {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue > fieldRule.max) {
        result.isValid = false;
        result.errors.push(`Must be no more than ${fieldRule.max}.`);
      }
    }

    // Custom validations
    if (fieldRule.custom) {
      const customResult = await this.runCustomValidation(fieldRule.custom, fieldName, value);
      if (!customResult.isValid) {
        result.isValid = false;
        result.errors.push(...customResult.errors);
      }
      result.warnings.push(...customResult.warnings);
    }

    return result;
  }

  static async validateFormLevel(formData, formType) {
    const result = {
      isValid: true,
      errors: []
    };

    switch (formType) {
      case 'participant_enrollment':
        return await this.validateParticipantEnrollment(formData);
      case 'care_plan':
        return await this.validateCarePlan(formData);
      case 'fms_authorization':
        return await this.validateFMSAuthorization(formData);
      default:
        return result;
    }
  }

  static async validateParticipantEnrollment(formData) {
    const result = { isValid: true, errors: [] };

    // Age validation
    if (formData.dob) {
      const age = this.calculateAge(formData.dob);
      if (age < 18) {
        result.isValid = false;
        result.errors.push('Participant must be at least 18 years old.');
      }
      if (age > 120) {
        result.isValid = false;
        result.errors.push('Please verify the date of birth.');
      }
    }

    // Address validation
    if (formData.state && formData.state !== 'NC') {
      result.isValid = false;
      result.errors.push('HCI-CDS program is only available to North Carolina residents.');
    }

    return result;
  }

  static async validateCarePlan(formData) {
    const result = { isValid: true, errors: [] };

    // Date validations
    if (formData.planEffectiveDate) {
      const effectiveDate = new Date(formData.planEffectiveDate);
      const today = new Date();
      const futureLimit = new Date();
      futureLimit.setMonth(futureLimit.getMonth() + 6);

      if (effectiveDate < today) {
        result.isValid = false;
        result.errors.push('Plan effective date cannot be in the past.');
      }

      if (effectiveDate > futureLimit) {
        result.isValid = false;
        result.errors.push('Plan effective date cannot be more than 6 months in the future.');
      }
    }

    // Budget validation
    if (formData.weeklyHours && formData.monthlyBudget) {
      const weeklyHours = parseFloat(formData.weeklyHours);
      const monthlyBudget = parseFloat(formData.monthlyBudget);
      const assumedHourlyRate = 20; // NC average
      const estimatedMonthlyCost = weeklyHours * 4.33 * assumedHourlyRate;

      if (monthlyBudget < estimatedMonthlyCost * 0.8) {
        result.isValid = false;
        result.errors.push(`Monthly budget may be insufficient for ${weeklyHours} weekly hours. Estimated minimum: $${Math.round(estimatedMonthlyCost * 0.8)}.`);
      }
    }

    return result;
  }

  static async validateFMSAuthorization(formData) {
    const result = { isValid: true, errors: [] };

    // Date range validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        result.isValid = false;
        result.errors.push('End date must be after start date.');
      }

      const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
      if (daysDiff > 365) {
        result.isValid = false;
        result.errors.push('Authorization period cannot exceed 365 days.');
      }
    }

    // Rate validation
    if (formData.hourlyRate) {
      const rate = parseFloat(formData.hourlyRate);
      const ncMinimumWage = 15; // Assumed NC rate
      const maxRate = 50;

      if (rate < ncMinimumWage) {
        result.isValid = false;
        result.errors.push(`Hourly rate must be at least $${ncMinimumWage} (NC minimum wage).`);
      }

      if (rate > maxRate) {
        result.isValid = false;
        result.errors.push(`Hourly rate cannot exceed $${maxRate}.`);
      }
    }

    return result;
  }

  static async validateBusinessRules(formData, formType) {
    const result = { isValid: true, errors: [] };

    // HCI-CDS specific business rules
    switch (formType) {
      case 'participant_enrollment':
        // Check for duplicate SSN (would require database lookup)
        // Validate Medicaid eligibility (would require ARMS lookup)
        break;
      case 'care_plan':
        // Validate care advisor certification
        // Check budget against available funds
        break;
      case 'fms_authorization':
        // Validate PA background check status
        // Check against existing authorizations
        break;
    }

    return result;
  }

  static async runCustomValidation(validationType, fieldName, value) {
    const result = {
      isValid: true,
      errors: [],
      warnings: []
    };

    switch (validationType) {
      case 'validateAge':
        const age = this.calculateAge(value);
        if (age < 18) {
          result.isValid = false;
          result.errors.push('Must be 18 years or older.');
        } else if (age > 100) {
          result.warnings.push('Please verify this date of birth.');
        }
        break;

      case 'validateSSN':
        if (!this.isValidSSN(value)) {
          result.isValid = false;
          result.errors.push('Please enter a valid Social Security Number.');
        }
        break;

      case 'validateMedicaidNumber':
        if (!this.isValidMedicaidNumber(value)) {
          result.isValid = false;
          result.errors.push('Please enter a valid Medicaid number.');
        }
        break;

      default:
        console.warn(`Unknown custom validation: ${validationType}`);
    }

    return result;
  }

  static calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  static isValidSSN(ssn) {
    // Remove any formatting
    const cleanSSN = ssn.replace(/\D/g, '');
    
    // Check length
    if (cleanSSN.length !== 9) return false;
    
    // Check for invalid patterns
    const invalidPatterns = [
      '000000000', '111111111', '222222222', '333333333',
      '444444444', '555555555', '666666666', '777777777',
      '888888888', '999999999', '123456789'
    ];
    
    return !invalidPatterns.includes(cleanSSN);
  }

  static isValidMedicaidNumber(medicaidNumber) {
    // NC Medicaid number format validation
    const cleanNumber = medicaidNumber.replace(/\D/g, '');
    return cleanNumber.length >= 8 && cleanNumber.length <= 12;
  }

  // Client-side validation helpers
  static attachClientValidation(formId) {
    return `
<script>
(function() {
  const form = document.getElementById('${formId}');
  if (!form) return;

  const validationEngine = {
    validateForm: function() {
      const formData = new FormData(form);
      const errors = {};
      let isValid = true;

      // Clear previous errors
      form.querySelectorAll('.field-error').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
      });
      form.querySelectorAll('.field-input').forEach(el => {
        el.classList.remove('error');
      });

      // Validate each field
      for (const [name, value] of formData.entries()) {
        const fieldError = this.validateField(name, value);
        if (fieldError) {
          errors[name] = fieldError;
          isValid = false;
        }
      }

      // Display errors
      for (const [fieldName, errorMessage] of Object.entries(errors)) {
        const field = form.querySelector('[name="' + fieldName + '"]');
        const errorElement = document.getElementById('field-' + fieldName + '-error');
        
        if (field && errorElement) {
          field.classList.add('error');
          errorElement.textContent = errorMessage;
          errorElement.style.display = 'block';
        }
      }

      // Update validation summary
      const summary = document.getElementById('validation-summary');
      const errorsList = document.getElementById('validation-errors');
      
      if (!isValid && summary && errorsList) {
        errorsList.innerHTML = Object.values(errors)
          .map(error => '<li>' + error + '</li>')
          .join('');
        summary.style.display = 'block';
        summary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (summary) {
        summary.style.display = 'none';
      }

      return isValid;
    },

    validateField: function(name, value) {
      // Add client-side validation logic here
      const field = form.querySelector('[name="' + name + '"]');
      if (!field) return null;

      if (field.required && (!value || value.trim() === '')) {
        return 'This field is required.';
      }

      if (field.pattern && value) {
        const regex = new RegExp(field.pattern);
        if (!regex.test(value)) {
          return field.getAttribute('title') || 'Invalid format.';
        }
      }

      return null;
    }
  };

  // Attach event listeners
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validationEngine.validateForm()) {
      // Submit form
      console.log('Form is valid, submitting...');
    }
  });

  // Real-time validation
  form.addEventListener('blur', function(e) {
    if (e.target.classList.contains('field-input')) {
      const error = validationEngine.validateField(e.target.name, e.target.value);
      const errorElement = document.getElementById('field-' + e.target.name + '-error');
      
      if (error && errorElement) {
        e.target.classList.add('error');
        errorElement.textContent = error;
        errorElement.style.display = 'block';
      } else if (errorElement) {
        e.target.classList.remove('error');
        errorElement.style.display = 'none';
      }
    }
  }, true);

  // Progress tracking
  function updateProgress() {
    const fields = form.querySelectorAll('.field-input[required]');
    const completedFields = Array.from(fields).filter(field => {
      return field.value && field.value.trim() !== '';
    });
    
    const progress = (completedFields.length / fields.length) * 100;
    const progressBar = form.querySelector('.progress-fill');
    const progressText = form.querySelector('.progress-text');
    
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = Math.round(progress) + '% Complete';
  }

  form.addEventListener('input', updateProgress);
  updateProgress(); // Initial calculation
})();
</script>`;
  }
}

// Global validation functions for client-side use
if (typeof window !== 'undefined') {
  window.validateAndSubmit = async function(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/forms/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: data, formType: form.dataset.formType })
      });

      const validation = await response.json();
      
      if (validation.isValid) {
        // Submit to ARMS
        await submitToARMS(formId);
      } else {
        // Display validation errors
        displayValidationErrors(validation.errors);
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert('Validation failed. Please try again.');
    }
  };

  window.saveDraft = async function(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/forms/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData: data, formType: form.dataset.formType })
      });

      if (response.ok) {
        alert('Draft saved successfully!');
      } else {
        alert('Failed to save draft. Please try again.');
      }
    } catch (error) {
      console.error('Save draft error:', error);
      alert('Failed to save draft. Please try again.');
    }
  };
}