# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18.0+ 
- **PostgreSQL** 14+
- **Git**
- **Netlify CLI**: `npm install -g netlify-cli`
- **IDE**: VS Code recommended with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - PostgreSQL syntax highlighting
  - ESLint
  - Prettier

### Development Environment Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/gcrispin59/next-platform-HCI.git
   cd next-platform-HCI
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   ```bash
   # Create development database
   createdb hci_forms_dev
   
   # Run schema
   psql -d hci_forms_dev -f database/schema.sql
   
   # Add test data (optional)
   psql -d hci_forms_dev -f database/test-data.sql
   ```

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your development values
   ```

5. **Start Development Server**
   ```bash
   netlify dev
   ```

   Access at: [http://localhost:8888](http://localhost:8888)

## Project Architecture

### Directory Structure

```
next-platform-HCI/
├── app/                    # Next.js App Router
│   ├── api/               # API route handlers
│   │   ├── multi-agent-orchestrate/
│   │   ├── forms/
│   │   └── arms/
│   ├── page.jsx           # Home page
│   └── layout.jsx         # Root layout
├── components/            # React components
│   ├── hci-forms/        # Form-specific components
│   │   ├── HCIFormContainer.jsx
│   │   ├── FormGenerator.jsx
│   │   └── HelpSystem.jsx
│   └── ui/               # Reusable UI components
│       ├── Button.jsx
│       ├── Modal.jsx
│       └── LoadingSpinner.jsx
├── lib/                   # Core business logic
│   ├── agents/           # Multi-agent AI system
│   │   ├── multi-agent-orchestrator.js
│   │   └── ai-agent.js
│   ├── forms/            # Form generation and validation
│   │   ├── form-generator.js
│   │   └── validation-engine.js
│   ├── integrations/     # External service integrations
│   │   └── arms-integration.js
│   ├── services/         # Business services
│   │   ├── email-service.js
│   │   └── fms-integration.js
│   ├── utils/            # Utility functions
│   │   └── xml-builder.js
│   ├── help/             # Help system
│   │   └── help-system.js
│   └── config/           # Configuration
│       └── hci-forms-config.js
├── netlify/              # Netlify Functions
│   └── functions/
│       ├── multi-agent-orchestrate.js
│       ├── forms-generate.js
│       └── arms-integration.js
├── database/             # Database schema and migrations
│   ├── schema.sql
│   └── test-data.sql
├── docs/                 # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
└── README.md
```

### Key Concepts

#### Multi-Agent System

The core of the platform is a multi-agent AI system with four specialized agents:

```javascript
// Each agent has specific capabilities
const agents = {
  coordinator: {
    role: "orchestrate_user_journey",
    capabilities: ["workflow_design", "user_guidance"]
  },
  forms_specialist: {
    role: "form_generation_expert",
    capabilities: ["checklist_creation", "validation_rules"]
  },
  arms_integrator: {
    role: "database_interface",
    capabilities: ["xml_generation", "etl_operations"]
  },
  compliance_advisor: {
    role: "regulatory_guidance",
    capabilities: ["policy_interpretation", "audit_preparation"]
  }
};
```

#### Dynamic Form Generation

Forms are generated dynamically based on:
- User role and permissions
- Current workflow context
- Pre-populated data from ARMS
- Accessibility requirements

```javascript
const form = await FormGenerator.create({
  formType: 'participant_enrollment',
  context: { userRole: 'participant' },
  prePopulateData: { firstName: 'John' }
});
```

#### ARMS Integration

Seamless integration with North Carolina's ARMS database:
- XML-based communication
- Email transmission of submissions
- Real-time participant lookup
- Eligibility verification

## Development Workflow

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-form-type
   ```

2. **Develop and Test**
   ```bash
   # Run development server
   netlify dev
   
   # Run tests
   npm test
   
   # Run linting
   npm run lint
   ```

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new form type for care advisor certification"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/new-form-type
   # Create pull request on GitHub
   ```

### Adding New Form Types

1. **Define Form Template**
   ```javascript
   // lib/forms/form-generator.js
   const templates = {
     'new_form_type': {
       title: 'New Form Title',
       sections: [
         {
           id: 'section_1',
           title: 'Section Title',
           fields: [
             {
               name: 'fieldName',
               type: 'text',
               required: true,
               label: 'Field Label'
             }
           ]
         }
       ],
       requiredFields: ['fieldName'],
       dependencies: ['prerequisite_form']
     }
   };
   ```

2. **Add Validation Rules**
   ```javascript
   // lib/forms/validation-engine.js
   const formSpecificRules = {
     'new_form_type': {
       fieldName: {
         pattern: /^[A-Za-z\s]+$/,
         message: 'Only letters and spaces allowed'
       }
     }
   };
   ```

3. **Create Help Content**
   ```javascript
   // lib/help/help-system.js
   static helpContent = {
     'new_form_type': {
       title: 'New Form Help',
       sections: [
         {
           id: 'overview',
           title: 'Overview',
           content: '<p>Help content here...</p>'
         }
       ]
     }
   };
   ```

4. **Add Tests**
   ```javascript
   // tests/forms/new-form-type.test.js
   describe('New Form Type', () => {
     test('should generate form correctly', async () => {
       const form = await FormGenerator.create({
         formType: 'new_form_type',
         context: {}
       });
       
       expect(form).toBeDefined();
       expect(form.formId).toContain('new-form-type');
     });
   });
   ```

### Adding New AI Agents

1. **Define Agent Configuration**
   ```javascript
   // lib/config/hci-forms-config.js
   agents: {
     new_agent: {
       role: "specialized_task",
       model: "claude-sonnet-4-20250514",
       capabilities: ["capability1", "capability2"]
     }
   }
   ```

2. **Create Agent Prompt**
   ```javascript
   // lib/agents/ai-agent.js
   buildNewAgentPrompt(task) {
     return `
     Role: Specialized Agent
     Capabilities: ${this.config.capabilities.join(', ')}
     
     Task: ${JSON.stringify(task, null, 2)}
     
     Provide structured output for: ...
     `;
   }
   ```

3. **Add Agent Tools**
   ```javascript
   createSpecializedTool() {
     return {
       name: "specialized_tool",
       description: "Performs specialized operations",
       execute: async (parameters) => {
         return await this.performSpecializedOperation(parameters);
       }
     };
   }
   ```

## Testing

### Test Structure

```
tests/
├── unit/
│   ├── agents/
│   ├── forms/
│   └── integrations/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   └── workflows/
└── fixtures/
    ├── test-data.json
    └── mock-responses.json
```

### Running Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Examples

**Unit Test:**
```javascript
// tests/unit/forms/validation-engine.test.js
import { ValidationEngine } from '../../../lib/forms/validation-engine';

describe('ValidationEngine', () => {
  test('should validate SSN format', async () => {
    const result = await ValidationEngine.validateField(
      'ssn',
      '123-45-6789',
      {
        common: {
          ssn: {
            pattern: '^\\d{3}-\\d{2}-\\d{4}$',
            message: 'Invalid SSN format'
          }
        },
        specific: {}
      }
    );
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

**Integration Test:**
```javascript
// tests/integration/api/forms.test.js
import { POST } from '../../../app/api/forms/generate/route';

describe('Forms API', () => {
  test('should generate participant enrollment form', async () => {
    const request = new Request('http://localhost:3000/api/forms/generate', {
      method: 'POST',
      body: JSON.stringify({
        formType: 'participant_enrollment',
        context: { userRole: 'participant' }
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.form.formId).toBeDefined();
  });
});
```

## Database Development

### Schema Changes

1. **Create Migration**
   ```sql
   -- database/migrations/002_add_new_table.sql
   CREATE TABLE new_table (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_new_table_name ON new_table(name);
   ```

2. **Apply Migration**
   ```bash
   psql -d hci_forms_dev -f database/migrations/002_add_new_table.sql
   ```

3. **Update Schema Documentation**
   ```sql
   COMMENT ON TABLE new_table IS 'Description of the new table';
   COMMENT ON COLUMN new_table.name IS 'Name field description';
   ```

### Test Data

```sql
-- database/test-data.sql
INSERT INTO users (id, email, first_name, last_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'test@example.com', 'Test', 'User', 'participant'),
('00000000-0000-0000-0000-000000000002', 'advisor@example.com', 'Care', 'Advisor', 'care_advisor');

INSERT INTO participants (id, user_id, participant_id, first_name, last_name) VALUES
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'TEST001', 'Test', 'Participant');
```

## Code Style and Standards

### ESLint Configuration

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "prefer-const": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Naming Conventions

- **Files**: kebab-case (`form-generator.js`)
- **Components**: PascalCase (`HCIFormContainer.jsx`)
- **Functions**: camelCase (`generateForm`)
- **Constants**: UPPER_SNAKE_CASE (`HCI_FORMS_CONFIG`)
- **Database**: snake_case (`participant_id`)

## Debugging

### Development Tools

1. **Browser DevTools**
   - React DevTools extension
   - Network tab for API calls
   - Console for JavaScript errors

2. **VS Code Debugging**
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Next.js: debug server-side",
         "type": "node",
         "request": "launch",
         "program": "${workspaceFolder}/node_modules/.bin/next",
         "args": ["dev"],
         "console": "integratedTerminal",
         "skipFiles": ["<node_internals>/**"]
       }
     ]
   }
   ```

3. **Database Debugging**
   ```bash
   # Enable query logging
   psql -d hci_forms_dev -c "ALTER SYSTEM SET log_statement = 'all';"
   psql -d hci_forms_dev -c "SELECT pg_reload_conf();"
   
   # View logs
   tail -f /var/log/postgresql/postgresql-14-main.log
   ```

### Common Issues

1. **Build Failures**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   
   # Clear node_modules
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection Issues**
   ```bash
   # Test connection
   psql -d hci_forms_dev -c "SELECT 1;"
   
   # Check environment variables
   echo $DB_HOST $DB_NAME $DB_USER
   ```

3. **API Issues**
   ```bash
   # Check Netlify Functions logs
   netlify functions:invoke function-name --payload '{"test": true}'
   
   # View function logs
   netlify dev --live
   ```

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Dynamic imports for large components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <LoadingSpinner />,
     ssr: false
   });
   ```

2. **Image Optimization**
   ```javascript
   import Image from 'next/image';
   
   <Image
     src="/image.jpg"
     alt="Description"
     width={500}
     height={300}
     priority={false}
   />
   ```

### Backend Optimization

1. **Database Query Optimization**
   ```sql
   -- Use appropriate indexes
   CREATE INDEX CONCURRENTLY idx_participants_status_date 
   ON participants(status, enrollment_date);
   
   -- Analyze query performance
   EXPLAIN ANALYZE SELECT * FROM participants WHERE status = 'active';
   ```

2. **Function Performance**
   ```javascript
   // Use connection pooling
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 10,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000
   });
   ```

## Contributing Guidelines

### Pull Request Process

1. **Pre-submission Checklist**
   - [ ] Tests pass locally
   - [ ] Linting passes
   - [ ] Documentation updated
   - [ ] No merge conflicts
   - [ ] Descriptive commit messages

2. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Unit tests added/updated
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Screenshots
   If applicable, add screenshots
   ```

3. **Code Review Guidelines**
   - Focus on correctness, security, and maintainability
   - Check for proper error handling
   - Verify accessibility compliance
   - Ensure consistent code style

### Release Process

1. **Version Bump**
   ```bash
   npm version patch|minor|major
   ```

2. **Create Release**
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **Deploy to Production**
   ```bash
   # Automated via GitHub Actions
   # or manual deploy via Netlify
   ```