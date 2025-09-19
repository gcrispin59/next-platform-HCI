import { ValidationEngine } from '../../lib/forms/validation-engine.js';
import { FormGenerator } from '../../lib/forms/form-generator.js';

/**
 * Netlify Function: Form Validation
 * Validates form data against HCI policies and business rules
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
    const { formData, formType } = JSON.parse(event.body || '{}');

    if (!formData || !formType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'formData and formType are required' })
      };
    }

    // Get validation rules for the form type
    const validationRules = await FormGenerator.prototype.constructor.buildValidationRules(formType);
    
    // Perform validation
    const validationResult = await ValidationEngine.validate(formData, formType, validationRules);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        validation: validationResult,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Form validation error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Validation failed',
        message: error.message
      })
    };
  }
}