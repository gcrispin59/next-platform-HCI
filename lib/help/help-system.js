/**
 * Contextual Help System
 * Provides form-specific help content extracted from HCI manual
 */
export class HelpSystem {
  static helpContent = {
    'participant_enrollment': {
      title: 'Participant Enrollment Help',
      sections: [
        {
          id: 'eligibility_overview',
          title: 'Eligibility Requirements',
          content: `
            <h3>Who is eligible for HCI-CDS?</h3>
            <ul>
              <li>Must be 18 years of age or older</li>
              <li>Must be eligible for Medicaid</li>
              <li>Must meet functional eligibility criteria</li>
              <li>Must be a North Carolina resident</li>
              <li>Must choose to receive services in home and community-based settings</li>
            </ul>
            
            <h4>Functional Eligibility</h4>
            <p>Participants must require the level of care typically provided in a nursing facility, as determined by the NC-DAS (North Carolina Developmental Assessment Scale) or other approved assessment tool.</p>
          `
        },
        {
          id: 'required_documents',
          title: 'Required Documentation',
          content: `
            <h3>Documents You'll Need</h3>
            <ul>
              <li><strong>DA-101 Form:</strong> Request for Determination of Medical Eligibility</li>
              <li><strong>Photo ID:</strong> Driver's license or state ID</li>
              <li><strong>Social Security Card</strong></li>
              <li><strong>Medicaid Card</strong></li>
              <li><strong>Medical Records:</strong> Supporting your need for long-term care</li>
              <li><strong>Representative Information:</strong> If you have a legal guardian or representative</li>
            </ul>
          `
        },
        {
          id: 'personal_information_help',
          title: 'Personal Information Guidelines',
          content: `
            <h3>Completing Personal Information</h3>
            <p><strong>Social Security Number:</strong> Enter in format XXX-XX-XXXX</p>
            <p><strong>Date of Birth:</strong> Must be 18 years or older to qualify</p>
            <p><strong>Address:</strong> Must be a North Carolina address where you currently reside</p>
            <p><strong>Phone Number:</strong> Primary contact number where you can be reached</p>
            
            <div class="help-note">
              <strong>Privacy Note:</strong> All personal information is protected under HIPAA and state privacy laws.
            </div>
          `
        }
      ]
    },
    
    'care_plan': {
      title: 'Care Plan Development Help',
      sections: [
        {
          id: 'care_goals',
          title: 'Setting Care Goals',
          content: `
            <h3>Developing Effective Care Goals</h3>
            <p>Care goals should be:</p>
            <ul>
              <li><strong>Specific:</strong> Clearly defined outcomes</li>
              <li><strong>Measurable:</strong> Progress can be tracked</li>
              <li><strong>Achievable:</strong> Realistic given your circumstances</li>
              <li><strong>Relevant:</strong> Important to your quality of life</li>
              <li><strong>Time-bound:</strong> Have a target timeframe</li>
            </ul>
            
            <h4>Example Goals:</h4>
            <ul>
              <li>"Maintain independence in bathing with minimal assistance"</li>
              <li>"Safely prepare simple meals 3 times per week"</li>
              <li>"Participate in community activities monthly"</li>
            </ul>
          `
        },
        {
          id: 'service_planning',
          title: 'Service Planning Guidelines',
          content: `
            <h3>Planning Your Services</h3>
            
            <h4>Service Hours</h4>
            <p>Weekly service hours are based on your assessed needs and available budget. Consider:</p>
            <ul>
              <li>Personal care needs (bathing, dressing, medication assistance)</li>
              <li>Homemaker services (cleaning, laundry, meal preparation)</li>
              <li>Transportation needs</li>
              <li>Respite care for family caregivers</li>
            </ul>
            
            <h4>Service Schedule</h4>
            <p>Work with your Care Advisor to create a schedule that:</p>
            <ul>
              <li>Meets your daily routine preferences</li>
              <li>Accommodates medical appointments</li>
              <li>Provides consistency for better outcomes</li>
              <li>Allows flexibility for changing needs</li>
            </ul>
          `
        },
        {
          id: 'budget_allocation',
          title: 'Understanding Your Budget',
          content: `
            <h3>Budget Allocation Guidelines</h3>
            
            <p>Your monthly budget is determined by:</p>
            <ul>
              <li>Level of care assessment results</li>
              <li>Available Medicaid funding</li>
              <li>Service priorities identified in your care plan</li>
            </ul>
            
            <h4>Budget Categories</h4>
            <ul>
              <li><strong>Personal Care:</strong> Assistance with daily living activities</li>
              <li><strong>Homemaker:</strong> Household tasks and meal preparation</li>
              <li><strong>Transportation:</strong> Medical and essential trips</li>
              <li><strong>Respite Care:</strong> Temporary relief for family caregivers</li>
              <li><strong>Equipment/Supplies:</strong> Assistive devices and medical supplies</li>
            </ul>
          `
        }
      ]
    },
    
    'fms_authorization': {
      title: 'FMS Authorization Help',
      sections: [
        {
          id: 'fms_overview',
          title: 'Financial Management Services Overview',
          content: `
            <h3>What is FMS?</h3>
            <p>Financial Management Services (FMS) help you manage the financial aspects of your HCI-CDS services, including:</p>
            <ul>
              <li>Payroll processing for personal assistants</li>
              <li>Tax withholding and reporting</li>
              <li>Workers' compensation insurance</li>
              <li>Budget tracking and reporting</li>
              <li>Compliance with employment laws</li>
            </ul>
            
            <h4>Benefits of Using FMS</h4>
            <ul>
              <li>Professional payroll management</li>
              <li>Reduced administrative burden</li>
              <li>Compliance assurance</li>
              <li>24/7 customer support</li>
            </ul>
          `
        },
        {
          id: 'pa_requirements',
          title: 'Personal Assistant Requirements',
          content: `
            <h3>Personal Assistant Qualifications</h3>
            
            <h4>Minimum Requirements:</h4>
            <ul>
              <li>Must be at least 18 years old</li>
              <li>Pass background check</li>
              <li>Provide valid Social Security Number</li>
              <li>Be legally eligible to work in the United States</li>
              <li>Complete required training</li>
            </ul>
            
            <h4>Background Check Process:</h4>
            <ol>
              <li>Submit application with personal information</li>
              <li>Criminal background check</li>
              <li>Abuse and neglect registry check</li>
              <li>Results review (typically 5-7 business days)</li>
            </ol>
            
            <h4>Disqualifying Factors:</h4>
            <ul>
              <li>Conviction of certain felonies</li>
              <li>Listing on abuse/neglect registry</li>
              <li>Inability to provide required documentation</li>
            </ul>
          `
        },
        {
          id: 'authorization_process',
          title: 'Authorization Process',
          content: `
            <h3>FMS Authorization Steps</h3>
            
            <ol>
              <li><strong>Complete this form</strong> with accurate information</li>
              <li><strong>Submit to ARMS</strong> for processing</li>
              <li><strong>Background check</strong> initiated for personal assistant</li>
              <li><strong>Review and approval</strong> (typically 10-14 business days)</li>
              <li><strong>Setup FMS account</strong> with approved provider</li>
              <li><strong>Begin services</strong> according to care plan</li>
            </ol>
            
            <h4>Required Information:</h4>
            <ul>
              <li>Participant identification and care plan details</li>
              <li>Personal assistant complete information</li>
              <li>Service authorization details (hours, rates, dates)</li>
              <li>FMS provider selection</li>
            </ul>
            
            <h4>Processing Timeline:</h4>
            <p>Complete authorization typically takes 14-21 business days from submission to service start.</p>
          `
        }
      ]
    }
  };

  static async getFormHelp(formType) {
    return this.helpContent[formType] || {
      title: 'Help Information',
      sections: [{
        id: 'general_help',
        title: 'General Information',
        content: '<p>For assistance with this form, please contact your Care Advisor or call the HCI-CDS program office.</p>'
      }]
    };
  }

  static async getFieldHelp(formType, fieldName) {
    const fieldHelpMap = {
      'participant_enrollment': {
        'ssn': 'Enter your Social Security Number in format XXX-XX-XXXX. This information is required for Medicaid verification.',
        'medicaidNumber': 'Your Medicaid ID number can be found on your Medicaid card. It typically consists of 8-12 digits.',
        'primaryDiagnosis': 'Enter the primary medical condition that qualifies you for long-term care services.',
        'careLevel': 'Care level is determined by your functional assessment and indicates the intensity of services needed.'
      },
      'care_plan': {
        'weeklyHours': 'Based on your assessment, enter the total weekly hours of services you need. Maximum is 40 hours per week.',
        'monthlyBudget': 'Your monthly budget is determined by your care level and available Medicaid funding.',
        'primaryGoal': 'Describe your main goal for maintaining independence and quality of life.'
      },
      'fms_authorization': {
        'paSSN': 'Personal Assistant\'s Social Security Number is required for payroll processing and background check.',
        'hourlyRate': 'Hourly rate must be within NC approved range ($15-$50) and align with your budget allocation.'
      }
    };

    const formHelp = fieldHelpMap[formType] || {};
    return formHelp[fieldName] || 'No specific help available for this field.';
  }

  static initializePopupHelp() {
    if (typeof window === 'undefined') return; // Server-side skip
    
    document.addEventListener('DOMContentLoaded', () => {
      this.attachHelpEvents();
    });
  }

  static attachHelpEvents() {
    // Help button click handler
    document.addEventListener('click', (event) => {
      if (event.target.matches('.help-toggle, .help-toggle *')) {
        const button = event.target.closest('.help-toggle');
        const topic = button.dataset.helpTopic;
        this.showContextualHelp(topic);
      }
      
      // Close help overlay
      if (event.target.matches('.help-overlay, .help-close')) {
        this.closeHelpOverlay();
      }
    });

    // Field-specific help on focus
    document.addEventListener('focus', (event) => {
      if (event.target.matches('.field-input')) {
        this.showFieldTooltip(event.target);
      }
    }, true);

    document.addEventListener('blur', (event) => {
      if (event.target.matches('.field-input')) {
        this.hideFieldTooltip();
      }
    }, true);
  }

  static async showContextualHelp(formType) {
    try {
      const helpContent = await this.getFormHelp(formType);
      this.createHelpOverlay(helpContent);
    } catch (error) {
      console.error('Help system error:', error);
      this.showErrorMessage('Help content unavailable. Please contact support.');
    }
  }

  static createHelpOverlay(helpContent) {
    // Remove existing overlay
    const existing = document.getElementById('help-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'help-overlay';
    overlay.className = 'help-overlay';
    overlay.innerHTML = `
      <div class="help-content">
        <div class="help-header">
          <h2>${helpContent.title}</h2>
          <button class="help-close" aria-label="Close help">&times;</button>
        </div>
        <div class="help-body">
          ${helpContent.sections.map(section => `
            <div class="help-section">
              <h3>${section.title}</h3>
              <div class="help-section-content">${section.content}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .help-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      
      .help-content {
        background: white;
        border-radius: 8px;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      
      .help-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #e5e7eb;
        background-color: #f9fafb;
      }
      
      .help-header h2 {
        margin: 0;
        color: #1f2937;
      }
      
      .help-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }
      
      .help-close:hover {
        background-color: #e5e7eb;
      }
      
      .help-body {
        padding: 20px;
      }
      
      .help-section {
        margin-bottom: 30px;
      }
      
      .help-section h3 {
        color: #374151;
        margin-bottom: 15px;
        font-size: 1.25rem;
      }
      
      .help-section-content {
        line-height: 1.6;
        color: #4b5563;
      }
      
      .help-section-content ul, .help-section-content ol {
        padding-left: 20px;
      }
      
      .help-section-content li {
        margin-bottom: 5px;
      }
      
      .help-note {
        background-color: #fef3c7;
        border: 1px solid #f59e0b;
        border-radius: 4px;
        padding: 12px;
        margin: 15px 0;
      }
      
      @media (max-width: 640px) {
        .help-overlay {
          padding: 10px;
        }
        
        .help-content {
          max-height: 95vh;
        }
        
        .help-header {
          padding: 15px;
        }
        
        .help-body {
          padding: 15px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Focus management for accessibility
    const closeButton = overlay.querySelector('.help-close');
    closeButton.focus();

    // Escape key handler
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        this.closeHelpOverlay();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  static closeHelpOverlay() {
    const overlay = document.getElementById('help-overlay');
    if (overlay) {
      overlay.remove();
      
      // Return focus to help button
      const helpButton = document.querySelector('.help-toggle');
      if (helpButton) helpButton.focus();
    }
  }

  static async showFieldTooltip(field) {
    const formType = field.closest('form').dataset.formType;
    const fieldName = field.name;
    
    if (!formType || !fieldName) return;

    const helpText = await this.getFieldHelp(formType, fieldName);
    
    // Remove existing tooltip
    const existing = document.getElementById('field-tooltip');
    if (existing) existing.remove();

    const tooltip = document.createElement('div');
    tooltip.id = 'field-tooltip';
    tooltip.className = 'field-tooltip';
    tooltip.textContent = helpText;

    // Add tooltip styles
    const style = document.createElement('style');
    style.textContent = `
      .field-tooltip {
        position: absolute;
        background-color: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        max-width: 300px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        pointer-events: none;
      }
      
      .field-tooltip::before {
        content: '';
        position: absolute;
        top: -5px;
        left: 20px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid #1f2937;
      }
    `;
    
    if (!document.getElementById('tooltip-styles')) {
      style.id = 'tooltip-styles';
      document.head.appendChild(style);
    }

    // Position tooltip
    const rect = field.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.bottom + 5) + 'px';

    document.body.appendChild(tooltip);
  }

  static hideFieldTooltip() {
    const tooltip = document.getElementById('field-tooltip');
    if (tooltip) {
      tooltip.remove();
    }
  }

  static showErrorMessage(message) {
    alert(message); // Simple fallback - could be enhanced with toast notifications
  }
}

// Initialize help system when DOM is ready
if (typeof window !== 'undefined') {
  HelpSystem.initializePopupHelp();
}