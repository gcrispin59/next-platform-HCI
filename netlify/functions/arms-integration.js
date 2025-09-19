import { ARMSIntegration } from '../../lib/integrations/arms-integration.js';
import { XMLBuilder } from '../../lib/utils/xml-builder.js';
import { EmailService } from '../../lib/services/email-service.js';

/**
 * Netlify Function: ARMS Integration
 * Handles ARMS database queries and form submissions
 */
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, ...requestData } = JSON.parse(event.body || '{}');

    if (!action) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'action parameter is required' })
      };
    }

    let result;

    switch (action) {
      case 'query':
        const { endpoint, type, parameters } = requestData;
        result = await ARMSIntegration.query({ endpoint, type, parameters });
        break;

      case 'submit':
        const { formData, submissionType } = requestData;
        if (!formData || !submissionType) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'formData and submissionType are required for submissions' })
          };
        }
        result = await ARMSIntegration.submitToARMS(formData, submissionType);
        break;

      case 'lookupParticipant':
        const { searchCriteria } = requestData;
        result = await ARMSIntegration.lookupParticipant(searchCriteria);
        break;

      case 'checkEligibility':
        const { participantId, serviceCode, effectiveDate } = requestData;
        result = await ARMSIntegration.checkEligibility(participantId, serviceCode, effectiveDate);
        break;

      case 'getServiceCodes':
        result = await ARMSIntegration.getServiceCodes();
        break;

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Unknown action: ${action}` })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        action,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('ARMS integration error:', error);
    
    // Send error notification to administrators
    try {
      await EmailService.sendErrorNotification({
        type: 'ARMS_INTEGRATION_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        requestBody: event.body
      });
    } catch (emailError) {
      console.error('Failed to send error notification:', emailError);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'ARMS integration failed',
        message: error.message
      })
    };
  }
}