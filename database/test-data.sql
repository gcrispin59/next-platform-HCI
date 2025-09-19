-- Test data for HCI-Forms Platform development
-- This file populates the database with realistic test data for development and testing

-- Test Users
INSERT INTO users (id, email, password_hash, first_name, last_name, role, phone, email_verified, is_active) VALUES
('00000000-0000-0000-0000-000000000001', 'participant1@test.com', '$2b$10$testhashedpassword1', 'John', 'Doe', 'participant', '919-555-0101', true, true),
('00000000-0000-0000-0000-000000000002', 'participant2@test.com', '$2b$10$testhashedpassword2', 'Jane', 'Smith', 'participant', '919-555-0102', true, true),
('00000000-0000-0000-0000-000000000003', 'careadvisor1@test.com', '$2b$10$testhashedpassword3', 'Dr. Sarah', 'Johnson', 'care_advisor', '919-555-0201', true, true),
('00000000-0000-0000-0000-000000000004', 'admin@test.com', '$2b$10$testhashedpassword4', 'Admin', 'User', 'administrator', '919-555-0301', true, true),
('00000000-0000-0000-0000-000000000005', 'participant3@test.com', '$2b$10$testhashedpassword5', 'Robert', 'Wilson', 'participant', '919-555-0103', true, true);

-- Test Participants
INSERT INTO participants (id, user_id, participant_id, ssn_encrypted, date_of_birth, gender, medicaid_number, 
                        address_line1, city, state, zip_code, primary_phone, preferred_contact, 
                        primary_diagnosis, care_level, enrollment_date, status, care_advisor_id) VALUES
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'P000001', 
 pgp_sym_encrypt('123-45-6789', 'encryption_key'), '1945-03-15', 'Male', 'NC123456789',
 '123 Main Street', 'Raleigh', 'NC', '27601', '919-555-0101', 'phone',
 'Alzheimer Disease', 'Level 2', '2024-01-15', 'active', '00000000-0000-0000-0000-000000000003'),

('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000002', 'P000002',
 pgp_sym_encrypt('987-65-4321', 'encryption_key'), '1950-08-22', 'Female', 'NC987654321',
 '456 Oak Avenue', 'Charlotte', 'NC', '28202', '919-555-0102', 'phone',
 'Diabetes with complications', 'Level 1', '2024-02-01', 'active', '00000000-0000-0000-0000-000000000003'),

('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000005', 'P000003',
 pgp_sym_encrypt('555-12-3456', 'encryption_key'), '1955-12-10', 'Male', 'NC555123456',
 '789 Pine Street', 'Greensboro', 'NC', '27401', '919-555-0103', 'email',
 'Chronic kidney disease', 'Level 3', '2024-03-01', 'pending', '00000000-0000-0000-0000-000000000003');

-- Test Care Plans
INSERT INTO care_plans (id, participant_id, plan_effective_date, care_advisor_id, primary_goal, 
                      secondary_goals, goal_timeframe, weekly_hours, preferred_days, preferred_time,
                      monthly_budget, budget_categories, status, approved_date, approved_by, version) VALUES
('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', '2024-02-01', 
 '00000000-0000-0000-0000-000000000003', 
 'Maintain independence in daily living activities with minimal assistance',
 'Improve medication compliance and maintain social connections',
 '6 months', 20.0, ARRAY['Monday', 'Wednesday', 'Friday'], 'Morning',
 1200.00, ARRAY['Personal Care', 'Homemaker', 'Transportation'], 'approved', '2024-01-20', 
 '00000000-0000-0000-0000-000000000003', 1),

('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000102', '2024-02-15',
 '00000000-0000-0000-0000-000000000003',
 'Manage diabetes effectively and maintain healthy diet',
 'Increase physical activity and social engagement',
 '3 months', 15.0, ARRAY['Tuesday', 'Thursday', 'Saturday'], 'Afternoon',
 900.00, ARRAY['Personal Care', 'Homemaker'], 'approved', '2024-02-05',
 '00000000-0000-0000-0000-000000000003', 1),

('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000103', '2024-03-15',
 '00000000-0000-0000-0000-000000000003',
 'Prepare for dialysis and maintain quality of life',
 'Family caregiver support and transportation coordination',
 '12 months', 25.0, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 'Flexible',
 1500.00, ARRAY['Personal Care', 'Transportation', 'Respite Care'], 'draft', NULL, NULL, 1);

-- Test Personal Assistants
INSERT INTO personal_assistants (id, first_name, last_name, ssn_encrypted, phone, email,
                               address_line1, city, state, zip_code, date_of_birth,
                               background_check_status, background_check_date, certification_status,
                               certification_date, is_active) VALUES
('00000000-0000-0000-0000-000000000301', 'Maria', 'Garcia', 
 pgp_sym_encrypt('111-22-3333', 'encryption_key'), '919-555-1001', 'maria.garcia@email.com',
 '321 Helper Lane', 'Raleigh', 'NC', '27603', '1990-05-15',
 'approved', '2024-01-10', 'certified', '2024-01-15', true),

('00000000-0000-0000-0000-000000000302', 'David', 'Brown',
 pgp_sym_encrypt('444-55-6666', 'encryption_key'), '919-555-1002', 'david.brown@email.com',
 '654 Care Street', 'Charlotte', 'NC', '28204', '1985-09-20',
 'approved', '2024-01-25', 'certified', '2024-02-01', true),

('00000000-0000-0000-0000-000000000303', 'Linda', 'Anderson',
 pgp_sym_encrypt('777-88-9999', 'encryption_key'), '919-555-1003', 'linda.anderson@email.com',
 '987 Support Ave', 'Greensboro', 'NC', '27405', '1988-12-03',
 'pending', NULL, 'pending', NULL, true);

-- Test FMS Authorizations
INSERT INTO fms_authorizations (id, participant_id, personal_assistant_id, authorization_number,
                              fms_provider, fms_account_id, fms_employee_id, service_hours,
                              hourly_rate, start_date, end_date, status, approved_date, approved_by) VALUES
('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000101', 
 '00000000-0000-0000-0000-000000000301', 'AUTH-2024-001', 'gusto', 'GUSTO-COMP-001', 
 'GUSTO-EMP-001', 20.0, 18.50, '2024-02-01', '2025-01-31', 'approved', '2024-01-25',
 '00000000-0000-0000-0000-000000000003'),

('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000102',
 '00000000-0000-0000-0000-000000000302', 'AUTH-2024-002', 'gusto', 'GUSTO-COMP-002',
 'GUSTO-EMP-002', 15.0, 17.25, '2024-02-15', '2025-02-14', 'approved', '2024-02-10',
 '00000000-0000-0000-0000-000000000003'),

('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000103',
 '00000000-0000-0000-0000-000000000303', 'AUTH-2024-003', 'gusto', NULL, NULL,
 25.0, 19.00, '2024-03-15', '2025-03-14', 'pending', NULL, NULL);

-- Test Form Submissions
INSERT INTO form_submissions (id, user_id, form_type, form_data, validation_results,
                            submission_status, arms_submission_id, submitted_at, processed_at) VALUES
('00000000-0000-0000-0000-000000000501', '00000000-0000-0000-0000-000000000001',
 'participant_enrollment', 
 '{
   "firstName": "John",
   "lastName": "Doe",
   "ssn": "123-45-6789",
   "dob": "1945-03-15",
   "medicaidNumber": "NC123456789",
   "primaryPhone": "919-555-0101"
 }',
 '{
   "isValid": true,
   "errors": {},
   "warnings": []
 }',
 'processed', 'HCI-SUB-1704067200-abc123', '2024-01-15T10:30:00Z', '2024-01-15T10:35:00Z'),

('00000000-0000-0000-0000-000000000502', '00000000-0000-0000-0000-000000000002',
 'care_plan',
 '{
   "participantId": "P000002",
   "planEffectiveDate": "2024-02-15",
   "primaryGoal": "Manage diabetes effectively",
   "weeklyHours": 15,
   "monthlyBudget": 900
 }',
 '{
   "isValid": true,
   "errors": {},
   "warnings": []
 }',
 'processed', 'HCI-SUB-1706140800-def456', '2024-02-01T14:15:00Z', '2024-02-01T14:20:00Z');

-- Test Agent Workflows
INSERT INTO agent_workflows (id, user_id, workflow_type, intent, context, current_step, 
                           total_steps, status, agent_responses, started_at, completed_at) VALUES
('00000000-0000-0000-0000-000000000601', '00000000-0000-0000-0000-000000000001',
 'participant_onboarding', 'participant_onboarding',
 '{
   "userRole": "participant",
   "hasRepresentative": false,
   "preferredLanguage": "English"
 }',
 3, 3, 'completed',
 '[
   {
     "agentId": "coordinator",
     "step": "eligibility_check",
     "response": "Participant meets eligibility criteria",
     "timestamp": "2024-01-15T10:15:00Z"
   },
   {
     "agentId": "forms_specialist",
     "step": "form_generation", 
     "response": "Enrollment form generated successfully",
     "timestamp": "2024-01-15T10:20:00Z"
   },
   {
     "agentId": "arms_integrator",
     "step": "arms_integration",
     "response": "Submission processed by ARMS",
     "timestamp": "2024-01-15T10:35:00Z"
   }
 ]',
 '2024-01-15T10:10:00Z', '2024-01-15T10:35:00Z');

-- Test ARMS Interactions
INSERT INTO arms_interactions (id, interaction_type, endpoint, request_payload, response_data,
                             success, processing_time_ms, user_id, form_submission_id) VALUES
('00000000-0000-0000-0000-000000000701', 'submission', '/api/v1/participants',
 '{
   "queryType": "ParticipantEnrollment",
   "participantData": {
     "firstName": "John",
     "lastName": "Doe"
   }
 }',
 '{
   "status": "Success",
   "participantId": "P000001",
   "processedAt": "2024-01-15T10:35:00Z"
 }',
 true, 1250, '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000501'),

('00000000-0000-0000-0000-000000000702', 'query', '/api/v1/eligibility',
 '{
   "queryType": "EligibilityCheck",
   "participantId": "P000001",
   "serviceCode": "PC001"
 }',
 '{
   "status": "Eligible",
   "serviceCode": "PC001",
   "effectiveDate": "2024-02-01"
 }',
 true, 850, '00000000-0000-0000-0000-000000000001', NULL);

-- Test FMS Transactions
INSERT INTO fms_transactions (id, transaction_type, participant_id, fms_authorization_id,
                            fms_provider, transaction_amount, platform_fee, provider_fee,
                            fms_transaction_id, status, processed_at, period_start, period_end) VALUES
('00000000-0000-0000-0000-000000000801', 'setup_fee', '00000000-0000-0000-0000-000000000101',
 '00000000-0000-0000-0000-000000000401', 'gusto', 25.00, 7.50, 17.50,
 'GUSTO-TXN-001', 'completed', '2024-02-01T09:00:00Z', '2024-02-01', '2024-02-01'),

('00000000-0000-0000-0000-000000000802', 'monthly_payroll', '00000000-0000-0000-0000-000000000101',
 '00000000-0000-0000-0000-000000000401', 'gusto', 1610.00, 40.25, 60.38,
 'GUSTO-TXN-002', 'completed', '2024-02-28T23:59:00Z', '2024-02-01', '2024-02-29'),

('00000000-0000-0000-0000-000000000803', 'monthly_payroll', '00000000-0000-0000-0000-000000000102',
 '00000000-0000-0000-0000-000000000402', 'gusto', 1121.25, 28.03, 42.05,
 'GUSTO-TXN-003', 'completed', '2024-02-28T23:59:00Z', '2024-02-01', '2024-02-29');

-- Test Platform Revenue
INSERT INTO platform_revenue (id, revenue_type, participant_id, amount, source_transaction_id,
                            billing_period, recognized_date, status) VALUES
('00000000-0000-0000-0000-000000000901', 'setup_fee', '00000000-0000-0000-0000-000000000101',
 7.50, '00000000-0000-0000-0000-000000000801', '2024-02', '2024-02-01', 'recognized'),

('00000000-0000-0000-0000-000000000902', 'transaction_fee', '00000000-0000-0000-0000-000000000101',
 40.25, '00000000-0000-0000-0000-000000000802', '2024-02', '2024-02-29', 'recognized'),

('00000000-0000-0000-0000-000000000903', 'transaction_fee', '00000000-0000-0000-0000-000000000102',
 28.03, '00000000-0000-0000-0000-000000000803', '2024-02', '2024-02-29', 'recognized');

-- Test Email Communications
INSERT INTO email_communications (id, communication_type, recipient_email, sender_email,
                                subject, message_id, status, sent_at, user_id, form_submission_id) VALUES
('00000000-0000-0000-0000-000000001001', 'arms_submission', 'arms-submissions@nc.gov',
 'noreply@hci-forms.netlify.app', 'HCI-CDS participant_enrollment Submission - 01/15/2024',
 'sg-msg-12345abcde', 'sent', '2024-01-15T10:30:00Z', '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0000-000000000501'),

('00000000-0000-0000-0000-000000001002', 'notification', 'participant1@test.com',
 'noreply@hci-forms.netlify.app', 'Welcome to HCI-CDS Program',
 'sg-msg-67890fghij', 'sent', '2024-01-15T11:00:00Z', '00000000-0000-0000-0000-000000000001',
 NULL),

('00000000-0000-0000-0000-000000001003', 'notification', 'participant2@test.com',
 'noreply@hci-forms.netlify.app', 'Care Plan Approved',
 'sg-msg-11111klmno', 'sent', '2024-02-05T09:15:00Z', '00000000-0000-0000-0000-000000000002',
 NULL);

-- Update sequences (if using SERIAL instead of UUID)
-- SELECT setval('users_id_seq', 5);
-- SELECT setval('participants_id_seq', 3);
-- ... etc for other sequences

-- Create some indexes for better performance with test data
CREATE INDEX IF NOT EXISTS idx_test_participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS idx_test_care_plans_status ON care_plans(status);
CREATE INDEX IF NOT EXISTS idx_test_fms_auth_status ON fms_authorizations(status);
CREATE INDEX IF NOT EXISTS idx_test_form_submissions_status ON form_submissions(submission_status);

-- Refresh table statistics after inserting test data
ANALYZE users;
ANALYZE participants;
ANALYZE care_plans;
ANALYZE personal_assistants;
ANALYZE fms_authorizations;
ANALYZE form_submissions;
ANALYZE agent_workflows;
ANALYZE arms_interactions;
ANALYZE fms_transactions;
ANALYZE platform_revenue;
ANALYZE email_communications;

-- Display summary of test data inserted
SELECT 'Test data summary:' as message;
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Participants', COUNT(*) FROM participants
UNION ALL
SELECT 'Care Plans', COUNT(*) FROM care_plans
UNION ALL
SELECT 'Personal Assistants', COUNT(*) FROM personal_assistants
UNION ALL
SELECT 'FMS Authorizations', COUNT(*) FROM fms_authorizations
UNION ALL
SELECT 'Form Submissions', COUNT(*) FROM form_submissions
UNION ALL
SELECT 'Agent Workflows', COUNT(*) FROM agent_workflows
UNION ALL
SELECT 'ARMS Interactions', COUNT(*) FROM arms_interactions
UNION ALL
SELECT 'FMS Transactions', COUNT(*) FROM fms_transactions
UNION ALL
SELECT 'Platform Revenue', COUNT(*) FROM platform_revenue
UNION ALL
SELECT 'Email Communications', COUNT(*) FROM email_communications;