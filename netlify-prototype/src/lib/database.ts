/**
 * NC HCI-CDS Database Connection
 * Neon PostgreSQL Serverless Integration
 */

import { neon } from '@neondatabase/serverless';

let dbClient: ReturnType<typeof neon> | null = null;

export function getDatabase() {
  if (!dbClient) {
    const databaseUrl = Netlify.env.get('NEON_DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error('NEON_DATABASE_URL environment variable is not set');
    }
    
    dbClient = neon(databaseUrl);
  }
  
  return dbClient;
}

export interface QueryOptions {
  values?: any[];
  timeout?: number;
}

/**
 * Execute a database query with error handling
 */
export async function query<T = any>(
  sql: string,
  options: QueryOptions = {}
): Promise<T[]> {
  try {
    const db = getDatabase();
    const result = await db(sql, options.values);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Transaction wrapper for multiple queries
 */
export async function transaction<T>(
  callback: (db: ReturnType<typeof neon>) => Promise<T>
): Promise<T> {
  const db = getDatabase();
  
  try {
    await db('BEGIN');
    const result = await callback(db);
    await db('COMMIT');
    return result;
  } catch (error) {
    await db('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Initialize database with HCI-CDS schema
 */
export async function initializeDatabase() {
  const db = getDatabase();
  
  // Read schema from uploaded schema.sql
  // This should be executed once during initial setup
  
  await db(`
    -- Create base tables if they don't exist
    CREATE TABLE IF NOT EXISTS participants (
      participant_id SERIAL PRIMARY KEY,
      ssn VARCHAR(11) UNIQUE,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255),
      address TEXT,
      city VARCHAR(100),
      state VARCHAR(2) DEFAULT 'NC',
      zip_code VARCHAR(10),
      enrollment_date DATE DEFAULT CURRENT_DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS personal_assistants (
      pa_id SERIAL PRIMARY KEY,
      ssn VARCHAR(11) UNIQUE,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE NOT NULL,
      phone VARCHAR(20),
      email VARCHAR(255),
      address TEXT,
      hourly_rate DECIMAL(10,2),
      background_check_status VARCHAR(50),
      background_check_date DATE,
      hire_date DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS care_advisors (
      advisor_id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20),
      certification_number VARCHAR(50),
      certification_date DATE,
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS care_plans (
      plan_id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(participant_id),
      advisor_id INTEGER REFERENCES care_advisors(advisor_id),
      start_date DATE NOT NULL,
      review_date DATE,
      monthly_budget DECIMAL(10,2),
      authorized_hours INTEGER,
      status VARCHAR(20) DEFAULT 'active',
      care_goals TEXT,
      backup_plan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS service_authorizations (
      authorization_id SERIAL PRIMARY KEY,
      participant_id INTEGER REFERENCES participants(participant_id),
      pa_id INTEGER REFERENCES personal_assistants(pa_id),
      care_plan_id INTEGER REFERENCES care_plans(plan_id),
      start_date DATE NOT NULL,
      end_date DATE,
      authorized_hours_weekly INTEGER,
      hourly_rate DECIMAL(10,2),
      status VARCHAR(20) DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS timesheet_entries (
      entry_id SERIAL PRIMARY KEY,
      authorization_id INTEGER REFERENCES service_authorizations(authorization_id),
      service_date DATE NOT NULL,
      hours_worked DECIMAL(4,2) NOT NULL,
      approved BOOLEAN DEFAULT FALSE,
      approved_by INTEGER REFERENCES care_advisors(advisor_id),
      approved_date TIMESTAMP,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_agent_logs (
      log_id SERIAL PRIMARY KEY,
      agent_type VARCHAR(50) NOT NULL,
      user_id VARCHAR(100),
      session_id UUID NOT NULL,
      task_description TEXT,
      input_data JSONB,
      output_data JSONB,
      execution_time_ms INTEGER,
      status VARCHAR(20),
      error_message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS forms_generated (
      form_id SERIAL PRIMARY KEY,
      form_type VARCHAR(100) NOT NULL,
      participant_id INTEGER REFERENCES participants(participant_id),
      generated_by VARCHAR(50),
      form_data JSONB NOT NULL,
      status VARCHAR(20) DEFAULT 'draft',
      submitted_to_arms BOOLEAN DEFAULT FALSE,
      arms_submission_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_participants_status ON participants(status);
    CREATE INDEX IF NOT EXISTS idx_pa_status ON personal_assistants(status);
    CREATE INDEX IF NOT EXISTS idx_care_plans_participant ON care_plans(participant_id);
    CREATE INDEX IF NOT EXISTS idx_authorizations_participant ON service_authorizations(participant_id);
    CREATE INDEX IF NOT EXISTS idx_timesheet_authorization ON timesheet_entries(authorization_id);
    CREATE INDEX IF NOT EXISTS idx_timesheet_date ON timesheet_entries(service_date);
    CREATE INDEX IF NOT EXISTS idx_ai_logs_session ON ai_agent_logs(session_id);
    CREATE INDEX IF NOT EXISTS idx_forms_participant ON forms_generated(participant_id);
  `);

  console.log('Database initialized successfully');
}
