# HCI-CDS Forms Management System - Data Dictionary

## Overview
This document serves as the comprehensive data dictionary for the North Carolina Health Care Innovation and Community Development Services (HCI-CDS) Forms Management System. It defines all database tables, fields, relationships, and data requirements based on workflow analysis and human interaction patterns.

## Table of Contents
1. [Current Database Schema](#current-database-schema)
2. [Additional Tables Required](#additional-tables-required)
3. [Enhanced Field Requirements](#enhanced-field-requirements)
4. [Data Relationships](#data-relationships)
5. [Security & Compliance](#security--compliance)
6. [Performance Optimization](#performance-optimization)
7. [State-Specific Requirements](#state-specific-requirements)

---

## Current Database Schema

### Core Tables

#### users
**Purpose**: System user authentication and basic information
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('participant', 'care_advisor', 'administrator', 'system_admin')),
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

#### participants
**Purpose**: Detailed participant information for HCI-CDS program
```sql
CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    participant_id VARCHAR(20) UNIQUE NOT NULL,
    ssn_encrypted TEXT, -- PGP encrypted
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    medicaid_number VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) DEFAULT 'NC',
    zip_code VARCHAR(10) NOT NULL,
    primary_phone VARCHAR(20) NOT NULL,
    secondary_phone VARCHAR(20),
    preferred_contact VARCHAR(20) CHECK (preferred_contact IN ('phone', 'email', 'mail')),
    primary_diagnosis TEXT,
    care_level VARCHAR(10) CHECK (care_level IN ('Level 1', 'Level 2', 'Level 3')),
    enrollment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    care_advisor_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### care_plans
**Purpose**: Individual care plans for participants
```sql
CREATE TABLE care_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    plan_effective_date DATE NOT NULL,
    care_advisor_id UUID REFERENCES users(id),
    primary_goal TEXT NOT NULL,
    secondary_goals TEXT,
    goal_timeframe VARCHAR(20) CHECK (goal_timeframe IN ('3 months', '6 months', '12 months')),
    weekly_hours DECIMAL(5,2) NOT NULL CHECK (weekly_hours > 0 AND weekly_hours <= 40),
    preferred_days TEXT[], -- Array of days
    preferred_time VARCHAR(20) CHECK (preferred_time IN ('Morning', 'Afternoon', 'Evening', 'Flexible')),
    monthly_budget DECIMAL(10,2) NOT NULL CHECK (monthly_budget > 0),
    budget_categories TEXT[], -- Array of categories
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'active', 'completed')),
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### personal_assistants
**Purpose**: Personal assistant information and credentials
```sql
CREATE TABLE personal_assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    ssn_encrypted TEXT, -- PGP encrypted
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) DEFAULT 'NC',
    zip_code VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    background_check_status VARCHAR(20) CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
    background_check_date DATE,
    certification_status VARCHAR(20) CHECK (certification_status IN ('pending', 'certified', 'expired', 'suspended')),
    certification_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### fms_authorizations
**Purpose**: FMS provider authorizations for personal assistants
```sql
CREATE TABLE fms_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    personal_assistant_id UUID REFERENCES personal_assistants(id),
    authorization_number VARCHAR(50) UNIQUE NOT NULL,
    fms_provider VARCHAR(50) NOT NULL,
    fms_account_id VARCHAR(100),
    fms_employee_id VARCHAR(100),
    service_hours DECIMAL(5,2) NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'active', 'suspended', 'terminated')),
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### form_submissions
**Purpose**: Form submission tracking and data
```sql
CREATE TABLE form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    form_type VARCHAR(50) NOT NULL,
    form_data JSONB NOT NULL,
    validation_results JSONB,
    submission_status VARCHAR(20) DEFAULT 'pending' CHECK (submission_status IN ('pending', 'validated', 'processed', 'rejected', 'completed')),
    arms_submission_id VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);
```

#### agent_workflows
**Purpose**: AI agent workflow tracking
```sql
CREATE TABLE agent_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    workflow_type VARCHAR(50) NOT NULL,
    intent VARCHAR(100) NOT NULL,
    context JSONB,
    current_step INTEGER DEFAULT 0,
    total_steps INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'paused')),
    agent_responses JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

#### arms_interactions
**Purpose**: ARMS system integration tracking
```sql
CREATE TABLE arms_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_type VARCHAR(50) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    request_payload JSONB,
    response_data JSONB,
    success BOOLEAN NOT NULL,
    processing_time_ms INTEGER,
    user_id UUID REFERENCES users(id),
    form_submission_id UUID REFERENCES form_submissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### fms_transactions
**Purpose**: Financial transaction tracking
```sql
CREATE TABLE fms_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_type VARCHAR(50) NOT NULL,
    participant_id UUID REFERENCES participants(id),
    fms_authorization_id UUID REFERENCES fms_authorizations(id),
    fms_provider VARCHAR(50) NOT NULL,
    transaction_amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    provider_fee DECIMAL(10,2) NOT NULL,
    fms_transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    processed_at TIMESTAMP,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### platform_revenue
**Purpose**: Platform revenue tracking
```sql
CREATE TABLE platform_revenue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    revenue_type VARCHAR(50) NOT NULL,
    participant_id UUID REFERENCES participants(id),
    amount DECIMAL(10,2) NOT NULL,
    source_transaction_id UUID REFERENCES fms_transactions(id),
    billing_period VARCHAR(7), -- YYYY-MM format
    recognized_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'recognized', 'collected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### email_communications
**Purpose**: Email communication tracking
```sql
CREATE TABLE email_communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    communication_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
    sent_at TIMESTAMP,
    user_id UUID REFERENCES users(id),
    form_submission_id UUID REFERENCES form_submissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Additional Tables Required

### Emergency Contacts
**Purpose**: Emergency contact information for participants
```sql
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
    contact_type VARCHAR(20) NOT NULL CHECK (contact_type IN ('emergency', 'family', 'legal_representative', 'healthcare_proxy')),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    is_primary BOOLEAN DEFAULT FALSE,
    can_make_decisions BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Care Advisor Certifications
**Purpose**: Care advisor certification and training tracking
```sql
CREATE TABLE care_advisor_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    care_advisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
    certification_type VARCHAR(50) NOT NULL,
    certification_name VARCHAR(100) NOT NULL,
    issuing_organization VARCHAR(100) NOT NULL,
    certification_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiration_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'revoked')),
    verification_document_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Background Checks
**Purpose**: Detailed background check tracking
```sql
CREATE TABLE background_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_assistant_id UUID REFERENCES personal_assistants(id) ON DELETE CASCADE,
    check_type VARCHAR(50) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    check_number VARCHAR(100),
    initiated_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'expired')),
    result VARCHAR(20) CHECK (result IN ('passed', 'failed', 'conditional')),
    notes TEXT,
    report_url VARCHAR(500),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quality Assurance Audits
**Purpose**: QA audit tracking and compliance monitoring
```sql
CREATE TABLE qa_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_type VARCHAR(50) NOT NULL,
    audit_name VARCHAR(200) NOT NULL,
    participant_id UUID REFERENCES participants(id),
    care_advisor_id UUID REFERENCES users(id),
    auditor_id UUID REFERENCES users(id),
    audit_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    findings JSONB,
    corrective_actions JSONB,
    follow_up_date DATE,
    compliance_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Service Providers
**Purpose**: Service provider network management
```sql
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(200) NOT NULL,
    provider_type VARCHAR(50) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    address_line1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    license_number VARCHAR(100),
    license_expiration DATE,
    service_areas TEXT[], -- Array of service areas
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Communication Preferences
**Purpose**: User communication preferences and accessibility needs
```sql
CREATE TABLE communication_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) DEFAULT 'en',
    accessibility_needs TEXT[],
    communication_method VARCHAR(20) CHECK (communication_method IN ('email', 'phone', 'mail', 'text')),
    notification_frequency VARCHAR(20) CHECK (notification_frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    emergency_contact_preference BOOLEAN DEFAULT TRUE,
    marketing_communications BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Workflow States
**Purpose**: Detailed workflow state management
```sql
CREATE TABLE workflow_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES agent_workflows(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_status VARCHAR(20) DEFAULT 'pending' CHECK (step_status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
    step_data JSONB,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Compliance Documentation
**Purpose**: Compliance and regulatory documentation tracking
```sql
CREATE TABLE compliance_documentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_type VARCHAR(50) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    participant_id UUID REFERENCES participants(id),
    care_advisor_id UUID REFERENCES users(id),
    document_url VARCHAR(500),
    document_hash VARCHAR(64), -- SHA-256 hash for integrity
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    approval_date DATE,
    approved_by UUID REFERENCES users(id),
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Enhanced Field Requirements

### Additional Fields for Existing Tables

#### users table additions:
```sql
ALTER TABLE users ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE users ADD COLUMN timezone VARCHAR(50) DEFAULT 'America/New_York';
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN last_password_change TIMESTAMP;
ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN account_locked_until TIMESTAMP;
```

#### participants table additions:
```sql
ALTER TABLE participants ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE participants ADD COLUMN accessibility_needs TEXT[];
ALTER TABLE participants ADD COLUMN has_legal_representative BOOLEAN DEFAULT FALSE;
ALTER TABLE participants ADD COLUMN legal_representative_name VARCHAR(200);
ALTER TABLE participants ADD COLUMN legal_representative_phone VARCHAR(20);
ALTER TABLE participants ADD COLUMN emergency_contact_required BOOLEAN DEFAULT TRUE;
ALTER TABLE participants ADD COLUMN communication_preferences JSONB;
ALTER TABLE participants ADD COLUMN cultural_considerations TEXT;
ALTER TABLE participants ADD COLUMN transportation_needs TEXT;
ALTER TABLE participants ADD COLUMN dietary_restrictions TEXT;
```

#### care_plans table additions:
```sql
ALTER TABLE care_plans ADD COLUMN risk_assessment JSONB;
ALTER TABLE care_plans ADD COLUMN safety_plan TEXT;
ALTER TABLE care_plans ADD COLUMN family_involvement TEXT;
ALTER TABLE care_plans ADD COLUMN cultural_considerations TEXT;
ALTER TABLE care_plans ADD COLUMN review_frequency VARCHAR(20) DEFAULT 'monthly';
ALTER TABLE care_plans ADD COLUMN next_review_date DATE;
ALTER TABLE care_plans ADD COLUMN care_coordinator_notes TEXT;
```

#### personal_assistants table additions:
```sql
ALTER TABLE personal_assistants ADD COLUMN preferred_language VARCHAR(10) DEFAULT 'en';
ALTER TABLE personal_assistants ADD COLUMN special_training TEXT[];
ALTER TABLE personal_assistants ADD COLUMN availability_schedule JSONB;
ALTER TABLE personal_assistants ADD COLUMN transportation_available BOOLEAN DEFAULT FALSE;
ALTER TABLE personal_assistants ADD COLUMN emergency_contact_name VARCHAR(200);
ALTER TABLE personal_assistants ADD COLUMN emergency_contact_phone VARCHAR(20);
ALTER TABLE personal_assistants ADD COLUMN performance_rating DECIMAL(3,2);
ALTER TABLE personal_assistants ADD COLUMN last_performance_review DATE;
```

---

## Data Relationships

### Primary Relationships
- `users` → `participants` (1:1)
- `users` → `care_advisor_certifications` (1:many)
- `participants` → `care_plans` (1:many)
- `participants` → `emergency_contacts` (1:many)
- `participants` → `fms_authorizations` (1:many)
- `personal_assistants` → `fms_authorizations` (1:many)
- `personal_assistants` → `background_checks` (1:many)
- `agent_workflows` → `workflow_states` (1:many)

### Foreign Key Constraints
```sql
-- Add foreign key constraints
ALTER TABLE emergency_contacts ADD CONSTRAINT fk_emergency_contacts_participant 
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE;

ALTER TABLE care_advisor_certifications ADD CONSTRAINT fk_certifications_advisor 
    FOREIGN KEY (care_advisor_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE background_checks ADD CONSTRAINT fk_background_checks_pa 
    FOREIGN KEY (personal_assistant_id) REFERENCES personal_assistants(id) ON DELETE CASCADE;

ALTER TABLE qa_audits ADD CONSTRAINT fk_qa_audits_participant 
    FOREIGN KEY (participant_id) REFERENCES participants(id);

ALTER TABLE qa_audits ADD CONSTRAINT fk_qa_audits_advisor 
    FOREIGN KEY (care_advisor_id) REFERENCES users(id);

ALTER TABLE qa_audits ADD CONSTRAINT fk_qa_audits_auditor 
    FOREIGN KEY (auditor_id) REFERENCES users(id);

ALTER TABLE communication_preferences ADD CONSTRAINT fk_comm_prefs_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE workflow_states ADD CONSTRAINT fk_workflow_states_workflow 
    FOREIGN KEY (workflow_id) REFERENCES agent_workflows(id) ON DELETE CASCADE;

ALTER TABLE compliance_documentation ADD CONSTRAINT fk_compliance_participant 
    FOREIGN KEY (participant_id) REFERENCES participants(id);

ALTER TABLE compliance_documentation ADD CONSTRAINT fk_compliance_advisor 
    FOREIGN KEY (care_advisor_id) REFERENCES users(id);
```

---

## Security & Compliance

### Data Encryption
```sql
-- Enable PGP encryption for sensitive data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt SSN and other PII
UPDATE participants SET ssn_encrypted = pgp_sym_encrypt(ssn, 'encryption_key') WHERE ssn IS NOT NULL;
UPDATE personal_assistants SET ssn_encrypted = pgp_sym_encrypt(ssn, 'encryption_key') WHERE ssn IS NOT NULL;
```

### Audit Trail
```sql
-- Create audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), current_setting('app.current_user_id')::UUID);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, operation, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id')::UUID);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), current_setting('app.current_user_id')::UUID);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_participants AFTER INSERT OR UPDATE OR DELETE ON participants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_personal_assistants AFTER INSERT OR UPDATE OR DELETE ON personal_assistants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

### Data Retention Policies
```sql
-- Create data retention policy
CREATE TABLE data_retention_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    retention_period_months INTEGER NOT NULL,
    archive_before_delete BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert retention policies
INSERT INTO data_retention_policies (table_name, retention_period_months, archive_before_delete) VALUES
('audit_log', 84, TRUE), -- 7 years
('email_communications', 36, TRUE), -- 3 years
('arms_interactions', 60, TRUE), -- 5 years
('fms_transactions', 84, TRUE); -- 7 years
```

---

## Performance Optimization

### Indexing Strategy
```sql
-- Primary indexes
CREATE INDEX idx_participants_user_id ON participants(user_id);
CREATE INDEX idx_participants_participant_id ON participants(participant_id);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_participants_care_advisor ON participants(care_advisor_id);

-- Care plans indexes
CREATE INDEX idx_care_plans_participant ON care_plans(participant_id);
CREATE INDEX idx_care_plans_status ON care_plans(status);
CREATE INDEX idx_care_plans_effective_date ON care_plans(plan_effective_date);

-- Form submissions indexes
CREATE INDEX idx_form_submissions_user ON form_submissions(user_id);
CREATE INDEX idx_form_submissions_type ON form_submissions(form_type);
CREATE INDEX idx_form_submissions_status ON form_submissions(submission_status);
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions(submitted_at);

-- Workflow indexes
CREATE INDEX idx_agent_workflows_user ON agent_workflows(user_id);
CREATE INDEX idx_agent_workflows_type ON agent_workflows(workflow_type);
CREATE INDEX idx_agent_workflows_status ON agent_workflows(status);

-- ARMS interactions indexes
CREATE INDEX idx_arms_interactions_user ON arms_interactions(user_id);
CREATE INDEX idx_arms_interactions_type ON arms_interactions(interaction_type);
CREATE INDEX idx_arms_interactions_success ON arms_interactions(success);
CREATE INDEX idx_arms_interactions_created_at ON arms_interactions(created_at);

-- FMS transactions indexes
CREATE INDEX idx_fms_transactions_participant ON fms_transactions(participant_id);
CREATE INDEX idx_fms_transactions_type ON fms_transactions(transaction_type);
CREATE INDEX idx_fms_transactions_status ON fms_transactions(status);
CREATE INDEX idx_fms_transactions_processed_at ON fms_transactions(processed_at);

-- Composite indexes for common queries
CREATE INDEX idx_participants_status_enrollment ON participants(status, enrollment_date);
CREATE INDEX idx_care_plans_participant_status ON care_plans(participant_id, status);
CREATE INDEX idx_form_submissions_user_type_status ON form_submissions(user_id, form_type, submission_status);
```

### Query Optimization
```sql
-- Create materialized views for common reports
CREATE MATERIALIZED VIEW participant_summary AS
SELECT 
    p.id,
    p.participant_id,
    p.first_name,
    p.last_name,
    p.status,
    p.enrollment_date,
    p.care_level,
    u.email,
    u.phone,
    COUNT(cp.id) as care_plan_count,
    MAX(cp.plan_effective_date) as latest_care_plan_date
FROM participants p
LEFT JOIN users u ON p.user_id = u.id
LEFT JOIN care_plans cp ON p.id = cp.participant_id
GROUP BY p.id, p.participant_id, p.first_name, p.last_name, p.status, p.enrollment_date, p.care_level, u.email, u.phone;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_participant_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW participant_summary;
END;
$$ LANGUAGE plpgsql;
```

---

## State-Specific Requirements

### North Carolina HCI-CDS Program Fields
```sql
-- Add NC-specific fields to participants table
ALTER TABLE participants ADD COLUMN nc_county VARCHAR(50);
ALTER TABLE participants ADD COLUMN nc_region VARCHAR(50);
ALTER TABLE participants ADD COLUMN medicaid_waiver_type VARCHAR(50);
ALTER TABLE participants ADD COLUMN waiver_slot_number VARCHAR(20);
ALTER TABLE participants ADD COLUMN local_management_entity VARCHAR(100);
ALTER TABLE participants ADD COLUMN care_coordinator_agency VARCHAR(100);

-- Add NC-specific service codes
CREATE TABLE nc_service_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(10) UNIQUE NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    service_category VARCHAR(50) NOT NULL,
    unit_type VARCHAR(20) NOT NULL,
    max_units_per_month INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL,
    expiration_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert NC service codes
INSERT INTO nc_service_codes (service_code, service_name, service_category, unit_type, max_units_per_month, effective_date) VALUES
('PC001', 'Personal Care Services', 'Personal Care', 'hour', 40, '2024-01-01'),
('HM001', 'Homemaker Services', 'Homemaker', 'hour', 20, '2024-01-01'),
('TR001', 'Transportation Services', 'Transportation', 'trip', 20, '2024-01-01'),
('RP001', 'Respite Care Services', 'Respite', 'hour', 16, '2024-01-01'),
('EQ001', 'Equipment and Supplies', 'Equipment', 'item', NULL, '2024-01-01');
```

### Compliance Reporting
```sql
-- Create compliance reporting table
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(50) NOT NULL,
    report_period VARCHAR(7) NOT NULL, -- YYYY-MM format
    report_data JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    submitted_date DATE,
    submitted_by UUID REFERENCES users(id),
    approved_date DATE,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for compliance reporting
CREATE INDEX idx_compliance_reports_type ON compliance_reports(report_type);
CREATE INDEX idx_compliance_reports_period ON compliance_reports(report_period);
CREATE INDEX idx_compliance_reports_status ON compliance_reports(status);
```

---

## Data Validation Rules

### Business Rules
```sql
-- Add check constraints for business rules
ALTER TABLE participants ADD CONSTRAINT chk_participant_age 
    CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years');

ALTER TABLE care_plans ADD CONSTRAINT chk_care_plan_budget 
    CHECK (monthly_budget >= 100 AND monthly_budget <= 5000);

ALTER TABLE fms_authorizations ADD CONSTRAINT chk_fms_hourly_rate 
    CHECK (hourly_rate >= 15 AND hourly_rate <= 50);

ALTER TABLE personal_assistants ADD CONSTRAINT chk_pa_age 
    CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '18 years');
```

### Data Quality Checks
```sql
-- Create data quality monitoring function
CREATE OR REPLACE FUNCTION check_data_quality()
RETURNS TABLE (
    table_name VARCHAR,
    issue_type VARCHAR,
    record_count BIGINT,
    description TEXT
) AS $$
BEGIN
    -- Check for missing required data
    RETURN QUERY
    SELECT 'participants'::VARCHAR, 'missing_ssn'::VARCHAR, COUNT(*)::BIGINT, 'Participants without encrypted SSN'::TEXT
    FROM participants WHERE ssn_encrypted IS NULL;
    
    RETURN QUERY
    SELECT 'personal_assistants'::VARCHAR, 'missing_background_check'::VARCHAR, COUNT(*)::BIGINT, 'PAs without background check'::TEXT
    FROM personal_assistants pa
    LEFT JOIN background_checks bc ON pa.id = bc.personal_assistant_id
    WHERE bc.id IS NULL AND pa.is_active = TRUE;
    
    RETURN QUERY
    SELECT 'care_plans'::VARCHAR, 'expired_plans'::VARCHAR, COUNT(*)::BIGINT, 'Care plans past expiration'::TEXT
    FROM care_plans 
    WHERE status = 'active' AND plan_effective_date < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;
```

---

## Summary

This comprehensive data dictionary provides the foundation for the HCI-CDS Forms Management System database design. It includes:

1. **Complete schema documentation** for all existing and new tables
2. **Enhanced field requirements** based on workflow analysis
3. **Proper data relationships** with foreign key constraints
4. **Security and compliance** measures including encryption and audit trails
5. **Performance optimization** through strategic indexing
6. **State-specific requirements** for North Carolina HCI-CDS program
7. **Data validation rules** and quality monitoring

The database design supports all identified human interaction workflows while maintaining data integrity, security, and performance requirements for the North Carolina Health Care Innovation and Community Development Services program.
