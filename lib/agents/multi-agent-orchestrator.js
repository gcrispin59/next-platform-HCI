import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';
import { AIAgent } from './ai-agent.js';
import { ARMSIntegration } from '../integrations/arms-integration.js';
import { FormGenerator } from '../forms/form-generator.js';

/**
 * Multi-Agent AI System Orchestrator
 * Coordinates multiple AI agents for HCI-CDS workflow management
 */
export class MultiAgentOrchestrator {
  constructor(config = HCI_FORMS_CONFIG) {
    this.config = config;
    this.agents = new Map();
    this.conversationContext = new Map();
    this.activeWorkflows = new Map();
    this.sessionStore = new Map();
  }

  async initializeAgents() {
    try {
      for (const [agentId, agentConfig] of Object.entries(this.config.agents)) {
        this.agents.set(agentId, new AIAgent(agentId, agentConfig));
        console.log(`Initialized agent: ${agentId}`);
      }
      return { success: true, message: 'All agents initialized successfully' };
    } catch (error) {
      console.error('Failed to initialize agents:', error);
      throw new Error(`Agent initialization failed: ${error.message}`);
    }
  }

  async orchestrateUserJourney(userId, intent, context = {}) {
    try {
      const workflow = await this.determineWorkflow(intent, context);
      const coordinatorAgent = this.agents.get('coordinator');
      
      if (!coordinatorAgent) {
        throw new Error('Coordinator agent not available');
      }

      // Store session context
      this.sessionStore.set(userId, {
        intent,
        workflow,
        context,
        startTime: new Date().toISOString(),
        status: 'active'
      });

      const orchestrationResult = await coordinatorAgent.execute({
        task: 'guide_user_journey',
        workflow: workflow,
        userId: userId,
        context: context,
        availableAgents: Array.from(this.agents.keys())
      });

      // Update workflow status
      this.activeWorkflows.set(userId, {
        ...workflow,
        status: 'in_progress',
        currentStep: 0,
        agentResponse: orchestrationResult
      });

      return {
        success: true,
        workflow,
        guidance: orchestrationResult,
        nextSteps: this.getNextSteps(workflow, 0),
        sessionId: userId
      };
    } catch (error) {
      console.error('Orchestration error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'Please contact support for assistance'
      };
    }
  }

  async determineWorkflow(intent, context) {
    const workflows = {
      'participant_onboarding': {
        id: 'participant_onboarding',
        name: 'Participant Onboarding',
        steps: ['eligibility_check', 'form_generation', 'arms_integration'],
        requiredForms: ['DA-101', 'participant_enrollment', 'care_plan'],
        agents: ['coordinator', 'forms_specialist', 'arms_integrator'],
        estimatedTime: '45-60 minutes',
        complexity: 'medium'
      },
      'care_advisor_certification': {
        id: 'care_advisor_certification',
        name: 'Care Advisor Certification',
        steps: ['competency_assessment', 'training_checklist', 'documentation'],
        requiredForms: ['advisor_credentials', 'supervision_plan'],
        agents: ['coordinator', 'compliance_advisor', 'forms_specialist'],
        estimatedTime: '30-45 minutes',
        complexity: 'low'
      },
      'fms_vendor_setup': {
        id: 'fms_vendor_setup',
        name: 'FMS Vendor Setup',
        steps: ['vendor_agreement', 'integration_testing', 'go_live'],
        requiredForms: ['vendor_contract', 'technical_specs'],
        agents: ['coordinator', 'arms_integrator', 'compliance_advisor'],
        estimatedTime: '60-90 minutes',
        complexity: 'high'
      },
      'quality_assurance_audit': {
        id: 'quality_assurance_audit',
        name: 'Quality Assurance Audit',
        steps: ['compliance_review', 'documentation_audit', 'corrective_action'],
        requiredForms: ['qa_checklist', 'audit_findings', 'improvement_plan'],
        agents: ['compliance_advisor', 'forms_specialist', 'coordinator'],
        estimatedTime: '90-120 minutes',
        complexity: 'high'
      }
    };

    // Enhanced workflow determination logic
    if (workflows[intent]) {
      return workflows[intent];
    }

    // Fallback to participant onboarding for unknown intents
    console.warn(`Unknown intent: ${intent}, defaulting to participant_onboarding`);
    return workflows['participant_onboarding'];
  }

  async executeWorkflowStep(userId, stepIndex) {
    try {
      const workflow = this.activeWorkflows.get(userId);
      if (!workflow) {
        throw new Error('No active workflow found for user');
      }

      if (stepIndex >= workflow.steps.length) {
        return this.completeWorkflow(userId);
      }

      const currentStep = workflow.steps[stepIndex];
      const requiredAgent = this.determineStepAgent(currentStep, workflow.agents);
      const agent = this.agents.get(requiredAgent);

      if (!agent) {
        throw new Error(`Required agent ${requiredAgent} not available`);
      }

      const stepResult = await agent.execute({
        task: currentStep,
        workflow: workflow,
        stepIndex: stepIndex,
        userId: userId,
        context: this.sessionStore.get(userId)?.context || {}
      });

      // Update workflow progress
      workflow.currentStep = stepIndex + 1;
      workflow.stepResults = workflow.stepResults || [];
      workflow.stepResults[stepIndex] = stepResult;

      return {
        success: true,
        stepResult,
        nextSteps: this.getNextSteps(workflow, stepIndex + 1),
        progress: ((stepIndex + 1) / workflow.steps.length) * 100
      };
    } catch (error) {
      console.error('Workflow step execution error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  determineStepAgent(step, availableAgents) {
    const stepAgentMap = {
      'eligibility_check': 'arms_integrator',
      'form_generation': 'forms_specialist',
      'arms_integration': 'arms_integrator',
      'competency_assessment': 'compliance_advisor',
      'training_checklist': 'forms_specialist',
      'documentation': 'forms_specialist',
      'vendor_agreement': 'compliance_advisor',
      'integration_testing': 'arms_integrator',
      'go_live': 'coordinator',
      'compliance_review': 'compliance_advisor',
      'documentation_audit': 'compliance_advisor',
      'corrective_action': 'coordinator'
    };

    return stepAgentMap[step] || 'coordinator';
  }

  getNextSteps(workflow, currentStepIndex) {
    if (currentStepIndex >= workflow.steps.length) {
      return ['workflow_complete'];
    }

    const remainingSteps = workflow.steps.slice(currentStepIndex);
    return remainingSteps.slice(0, 3); // Show next 3 steps
  }

  async completeWorkflow(userId) {
    const workflow = this.activeWorkflows.get(userId);
    if (workflow) {
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();
    }

    return {
      success: true,
      message: 'Workflow completed successfully',
      workflow,
      summary: this.generateWorkflowSummary(workflow)
    };
  }

  generateWorkflowSummary(workflow) {
    return {
      workflowId: workflow.id,
      completedSteps: workflow.stepResults?.length || 0,
      totalSteps: workflow.steps.length,
      formsGenerated: workflow.requiredForms,
      duration: workflow.completedAt && workflow.startTime ? 
        new Date(workflow.completedAt) - new Date(workflow.startTime) : null
    };
  }

  getWorkflowStatus(userId) {
    const workflow = this.activeWorkflows.get(userId);
    const session = this.sessionStore.get(userId);
    
    return {
      workflow,
      session,
      isActive: workflow?.status === 'in_progress' || workflow?.status === 'active'
    };
  }
}