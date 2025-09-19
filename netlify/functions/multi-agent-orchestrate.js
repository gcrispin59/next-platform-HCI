import { MultiAgentOrchestrator } from '../../lib/agents/multi-agent-orchestrator.js';
import { HCI_FORMS_CONFIG } from '../../lib/config/hci-forms-config.js';

/**
 * Netlify Function: Multi-Agent Orchestration
 * Handles user journey orchestration and agent coordination
 */
export async function handler(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { userId, intent, context = {}, action = 'orchestrate' } = JSON.parse(event.body || '{}');

    if (!userId || !intent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required parameters: userId and intent are required' 
        })
      };
    }

    const orchestrator = new MultiAgentOrchestrator();
    await orchestrator.initializeAgents();

    let result;
    
    switch (action) {
      case 'orchestrate':
        result = await orchestrator.orchestrateUserJourney(userId, intent, context);
        break;
      case 'executeStep':
        const stepIndex = context.stepIndex || 0;
        result = await orchestrator.executeWorkflowStep(userId, stepIndex);
        break;
      case 'getStatus':
        result = orchestrator.getWorkflowStatus(userId);
        break;
      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action parameter' })
        };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Multi-agent orchestration error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
}