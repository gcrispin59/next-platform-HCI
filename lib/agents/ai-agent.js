import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';
import { ARMSIntegration } from '../integrations/arms-integration.js';
import { FormGenerator } from '../forms/form-generator.js';
import { XMLBuilder } from '../utils/xml-builder.js';
import { ValidationEngine } from '../forms/validation-engine.js';

/**
 * Individual AI Agent Class
 * Represents a specialized AI agent with specific capabilities
 */
export class AIAgent {
  constructor(id, config) {
    this.id = id;
    this.config = config;
    this.conversationHistory = [];
    this.tools = this.initializeTools();
    this.claudeConfig = HCI_FORMS_CONFIG.claude;
  }

  initializeTools() {
    return {
      arms_query: this.createARMSQueryTool(),
      form_generator: this.createFormGeneratorTool(),
      xml_builder: this.createXMLBuilderTool(),
      validation_engine: this.createValidationTool()
    };
  }

  async execute(task) {
    try {
      const prompt = this.buildPrompt(task);
      const response = await this.callClaude(prompt);
      
      this.conversationHistory.push({ 
        task, 
        response,
        timestamp: new Date().toISOString()
      });
      
      return this.processResponse(response);
    } catch (error) {
      console.error(`Agent ${this.id} execution error:`, error);
      throw new Error(`Agent execution failed: ${error.message}`);
    }
  }

  async callClaude(prompt) {
    const response = await fetch(this.claudeConfig.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.claudeConfig.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.claudeConfig.maxTokens,
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  buildPrompt(task) {
    const contextualPrompts = {
      coordinator: this.buildCoordinatorPrompt(task),
      forms_specialist: this.buildFormsSpecialistPrompt(task),
      arms_integrator: this.buildARMSIntegratorPrompt(task),
      compliance_advisor: this.buildComplianceAdvisorPrompt(task)
    };

    return contextualPrompts[this.id] || this.buildGenericPrompt(task);
  }

  buildCoordinatorPrompt(task) {
    return `
Role: HCI-CDS Program Coordinator
Specialization: User journey orchestration and workflow management
Capabilities: ${this.config.capabilities.join(', ')}

Task: ${JSON.stringify(task, null, 2)}

You are the lead coordinator for the North Carolina HCI-CDS program. Your role is to:
1. Guide users through complex program workflows
2. Coordinate with specialist agents for technical tasks
3. Ensure compliance with state regulations
4. Provide clear, actionable guidance

Context: User ${task.userId} is requesting guidance for: ${task.task}

Available specialist agents: ${task.availableAgents?.join(', ') || 'None specified'}

Provide structured output including:
1. Recommended workflow steps
2. Required forms and documentation
3. Agent handoff instructions
4. User guidance and next actions
5. Risk assessment and mitigation strategies

Response format: JSON with clear action items and guidance.
    `;
  }

  buildFormsSpecialistPrompt(task) {
    return `
Role: HCI-CDS Forms Generation Specialist
Specialization: Dynamic form creation and validation
Capabilities: ${this.config.capabilities.join(', ')}

Task: ${JSON.stringify(task, null, 2)}

You are responsible for:
1. Generating accessible, compliant forms
2. Creating dynamic validation rules
3. Ensuring WCAG 2.1 AA accessibility compliance
4. Implementing progressive enhancement

Form Requirements:
- NC HCI-CDS policy compliance
- Section 508 accessibility
- Mobile-responsive design
- Multi-language support capability
- Integration with ARMS database

Provide:
1. Form structure and field definitions
2. Validation rules and error messaging
3. Accessibility annotations
4. Progressive enhancement strategy
5. Integration requirements

Response format: JSON with complete form specification.
    `;
  }

  buildARMSIntegratorPrompt(task) {
    return `
Role: ARMS Database Integration Specialist
Specialization: NC ARMS system connectivity and data processing
Capabilities: ${this.config.capabilities.join(', ')}

Task: ${JSON.stringify(task, null, 2)}

You handle:
1. ARMS database queries and updates
2. XML document generation for submissions
3. Data transformation and validation
4. ETL operations for participant data

Technical Context:
- ARMS API endpoints and authentication
- XML schema validation
- Data mapping and transformation
- Error handling and retry logic

Provide:
1. ARMS query specifications
2. XML document structure
3. Data validation requirements
4. Integration testing procedures
5. Error handling strategies

Response format: JSON with technical specifications and implementation details.
    `;
  }

  buildComplianceAdvisorPrompt(task) {
    return `
Role: HCI-CDS Compliance and Regulatory Advisor
Specialization: Policy interpretation and audit preparation
Capabilities: ${this.config.capabilities.join(', ')}

Task: ${JSON.stringify(task, null, 2)}

You ensure:
1. NC HCI policy compliance
2. Federal regulation adherence
3. Audit trail documentation
4. Risk assessment and mitigation

Regulatory Framework:
- NC DMA policies
- CMS regulations
- HIPAA compliance
- State procurement requirements

Provide:
1. Compliance checklist items
2. Required documentation
3. Audit preparation guidelines
4. Risk assessment matrix
5. Corrective action procedures

Response format: JSON with compliance requirements and procedures.
    `;
  }

  buildGenericPrompt(task) {
    return `
Role: ${this.config.role}
Capabilities: ${this.config.capabilities.join(', ')}

Task: ${JSON.stringify(task, null, 2)}

Context: You are part of a multi-agent system helping users navigate the North Carolina HCI-CDS program.

Available tools: ${Object.keys(this.tools).join(', ')}

Please provide structured output that includes:
1. Recommended actions
2. Required forms/checklists
3. ARMS database operations needed
4. Next steps for user
5. Handoff instructions for other agents if needed

Response format: JSON
    `;
  }

  processResponse(claudeResponse) {
    try {
      // Extract text content from Claude's response
      const responseText = claudeResponse.content?.[0]?.text || claudeResponse.message || JSON.stringify(claudeResponse);
      
      // Attempt to parse as JSON if it looks like JSON
      if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
        try {
          return JSON.parse(responseText);
        } catch (parseError) {
          console.warn('Failed to parse response as JSON, returning as text');
        }
      }
      
      // Return structured response
      return {
        agentId: this.id,
        agentRole: this.config.role,
        response: responseText,
        timestamp: new Date().toISOString(),
        capabilities: this.config.capabilities
      };
    } catch (error) {
      console.error('Response processing error:', error);
      return {
        agentId: this.id,
        error: 'Failed to process agent response',
        originalResponse: claudeResponse
      };
    }
  }

  createARMSQueryTool() {
    return {
      name: "arms_query",
      description: "Query NC ARMS database for participant, service, or eligibility data",
      execute: async (query) => {
        return await ARMSIntegration.query(query);
      }
    };
  }

  createFormGeneratorTool() {
    return {
      name: "form_generator", 
      description: "Generate dynamic forms based on HCI policies and user context",
      execute: async (formSpec) => {
        return await FormGenerator.create(formSpec);
      }
    };
  }

  createXMLBuilderTool() {
    return {
      name: "xml_builder",
      description: "Build XML documents for ARMS submission",
      execute: async (data) => {
        return await XMLBuilder.generate(data);
      }
    };
  }

  createValidationTool() {
    return {
      name: "validation_engine",
      description: "Validate form data against HCI policies and ARMS requirements",
      execute: async (formData) => {
        return await ValidationEngine.validate(formData);
      }
    };
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}