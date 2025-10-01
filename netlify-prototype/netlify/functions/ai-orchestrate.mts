/**
 * AI Orchestration Endpoint
 * Handles user journey orchestration through multi-agent system
 */

import type { Context, Config } from "@netlify/functions";
import { getOrchestrator } from "../../src/lib/ai-agents";

export default async (req: Request, context: Context) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { intent, userId, context: userContext } = body;

    if (!intent) {
      return new Response(JSON.stringify({ 
        error: 'Missing required field: intent' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get orchestrator instance
    const orchestrator = await getOrchestrator();

    // Orchestrate user journey
    const result = await orchestrator.orchestrateUserJourney(
      userId || 'anonymous',
      intent,
      userContext || {}
    );

    return new Response(JSON.stringify({
      success: true,
      sessionId: result.sessionId,
      workflow: result.workflow,
      guidance: result.result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI orchestration error:', error);
    
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config: Config = {
  path: "/api/ai/orchestrate"
};
