/**
 * Participant Management Endpoint
 * CRUD operations for participants
 */

import type { Context, Config } from "@netlify/functions";
import { query } from "../../src/lib/database";

export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const participantId = url.searchParams.get('id');

  try {
    switch (req.method) {
      case 'GET':
        if (participantId) {
          // Get single participant
          const participants = await query(
            `SELECT * FROM participants WHERE participant_id = $1`,
            { values: [participantId] }
          );
          
          if (participants.length === 0) {
            return new Response(JSON.stringify({ error: 'Participant not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            });
          }

          return new Response(JSON.stringify(participants[0]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } else {
          // Get all participants
          const participants = await query(
            `SELECT * FROM participants ORDER BY created_at DESC LIMIT 100`
          );
          
          return new Response(JSON.stringify(participants), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

      case 'POST':
        const createData = await req.json();
        const { 
          ssn, first_name, last_name, date_of_birth, 
          phone, email, address, city, zip_code 
        } = createData;

        const newParticipants = await query(
          `INSERT INTO participants (
            ssn, first_name, last_name, date_of_birth,
            phone, email, address, city, zip_code
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING *`,
          { 
            values: [
              ssn, first_name, last_name, date_of_birth,
              phone, email, address, city, zip_code
            ] 
          }
        );

        return new Response(JSON.stringify(newParticipants[0]), {
          status: 201,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'PUT':
        if (!participantId) {
          return new Response(JSON.stringify({ 
            error: 'Participant ID required for update' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const updateData = await req.json();
        const updates: string[] = [];
        const values: any[] = [];
        let paramCounter = 1;

        // Build dynamic UPDATE query
        Object.entries(updateData).forEach(([key, value]) => {
          if (key !== 'participant_id' && value !== undefined) {
            updates.push(`${key} = $${paramCounter}`);
            values.push(value);
            paramCounter++;
          }
        });

        if (updates.length === 0) {
          return new Response(JSON.stringify({ 
            error: 'No valid fields to update' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        values.push(participantId);
        const updatedParticipants = await query(
          `UPDATE participants 
           SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
           WHERE participant_id = $${paramCounter}
           RETURNING *`,
          { values }
        );

        if (updatedParticipants.length === 0) {
          return new Response(JSON.stringify({ error: 'Participant not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        return new Response(JSON.stringify(updatedParticipants[0]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      case 'DELETE':
        if (!participantId) {
          return new Response(JSON.stringify({ 
            error: 'Participant ID required for deletion' 
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Soft delete by updating status
        await query(
          `UPDATE participants 
           SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
           WHERE participant_id = $1`,
          { values: [participantId] }
        );

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Participant deactivated' 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        });
    }
  } catch (error) {
    console.error('Participant management error:', error);
    
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
  path: "/api/participants"
};
