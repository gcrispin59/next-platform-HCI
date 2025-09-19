/**
 * HCI-Forms System Configuration
 * Multi-agent AI system for North Carolina HCI-CDS program management
 */

export const HCI_FORMS_CONFIG = {
  version: "1.0.0",
  environment: process.env.NODE_ENV || 'development',
  
  // Multi-Agent AI Configuration
  agents: {
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
  },

  // NC ARMS Integration
  arms: {
    endpoint: process.env.ARMS_API_ENDPOINT,
    auth: {
      apiKey: process.env.ARMS_API_KEY,
      certPath: process.env.ARMS_CERT_PATH
    },
    services: {
      participant_lookup: "/api/v1/participants",
      service_codes: "/api/v1/codes", 
      eligibility_check: "/api/v1/eligibility",
      case_management: "/api/v1/cases"
    }
  },

  // Database Configuration
  database: {
    type: "postgresql",
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    }
  },

  // Email Integration for XML transmission
  email: {
    provider: "sendgrid",
    apiKey: process.env.SENDGRID_API_KEY,
    templates: {
      arms_submission: process.env.SENDGRID_TEMPLATE_ARMS,
      notification: process.env.SENDGRID_TEMPLATE_NOTIFICATION
    },
    recipients: {
      arms_submissions: process.env.ARMS_EMAIL_RECIPIENT,
      admin_notifications: process.env.ADMIN_EMAIL
    }
  },

  // Claude API Configuration
  claude: {
    apiKey: process.env.CLAUDE_API_KEY,
    endpoint: "https://api.anthropic.com/v1/messages",
    maxTokens: 4000,
    timeout: 30000
  },

  // FMS Integration for Transaction Processing
  fms: {
    providers: {
      gusto: {
        apiKey: process.env.GUSTO_API_KEY,
        endpoint: process.env.GUSTO_API_ENDPOINT,
        webhookSecret: process.env.GUSTO_WEBHOOK_SECRET
      }
    },
    fees: {
      transaction_fee_percent: parseFloat(process.env.TRANSACTION_FEE_PERCENT || '2.5'),
      setup_fee: parseFloat(process.env.SETUP_FEE || '25.00'),
      monthly_minimum: parseFloat(process.env.MONTHLY_MINIMUM || '50.00')
    }
  }
};

export default HCI_FORMS_CONFIG;