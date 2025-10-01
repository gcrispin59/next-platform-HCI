/**
 * NC HCI-CDS Multi-Agent AI System
 * Orchestrates specialized AI agents for form generation, ARMS integration, and compliance
 */

import Anthropic from '@anthropic-ai/sdk';
import { query } from './database';

interface AgentConfig {
  role: string;
  model: string;
  capabilities: string[];
}

interface AgentTask {
  task: string;
  workflow?: WorkflowDefinition;
  userId?: string;
  context?: Record<string, any>;
  availableAgents?: string[];
}

interface WorkflowDefinition {
  steps: string[];
  requiredForms: string[];
  agents: string[];
}

export class MultiAgentOrchestrator {
  private anthropic: Anthropic;
  private agents: Map<string, AIAgent>;
  private conversationContext: Map<string, any>;
  private activeWorkflows: Map<string, any>;

  constructor() {
    const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    this.anthropic = new Anthropic({ apiKey });
    this.agents = new Map();
    this.conversationContext = new Map();
    this.activeWorkflows = new Map();
  }

  async initializeAgents() {
    const agentConfigs: Record<string, AgentConfig> = {
      coordinator: {
        role: "orchestrate_user_journey",
        model: "claude-sonnet-4-20250514",
        capabilities: ["workflow_design", "user_guidance", "decision_tree_navigation"]
      },
      forms_specialist: {
        role: "form_generation_expert",
        model: "claude-sonnet-4-20250514",
        capabilities: ["checklist_creation", "validation_rules", "accessibility_compliance"]
      },
      arms_integrator: {
        role: "database_interface",
        model: "claude-sonnet-4-20250514",
        capabilities: ["xml_generation", "etl_operations", "data_validation"]
      },
      compliance_advisor: {
        role: "regulatory_guidance",
        model: "claude-sonnet-4-20250514",
        capabilities: ["policy_interpretation", "requirement_mapping", "audit_preparation"]
      }
    };

    for (const [agentId, config] of Object.entries(agentConfigs)) {
      this.agents.set(agentId, new AIAgent(agentId, config, this.anthropic));
    }
  }

  async orchestrateUserJourney(userId: string, intent: string, context: Record<string, any> = {}) {
    const workflow = this.determineWorkflow(intent, context);
    const coordinatorAgent = this.agents.get('coordinator');

    if (!coordinatorAgent) {
      throw new Error('Coordinator agent not initialized');
    }

    const sessionId = crypto.randomUUID();
    this.activeWorkflows.set(sessionId, { userId, workflow, startTime: Date.now() });

    const result = await coordinatorAgent.execute({
      task: 'guide_user_journey',
      workflow,
      userId,
      context,
      availableAgents: Array.from(this.agents.keys())
    });

    // Log to database
    await this.logAgentActivity(sessionId, 'coordinator', intent, context, result);

    return { sessionId, workflow, result };
  }

  private determineWorkflow(intent: string, context: Record<string, any>): WorkflowDefinition {
    const workflows: Record<string, WorkflowDefinition> = {
      'participant_onboarding': {
        steps: ['eligibility_check', 'form_generation', 'arms_integration'],
        requiredForms: ['DA-101', 'participant_enrollment', 'care_plan'],
        agents: ['coordinator', 'forms_specialist', 'arms_integrator']
      },
      'care_advisor_certification': {
        steps: ['competency_assessment', 'training_checklist', 'documentation'],
        requiredForms: ['advisor_credentials', 'supervision_plan'],
        agents: ['coordinator', 'compliance_advisor', 'forms_specialist']
      },
      'fms_vendor_setup': {
        steps: ['vendor_agreement', 'integration_testing', 'go_live'],
        requiredForms: ['vendor_contract', 'technical_specs'],
        agents: ['coordinator', 'arms_integrator', 'compliance_advisor']
      },
      'quality_assurance_audit': {
        steps: ['compliance_review', 'documentation_audit', 'corrective_action'],
        requiredForms: ['qa_checklist', 'audit_findings', 'improvement_plan'],
        agents: ['compliance_advisor', 'forms_specialist', 'coordinator']
      },
      'care_plan_creation': {
        steps: ['needs_assessment', 'budget_calculation', 'service_authorization'],
        requiredForms: ['care_plan', 'budget_form', 'service_agreement'],
        agents: ['forms_specialist', 'arms_integrator', 'compliance_advisor']
      }
    };

    return workflows[intent] || workflows['participant_onboarding'];
  }

  async getAgent(agentType: string): Promise<AIAgent | undefined> {
    return this.agents.get(agentType);
  }

  private async logAgentActivity(
    sessionId: string,
    agentType: string,
    task: string,
    inputData: any,
    outputData: any
  ) {
    try {
      await query(
        `INSERT INTO ai_agent_logs (
          agent_type, session_id, task_description, input_data, output_data, status
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        {
          values: [
            agentType,
            sessionId,
            task,
            JSON.stringify(inputData),
            JSON.stringify(outputData),
            'success'
          ]
        }
      );
    } catch (error) {
      console.error('Failed to log agent activity:', error);
    }
  }
}

export class AIAgent {
  private id: string;
  private config: AgentConfig;
  private anthropic: Anthropic;
  private conversationHistory: any[];

  constructor(id: string, config: AgentConfig, anthropic: Anthropic) {
    this.id = id;
    this.config = config;
    this.anthropic = anthropic;
    this.conversationHistory = [];
  }

  async execute(task: AgentTask) {
    const prompt = this.buildPrompt(task);

    try {
      const startTime = Date.now();
      
      const message = await this.anthropic.messages.create({
        model: this.config.model,
        max_tokens: 4000,
        messages: [
          { role: "user", content: prompt }
        ]
      });

      const executionTime = Date.now() - startTime;
      const result = this.processResponse(message);

      this.conversationHistory.push({ task, response: result, executionTime });

      return result;
    } catch (error) {
      console.error(`Agent ${this.id} execution error:`, error);
      throw error;
    }
  }

  private buildPrompt(task: AgentTask): string {
    return `
You are a specialized AI agent for the North Carolina HCI-CDS (Home Care Independence - Consumer Directed Services) program.

**Your Role**: ${this.config.role}
**Your Capabilities**: ${this.config.capabilities.join(', ')}

**Current Task**: ${JSON.stringify(task, null, 2)}

**Context**: 
You are part of a multi-agent system helping users navigate the NC HCI-CDS program. Your specific role is to ${this.config.role}.

Based on the NC HCI policies and procedures manual, you should:
1. Provide clear, actionable guidance
2. Generate required forms and checklists
3. Ensure compliance with state regulations
4. Maintain participant confidentiality
5. Follow ARMS database integration requirements

**Response Requirements**:
- Provide structured output in JSON format
- Include recommended actions
- List required forms/checklists
- Specify ARMS database queries needed
- Define next steps for user
- Include handoff instructions for other agents if needed

**Available Agents for Collaboration**: ${task.availableAgents?.join(', ') || 'None'}

Please analyze the task and provide your expert response.
    `;
  }

  private processResponse(message: Anthropic.Message): any {
    const textContent = message.content
      .filter(block => block.type === 'text')
      .map(block => (block as any).text)
      .join('\n');

    try {
      // Try to parse as JSON
      return JSON.parse(textContent);
    } catch {
      // Return as structured text if not JSON
      return {
        type: 'text_response',
        content: textContent,
        stopReason: message.stop_reason,
        usage: message.usage
      };
    }
  }

  getCapabilities(): string[] {
    return this.config.capabilities;
  }

  getId(): string {
    return this.id;
  }
}

// Singleton instance
let orchestratorInstance: MultiAgentOrchestrator | null = null;

export async function getOrchestrator(): Promise<MultiAgentOrchestrator> {
  if (!orchestratorInstance) {
    orchestratorInstance = new MultiAgentOrchestrator();
    await orchestratorInstance.initializeAgents();
  }
  return orchestratorInstance;
}
