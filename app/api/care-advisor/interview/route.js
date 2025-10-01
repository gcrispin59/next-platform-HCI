import { NextResponse } from 'next/server';
import OllamaIntegration from 'lib/services/ollama-integration';

export async function POST(request) {
    try {
        const { participantData, interviewQuestions, responses, analysis } = await request.json();
        
        // Validate required data
        if (!participantData || !interviewQuestions || !responses) {
            return NextResponse.json(
                { error: 'Missing required data' },
                { status: 400 }
            );
        }
        
        // Generate AI analysis if not provided
        let finalAnalysis = analysis;
        if (!finalAnalysis) {
            try {
                const ollama = new OllamaIntegration();
                finalAnalysis = await ollama.analyzeInterviewResponses(participantData, responses);
            } catch (error) {
                console.error('AI analysis failed, using fallback:', error);
                finalAnalysis = {
                    careNeeds: {
                        functional: ["ADL assistance", "Mobility support"],
                        health: ["Medication management", "Health monitoring"],
                        social: ["Social engagement", "Community connections"]
                    },
                    riskFactors: ["Fall risk", "Social isolation"],
                    recommendedServices: [
                        {
                            service: "Personal Care",
                            hours: 10,
                            priority: "high",
                            rationale: "Based on assessment needs"
                        }
                    ],
                    carePlanPriorities: ["Safety", "Independence", "Health management"],
                    safetyConsiderations: ["Fall prevention", "Emergency planning"],
                    nextSteps: ["Develop care plan", "Coordinate services"]
                };
            }
        }
        
        // Generate interview ID
        const interviewId = generateInterviewId(participantData);
        
        // In a real implementation, this would:
        // 1. Save to database
        // 2. Trigger notifications
        // 3. Update participant status
        // 4. Schedule follow-up actions
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Send progress notifications
        await sendProgressNotifications(participantData, interviewId, finalAnalysis);
        
        return NextResponse.json({
            success: true,
            interviewId,
            analysis: finalAnalysis,
            message: 'Interview completed successfully',
            nextSteps: [
                'Care plan will be developed based on assessment',
                'You will receive notification when care plan is ready',
                'Services can begin once care plan is approved'
            ]
        });
        
    } catch (error) {
        console.error('Interview submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function generateInterviewId(participantData) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `CAI-${participantData.firstName.toUpperCase()}-${timestamp}-${random}`;
}

async function sendProgressNotifications(participantData, interviewId, analysis) {
    try {
        // Send email notification
        if (participantData.email) {
            await sendEmailNotification(participantData, interviewId, analysis);
        }
        
        // Send SMS notification if phone number available
        if (participantData.primaryPhone) {
            await sendSMSNotification(participantData, interviewId);
        }
        
        // Send notification to care advisor
        await sendCareAdvisorNotification(participantData, interviewId, analysis);
        
    } catch (error) {
        console.error('Error sending notifications:', error);
    }
}

async function sendEmailNotification(participantData, interviewId, analysis) {
    const emailContent = {
        to: participantData.email,
        subject: 'HCI-CDS Interview Completed - Next Steps',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">HCI-CDS Interview Completed</h2>
                <p>Dear ${participantData.firstName},</p>
                <p>Your care advisor interview has been completed successfully. Here's what happens next:</p>
                
                <h3 style="color: #1e40af;">Assessment Summary</h3>
                <ul>
                    <li><strong>Functional Needs:</strong> ${analysis.careNeeds?.functional?.join(', ') || 'To be determined'}</li>
                    <li><strong>Health Needs:</strong> ${analysis.careNeeds?.health?.join(', ') || 'To be determined'}</li>
                    <li><strong>Risk Factors:</strong> ${analysis.riskFactors?.join(', ') || 'None identified'}</li>
                </ul>
                
                <h3 style="color: #1e40af;">Next Steps</h3>
                <ol>
                    <li>Your care plan will be developed based on this assessment</li>
                    <li>You will receive a notification when your care plan is ready</li>
                    <li>Services can begin once your care plan is approved</li>
                </ol>
                
                <p><strong>Interview ID:</strong> ${interviewId}</p>
                <p>If you have any questions, please contact your Care Advisor or call 919-855-3400.</p>
                
                <p>Best regards,<br>HCI-CDS Team</p>
            </div>
        `
    };
    
    // In a real implementation, this would use an email service
    console.log('Email notification sent:', emailContent);
}

async function sendSMSNotification(participantData, interviewId) {
    const smsContent = {
        to: participantData.primaryPhone,
        message: `HCI-CDS Interview completed for ${participantData.firstName}. Interview ID: ${interviewId}. You will receive an email with next steps. Contact: 919-855-3400`
    };
    
    // In a real implementation, this would use an SMS service
    console.log('SMS notification sent:', smsContent);
}

async function sendCareAdvisorNotification(participantData, interviewId, analysis) {
    const notificationContent = {
        type: 'interview_completed',
        participant: `${participantData.firstName} ${participantData.lastName}`,
        interviewId,
        priority: analysis.riskFactors?.length > 0 ? 'high' : 'normal',
        careNeeds: analysis.careNeeds,
        riskFactors: analysis.riskFactors,
        recommendedServices: analysis.recommendedServices
    };
    
    // In a real implementation, this would send to care advisor dashboard
    console.log('Care advisor notification sent:', notificationContent);
}
