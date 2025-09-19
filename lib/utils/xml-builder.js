import { create } from 'xmlbuilder2';
import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';

/**
 * XML Builder for ARMS Integration
 * Generates XML documents for NC ARMS system submissions
 */
export class XMLBuilder {
  static generate(options) {
    const { type, data, metadata } = options;
    
    try {
      switch (type) {
        case 'participant_enrollment':
          return this.buildParticipantEnrollmentXML(data, metadata);
        case 'care_plan':
          return this.buildCarePlanXML(data, metadata);
        case 'fms_authorization':
          return this.buildFMSAuthorizationXML(data, metadata);
        case 'service_authorization':
          return this.buildServiceAuthorizationXML(data, metadata);
        default:
          return this.buildGenericSubmissionXML(data, metadata, type);
      }
    } catch (error) {
      console.error('XML generation error:', error);
      throw new Error(`Failed to generate XML: ${error.message}`);
    }
  }

  static buildParticipantEnrollmentXML(data, metadata) {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ARMSSubmission')
        .att('xmlns', 'http://nc.gov/arms/hci-cds/v1.0')
        .att('version', '1.0')
        .att('submissionType', 'ParticipantEnrollment');

    // Submission metadata
    const header = doc.ele('SubmissionHeader')
      .ele('SubmissionId').txt(metadata.submissionId || this.generateSubmissionId()).up()
      .ele('SubmissionDate').txt(metadata.submissionDate || new Date().toISOString()).up()
      .ele('SourceSystem').txt(metadata.source || 'HCI-Forms').up()
      .ele('Version').txt(metadata.version || HCI_FORMS_CONFIG.version).up()
      .ele('SubmittingEntity').txt('HCI-CDS Program').up();

    // Participant information
    const participant = doc.ele('ParticipantInformation')
      .ele('PersonalDetails')
        .ele('FirstName').txt(data.firstName || '').up()
        .ele('LastName').txt(data.lastName || '').up()
        .ele('MiddleName').txt(data.middleName || '').up()
        .ele('SSN').txt(this.formatSSN(data.ssn)).up()
        .ele('DateOfBirth').txt(this.formatDate(data.dob)).up()
        .ele('Gender').txt(data.gender || '').up()
      .up()
      .ele('ContactInformation')
        .ele('PrimaryPhone').txt(this.formatPhone(data.primaryPhone)).up()
        .ele('SecondaryPhone').txt(this.formatPhone(data.secondaryPhone) || '').up()
        .ele('Email').txt(data.email || '').up()
        .ele('PreferredContactMethod').txt(data.preferredContact || '').up()
      .up()
      .ele('AddressInformation')
        .ele('StreetAddress').txt(data.streetAddress || '').up()
        .ele('City').txt(data.city || '').up()
        .ele('State').txt(data.state || 'NC').up()
        .ele('ZipCode').txt(data.zipCode || '').up()
      .up();

    // Eligibility information
    const eligibility = doc.ele('EligibilityInformation')
      .ele('MedicaidNumber').txt(data.medicaidNumber || '').up()
      .ele('PrimaryDiagnosis').txt(data.primaryDiagnosis || '').up()
      .ele('CareLevel').txt(data.careLevel || '').up()
      .ele('HasRepresentative').txt(data.hasRepresentative === 'Yes' ? 'true' : 'false').up();

    if (data.hasRepresentative === 'Yes') {
      eligibility.ele('RepresentativeInformation')
        .ele('RepresentativeName').txt(data.representativeName || '').up()
        .ele('RepresentativePhone').txt(this.formatPhone(data.representativePhone) || '').up()
        .ele('RepresentativeRelationship').txt(data.representativeRelationship || '').up();
    }

    // Processing instructions
    doc.ele('ProcessingInstructions')
      .ele('Priority').txt('Normal').up()
      .ele('NotificationEmail').txt(HCI_FORMS_CONFIG.email.recipients.admin_notifications).up()
      .ele('FollowUpRequired').txt('true').up();

    return doc.end({ prettyPrint: true });
  }

  static buildCarePlanXML(data, metadata) {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ARMSSubmission')
        .att('xmlns', 'http://nc.gov/arms/hci-cds/v1.0')
        .att('version', '1.0')
        .att('submissionType', 'CarePlan');

    // Submission header
    doc.ele('SubmissionHeader')
      .ele('SubmissionId').txt(metadata.submissionId || this.generateSubmissionId()).up()
      .ele('SubmissionDate').txt(metadata.submissionDate || new Date().toISOString()).up()
      .ele('SourceSystem').txt(metadata.source || 'HCI-Forms').up()
      .ele('Version').txt(metadata.version || HCI_FORMS_CONFIG.version).up();

    // Care plan details
    const carePlan = doc.ele('CarePlanDetails')
      .ele('ParticipantId').txt(data.participantId || '').up()
      .ele('PlanEffectiveDate').txt(this.formatDate(data.planEffectiveDate)).up()
      .ele('CareAdvisor').txt(data.careAdvisor || '').up()
      .ele('PlanStatus').txt('Active').up();

    // Care goals
    const goals = carePlan.ele('CareGoals')
      .ele('PrimaryGoal').txt(data.primaryGoal || '').up()
      .ele('SecondaryGoals').txt(data.secondaryGoals || '').up()
      .ele('GoalTimeframe').txt(data.goalTimeframe || '').up();

    // Service schedule
    const schedule = carePlan.ele('ServiceSchedule')
      .ele('WeeklyHours').txt(data.weeklyHours || '0').up()
      .ele('PreferredTime').txt(data.preferredTime || '').up();

    if (data.preferredDays && Array.isArray(data.preferredDays)) {
      const days = schedule.ele('PreferredDays');
      data.preferredDays.forEach(day => {
        days.ele('Day').txt(day);
      });
    }

    // Budget allocation
    carePlan.ele('BudgetAllocation')
      .ele('MonthlyBudget').txt(data.monthlyBudget || '0').up()
      .ele('BudgetPeriod').txt('Monthly').up();

    if (data.budgetCategories && Array.isArray(data.budgetCategories)) {
      const categories = carePlan.ele('BudgetCategories');
      data.budgetCategories.forEach(category => {
        categories.ele('Category').txt(category);
      });
    }

    return doc.end({ prettyPrint: true });
  }

  static buildFMSAuthorizationXML(data, metadata) {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ARMSSubmission')
        .att('xmlns', 'http://nc.gov/arms/hci-cds/v1.0')
        .att('version', '1.0')
        .att('submissionType', 'FMSAuthorization');

    // Submission header
    doc.ele('SubmissionHeader')
      .ele('SubmissionId').txt(metadata.submissionId || this.generateSubmissionId()).up()
      .ele('SubmissionDate').txt(metadata.submissionDate || new Date().toISOString()).up()
      .ele('SourceSystem').txt(metadata.source || 'HCI-Forms').up()
      .ele('Version').txt(metadata.version || HCI_FORMS_CONFIG.version).up();

    // Authorization details
    const authorization = doc.ele('AuthorizationDetails')
      .ele('ParticipantId').txt(data.participantId || '').up()
      .ele('ParticipantName').txt(data.participantName || '').up()
      .ele('AuthorizationType').txt('FMS_PA_Services').up()
      .ele('AuthorizationPeriod')
        .ele('StartDate').txt(this.formatDate(data.startDate)).up()
        .ele('EndDate').txt(this.formatDate(data.endDate)).up()
      .up();

    // Personal assistant information
    const paInfo = authorization.ele('PersonalAssistantInformation')
      .ele('FirstName').txt(data.paFirstName || '').up()
      .ele('LastName').txt(data.paLastName || '').up()
      .ele('SSN').txt(this.formatSSN(data.paSSN)).up()
      .ele('Address').txt(data.paAddress || '').up()
      .ele('Phone').txt(this.formatPhone(data.paPhone)).up();

    // Service details
    authorization.ele('ServiceDetails')
      .ele('AuthorizedHours').txt(data.serviceHours || '0').up()
      .ele('HourlyRate').txt(data.hourlyRate || '0').up()
      .ele('ServiceType').txt('Personal_Care').up()
      .ele('PaymentMethod').txt('FMS').up();

    // FMS provider information
    authorization.ele('FMSProvider')
      .ele('ProviderName').txt('Gusto Payroll Services').up()
      .ele('ProviderNPI').txt('1234567890').up()
      .ele('ContactInfo')
        .ele('Phone').txt('1-800-GUSTO-HR').up()
        .ele('Email').txt('support@gusto.com').up()
      .up();

    return doc.end({ prettyPrint: true });
  }

  static buildServiceAuthorizationXML(data, metadata) {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ARMSSubmission')
        .att('xmlns', 'http://nc.gov/arms/hci-cds/v1.0')
        .att('version', '1.0')
        .att('submissionType', 'ServiceAuthorization');

    doc.ele('SubmissionHeader')
      .ele('SubmissionId').txt(metadata.submissionId || this.generateSubmissionId()).up()
      .ele('SubmissionDate').txt(metadata.submissionDate || new Date().toISOString()).up()
      .ele('SourceSystem').txt(metadata.source || 'HCI-Forms').up();

    const services = doc.ele('ServiceAuthorizations');
    
    if (Array.isArray(data.services)) {
      data.services.forEach(service => {
        services.ele('ServiceAuthorization')
          .ele('ParticipantId').txt(service.participantId || '').up()
          .ele('ServiceCode').txt(service.serviceCode || '').up()
          .ele('ServiceDescription').txt(service.description || '').up()
          .ele('Units').txt(service.units || '0').up()
          .ele('UnitType').txt(service.unitType || 'Hours').up()
          .ele('EffectivePeriod')
            .ele('StartDate').txt(this.formatDate(service.startDate)).up()
            .ele('EndDate').txt(this.formatDate(service.endDate)).up()
          .up();
      });
    }

    return doc.end({ prettyPrint: true });
  }

  static buildGenericSubmissionXML(data, metadata, type) {
    const doc = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('ARMSSubmission')
        .att('xmlns', 'http://nc.gov/arms/hci-cds/v1.0')
        .att('version', '1.0')
        .att('submissionType', type);

    doc.ele('SubmissionHeader')
      .ele('SubmissionId').txt(metadata.submissionId || this.generateSubmissionId()).up()
      .ele('SubmissionDate').txt(metadata.submissionDate || new Date().toISOString()).up()
      .ele('SourceSystem').txt(metadata.source || 'HCI-Forms').up();

    const dataElement = doc.ele('SubmissionData');
    this.buildDataElements(dataElement, data);

    return doc.end({ prettyPrint: true });
  }

  static buildDataElements(parent, data) {
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        continue;
      }
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        const child = parent.ele(this.sanitizeElementName(key));
        this.buildDataElements(child, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          parent.ele(this.sanitizeElementName(key)).txt(String(item));
        });
      } else {
        parent.ele(this.sanitizeElementName(key)).txt(String(value));
      }
    }
  }

  static sanitizeElementName(name) {
    // Ensure XML element names are valid
    return name.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/^[^a-zA-Z_]/, '_');
  }

  static formatSSN(ssn) {
    if (!ssn) return '';
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
    }
    return ssn;
  }

  static formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  static formatDate(date) {
    if (!date) return '';
    try {
      return new Date(date).toISOString().split('T')[0];
    } catch {
      return date;
    }
  }

  static generateSubmissionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `HCI-SUB-${timestamp}-${random}`;
  }

  // Validation method for XML structure
  static validateXML(xmlString) {
    try {
      const doc = create(xmlString);
      return {
        isValid: true,
        document: doc
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      };
    }
  }
}