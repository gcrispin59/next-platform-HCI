import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';
import { XMLBuilder } from '../utils/xml-builder.js';
import { EmailService } from '../services/email-service.js';
import xml2js from 'xml2js';

/**
 * ARMS Integration Module
 * Handles all interactions with the North Carolina ARMS database system
 */
export class ARMSIntegration {
  static async query(querySpec) {
    const { endpoint, type, parameters } = querySpec;
    
    try {
      const xmlQuery = this.buildXMLQuery(type, parameters);
      
      const response = await fetch(`${HCI_FORMS_CONFIG.arms.endpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HCI_FORMS_CONFIG.arms.auth.apiKey}`,
          'Content-Type': 'application/xml',
          'User-Agent': 'HCI-Forms/1.0.0'
        },
        body: xmlQuery
      });

      if (!response.ok) {
        throw new Error(`ARMS API Error: ${response.status} ${response.statusText}`);
      }

      const xmlData = await response.text();
      const parsedData = await this.parseARMSResponse(xmlData);
      
      // Log successful interaction for audit trail
      await this.logARMSInteraction({
        type: 'query',
        endpoint,
        parameters,
        success: true,
        timestamp: new Date().toISOString()
      });
      
      return parsedData;
    } catch (error) {
      console.error('ARMS Query Error:', error);
      
      // Log failed interaction
      await this.logARMSInteraction({
        type: 'query',
        endpoint,
        parameters,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      throw new Error(`ARMS Integration failed: ${error.message}`);
    }
  }

  static buildXMLQuery(type, parameters) {
    const queryTemplates = {
      'participant_lookup': this.buildParticipantLookupXML,
      'eligibility_check': this.buildEligibilityCheckXML,
      'service_authorization': this.buildServiceAuthXML,
      'care_plan_lookup': this.buildCarePlanLookupXML
    };

    const builder = queryTemplates[type] || this.buildGenericQueryXML;
    return builder(parameters);
  }

  static buildParticipantLookupXML(parameters) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ARMSQuery>
  <QueryType>ParticipantLookup</QueryType>
  <RequestId>${this.generateRequestId()}</RequestId>
  <Timestamp>${new Date().toISOString()}</Timestamp>
  <Parameters>
    <SSN>${parameters.ssn || ''}</SSN>
    <LastName>${parameters.lastName || ''}</LastName>
    <FirstName>${parameters.firstName || ''}</FirstName>
    <DateOfBirth>${parameters.dob || ''}</DateOfBirth>
    <MedicaidNumber>${parameters.medicaidNumber || ''}</MedicaidNumber>
  </Parameters>
  <RequestingSystem>HCI-Forms</RequestingSystem>
  <Version>1.0.0</Version>
</ARMSQuery>`;
  }

  static buildEligibilityCheckXML(parameters) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ARMSQuery>
  <QueryType>EligibilityCheck</QueryType>
  <RequestId>${this.generateRequestId()}</RequestId>
  <Timestamp>${new Date().toISOString()}</Timestamp>
  <Parameters>
    <ParticipantId>${parameters.participantId}</ParticipantId>
    <ServiceCode>${parameters.serviceCode || ''}</ServiceCode>
    <EffectiveDate>${parameters.effectiveDate || new Date().toISOString().split('T')[0]}</EffectiveDate>
  </Parameters>
  <RequestingSystem>HCI-Forms</RequestingSystem>
  <Version>1.0.0</Version>
</ARMSQuery>`;
  }

  static buildServiceAuthXML(parameters) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ARMSQuery>
  <QueryType>ServiceAuthorization</QueryType>
  <RequestId>${this.generateRequestId()}</RequestId>
  <Timestamp>${new Date().toISOString()}</Timestamp>
  <Parameters>
    <ParticipantId>${parameters.participantId}</ParticipantId>
    <ServiceCode>${parameters.serviceCode}</ServiceCode>
    <Units>${parameters.units || 0}</Units>
    <StartDate>${parameters.startDate}</StartDate>
    <EndDate>${parameters.endDate}</EndDate>
    <ProviderNPI>${parameters.providerNPI || ''}</ProviderNPI>
  </Parameters>
  <RequestingSystem>HCI-Forms</RequestingSystem>
  <Version>1.0.0</Version>
</ARMSQuery>`;
  }

  static buildCarePlanLookupXML(parameters) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ARMSQuery>
  <QueryType>CarePlanLookup</QueryType>
  <RequestId>${this.generateRequestId()}</RequestId>
  <Timestamp>${new Date().toISOString()}</Timestamp>
  <Parameters>
    <ParticipantId>${parameters.participantId}</ParticipantId>
    <PlanEffectiveDate>${parameters.planEffectiveDate || ''}</PlanEffectiveDate>
    <IncludeHistory>${parameters.includeHistory || 'false'}</IncludeHistory>
  </Parameters>
  <RequestingSystem>HCI-Forms</RequestingSystem>
  <Version>1.0.0</Version>
</ARMSQuery>`;
  }

  static buildGenericQueryXML(parameters) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<ARMSQuery>
  <QueryType>Generic</QueryType>
  <RequestId>${this.generateRequestId()}</RequestId>
  <Timestamp>${new Date().toISOString()}</Timestamp>
  <Parameters>
    ${Object.entries(parameters).map(([key, value]) => 
      `<${key}>${value}</${key}>`
    ).join('\n    ')}
  </Parameters>
  <RequestingSystem>HCI-Forms</RequestingSystem>
  <Version>1.0.0</Version>
</ARMSQuery>`;
  }

  static async parseARMSResponse(xmlData) {
    try {
      const parser = new xml2js.Parser({ 
        explicitArray: false,
        ignoreAttrs: false,
        parseNumbers: true,
        parseBooleans: true
      });
      
      const result = await parser.parseStringPromise(xmlData);
      
      return {
        success: true,
        data: this.extractResponseData(result),
        metadata: this.extractResponseMetadata(result),
        rawXML: xmlData
      };
    } catch (error) {
      console.error('XML parsing error:', error);
      throw new Error(`Failed to parse ARMS response: ${error.message}`);
    }
  }

  static extractResponseData(parsedXML) {
    // Extract core data from parsed XML response
    const response = parsedXML.ARMSResponse || parsedXML;
    
    return {
      participants: this.extractParticipants(response),
      services: this.extractServices(response),
      eligibility: this.extractEligibility(response),
      authorizations: this.extractAuthorizations(response)
    };
  }

  static extractResponseMetadata(parsedXML) {
    const response = parsedXML.ARMSResponse || parsedXML;
    
    return {
      requestId: response.RequestId,
      timestamp: response.Timestamp,
      status: response.Status,
      recordCount: response.RecordCount || 0,
      processingTime: response.ProcessingTime
    };
  }

  static extractParticipants(response) {
    const participants = response.Participants || response.Participant || [];
    return Array.isArray(participants) ? participants : [participants];
  }

  static extractServices(response) {
    const services = response.Services || response.Service || [];
    return Array.isArray(services) ? services : [services];
  }

  static extractEligibility(response) {
    return response.Eligibility || response.EligibilityStatus || {};
  }

  static extractAuthorizations(response) {
    const auths = response.Authorizations || response.Authorization || [];
    return Array.isArray(auths) ? auths : [auths];
  }

  static async submitToARMS(formData, submissionType) {
    try {
      const xmlPayload = XMLBuilder.generate({
        type: submissionType,
        data: formData,
        metadata: {
          submissionDate: new Date().toISOString(),
          source: 'HCI-Forms',
          version: HCI_FORMS_CONFIG.version,
          submissionId: this.generateRequestId()
        }
      });

      // Log submission attempt
      await this.logARMSInteraction({
        type: 'submission',
        submissionType,
        submissionId: this.generateRequestId(),
        success: true,
        timestamp: new Date().toISOString()
      });

      // Send via email integration (NC ARMS standard process)
      const emailResult = await EmailService.sendXMLSubmission(xmlPayload, submissionType);
      
      return {
        success: true,
        submissionId: this.generateRequestId(),
        emailResult,
        xmlPayload: xmlPayload.substring(0, 500) + '...' // Truncated for security
      };
    } catch (error) {
      console.error('ARMS submission error:', error);
      throw new Error(`ARMS submission failed: ${error.message}`);
    }
  }

  static generateRequestId() {
    return `HCI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static async logARMSInteraction(interaction) {
    try {
      // In production, this would write to database
      console.log('ARMS Interaction:', interaction);
      
      // TODO: Implement database logging
      // await DatabaseService.logInteraction(interaction);
    } catch (error) {
      console.error('Failed to log ARMS interaction:', error);
    }
  }

  // Utility methods for common ARMS operations
  static async lookupParticipant(searchCriteria) {
    return await this.query({
      endpoint: HCI_FORMS_CONFIG.arms.services.participant_lookup,
      type: 'participant_lookup',
      parameters: searchCriteria
    });
  }

  static async checkEligibility(participantId, serviceCode, effectiveDate) {
    return await this.query({
      endpoint: HCI_FORMS_CONFIG.arms.services.eligibility_check,
      type: 'eligibility_check',
      parameters: { participantId, serviceCode, effectiveDate }
    });
  }

  static async getServiceCodes() {
    return await this.query({
      endpoint: HCI_FORMS_CONFIG.arms.services.service_codes,
      type: 'service_codes',
      parameters: {}
    });
  }
}