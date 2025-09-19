# API Documentation

## Base URL

```
https://your-domain.netlify.app/api
```

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

## Multi-Agent Orchestration

### Orchestrate User Journey

**Endpoint:** `POST /api/multi-agent-orchestrate`

Coordinates AI agents to guide users through HCI-CDS workflows.

**Request Body:**
```json
{
  "userId": "string",
  "intent": "participant_onboarding | care_advisor_certification | fms_vendor_setup | quality_assurance_audit",
  "context": {
    "userRole": "participant | care_advisor | administrator",
    "existingData": {},
    "preferences": {}
  },
  "action": "orchestrate | executeStep | getStatus"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow": {
      "id": "participant_onboarding",
      "name": "Participant Onboarding",
      "steps": ["eligibility_check", "form_generation", "arms_integration"],
      "estimatedTime": "45-60 minutes",
      "complexity": "medium"
    },
    "guidance": {
      "agentId": "coordinator",
      "response": "Welcome to HCI-CDS enrollment...",
      "recommendations": ["action1", "action2"]
    },
    "nextSteps": ["eligibility_check", "form_generation"]
  },
  "timestamp": "2025-09-19T10:30:00Z"
}
```

## Form Management

### Generate Dynamic Form

**Endpoint:** `POST /api/forms/generate`

**Request Body:**
```json
{
  "formType": "participant_enrollment | care_plan | fms_authorization",
  "context": {
    "workflow": {},
    "userRole": "participant | care_advisor",
    "hasEmergencyContact": true
  },
  "prePopulateData": {
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Validate Form Data

**Endpoint:** `POST /api/forms/validate`

**Request Body:**
```json
{
  "formData": {
    "firstName": "John",
    "ssn": "123-45-6789"
  },
  "formType": "participant_enrollment"
}
```

## ARMS Integration

### Submit to ARMS

**Endpoint:** `POST /api/arms/submit`

Handles all interactions with the NC ARMS database system.

**Request Body:**
```json
{
  "action": "query | submit | lookupParticipant | checkEligibility | getServiceCodes",
  "formData": {},
  "submissionType": "participant_enrollment",
  "searchCriteria": {
    "ssn": "123-45-6789",
    "lastName": "Doe"
  },
  "participantId": "P123456",
  "serviceCode": "PC001",
  "effectiveDate": "2025-09-19"
}
```

**Response Examples:**

**Participant Lookup:**
```json
{
  "success": true,
  "data": {
    "participants": [{
      "participantId": "P123456",
      "firstName": "John",
      "lastName": "Doe",
      "status": "Active",
      "enrollmentDate": "2024-01-15"
    }]
  }
}
```

**Form Submission:**
```json
{
  "success": true,
  "data": {
    "submissionId": "HCI-SUB-1726750200-abc123def",
    "emailResult": {
      "messageId": "sg-msg-123",
      "sentAt": "2025-09-19T10:30:00Z"
    }
  }
}
```

## Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2025-09-19T10:30:00Z"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Rate Limiting

- **Default**: 100 requests per minute per user
- **Form Generation**: 10 requests per minute
- **ARMS Integration**: 50 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1726750800
```

## Webhooks

### FMS Transaction Updates

**Endpoint:** `POST /api/webhooks/fms`

Receives transaction updates from FMS providers.

**Headers:**
```http
X-Webhook-Signature: sha256=...
Content-Type: application/json
```

**Payload:**
```json
{
  "event": "transaction.completed",
  "data": {
    "transactionId": "fms-123",
    "participantId": "P123456",
    "amount": 1250.00,
    "status": "completed"
  }
}
```

### ARMS Status Updates

**Endpoint:** `POST /api/webhooks/arms`

Receives processing status updates from ARMS.

## SDK Examples

### JavaScript/Node.js

```javascript
const HCIFormsClient = {
  baseURL: 'https://your-domain.netlify.app/api',
  token: 'your-jwt-token',
  
  async orchestrateWorkflow(userId, intent, context = {}) {
    const response = await fetch(`${this.baseURL}/multi-agent-orchestrate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, intent, context })
    });
    
    return await response.json();
  },
  
  async generateForm(formType, context = {}) {
    const response = await fetch(`${this.baseURL}/forms/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ formType, context })
    });
    
    return await response.json();
  },
  
  async submitToARMS(formData, submissionType) {
    const response = await fetch(`${this.baseURL}/arms/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        action: 'submit', 
        formData, 
        submissionType 
      })
    });
    
    return await response.json();
  }
};

// Usage
const workflow = await HCIFormsClient.orchestrateWorkflow(
  'user-123', 
  'participant_onboarding'
);

const form = await HCIFormsClient.generateForm(
  'participant_enrollment',
  { userRole: 'participant' }
);
```

### cURL Examples

**Generate Form:**
```bash
curl -X POST https://your-domain.netlify.app/api/forms/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "formType": "participant_enrollment",
    "context": {
      "userRole": "participant"
    }
  }'
```

**Submit to ARMS:**
```bash
curl -X POST https://your-domain.netlify.app/api/arms/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "submit",
    "formData": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "submissionType": "participant_enrollment"
  }'
```

## Testing

### Test Environment

```
https://test-hci-forms.netlify.app/api
```

### Test Data

Use these test participants for development:

```json
{
  "testParticipant1": {
    "participantId": "TEST001",
    "firstName": "Jane",
    "lastName": "Smith",
    "ssn": "123-45-6789",
    "dob": "1985-03-15"
  }
}
```

### Postman Collection

Import our Postman collection for easy API testing:

```json
{
  "info": {
    "name": "HCI-Forms API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [{
      "key": "token",
      "value": "{{jwt_token}}",
      "type": "string"
    }]
  }
}
```