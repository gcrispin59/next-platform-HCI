import { FormGenerator } from '../../lib/forms/form-generator.js';
import { ValidationEngine } from '../../lib/forms/validation-engine.js';

/**
 * Netlify Function: Form Generation
 * Generates dynamic forms based on HCI policies and user context
 */
export async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const { formType, context = {}, prePopulateData = {}, userRole = 'participant' } = JSON.parse(event.body || '{}');

    if (!formType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'formType is required' })
      };
    }

    const formResult = await FormGenerator.create({
      formType,
      context,
      prePopulateData,
      userRole
    });

    // Add client-side validation script
    const validationScript = ValidationEngine.attachClientValidation(formResult.formId);
    formResult.html += validationScript;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        form: formResult,
        generatedAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Form generation error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Form generation failed',
        message: error.message
      })
    };
  }
}