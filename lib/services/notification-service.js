/**
 * Notification Service
 * Handles email, SMS, and in-app notifications for progress updates
 */

class NotificationService {
    constructor() {
        this.emailService = process.env.EMAIL_SERVICE || 'smtp';
        this.smsService = process.env.SMS_SERVICE || 'twilio';
        this.appUrl = process.env.APP_URL || 'http://localhost:3001';
    }

    /**
     * Send enrollment confirmation
     */
    async sendEnrollmentConfirmation(participantData) {
        const emailContent = {
            to: participantData.email,
            subject: 'HCI-CDS Enrollment Confirmation',
            html: this.generateEnrollmentEmail(participantData)
        };

        const smsContent = {
            to: participantData.primaryPhone,
            message: `HCI-CDS Enrollment confirmed for ${participantData.firstName}. You will receive an email with next steps. Interview scheduled within 2-3 business days.`
        };

        await Promise.all([
            this.sendEmail(emailContent),
            this.sendSMS(smsContent)
        ]);
    }

    /**
     * Send interview scheduling notification
     */
    async sendInterviewScheduling(participantData, interviewDate) {
        const emailContent = {
            to: participantData.email,
            subject: 'HCI-CDS Care Advisor Interview Scheduled',
            html: this.generateInterviewEmail(participantData, interviewDate)
        };

        const smsContent = {
            to: participantData.primaryPhone,
            message: `HCI-CDS Interview scheduled for ${participantData.firstName} on ${interviewDate}. Check your email for details.`
        };

        await Promise.all([
            this.sendEmail(emailContent),
            this.sendSMS(smsContent)
        ]);
    }

    /**
     * Send care plan completion notification
     */
    async sendCarePlanCompletion(participantData, carePlan) {
        const emailContent = {
            to: participantData.email,
            subject: 'HCI-CDS Care Plan Approved',
            html: this.generateCarePlanEmail(participantData, carePlan)
        };

        const smsContent = {
            to: participantData.primaryPhone,
            message: `Care plan approved for ${participantData.firstName}. Services can begin. Check email for details.`
        };

        await Promise.all([
            this.sendEmail(emailContent),
            this.sendSMS(smsContent)
        ]);
    }

    /**
     * Send progress update
     */
    async sendProgressUpdate(participantData, update) {
        const emailContent = {
            to: participantData.email,
            subject: 'HCI-CDS Progress Update',
            html: this.generateProgressEmail(participantData, update)
        };

        const smsContent = {
            to: participantData.primaryPhone,
            message: `HCI-CDS Update: ${update.message} for ${participantData.firstName}.`
        };

        await Promise.all([
            this.sendEmail(emailContent),
            this.sendSMS(smsContent)
        ]);
    }

    /**
     * Send email notification
     */
    async sendEmail(emailContent) {
        try {
            // In a real implementation, this would use an email service
            console.log('Email sent:', emailContent);
            
            // Simulate email sending
            await new Promise(resolve => setTimeout(resolve, 500));
            
            return { success: true, messageId: `email_${Date.now()}` };
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    /**
     * Send SMS notification
     */
    async sendSMS(smsContent) {
        try {
            // In a real implementation, this would use an SMS service
            console.log('SMS sent:', smsContent);
            
            // Simulate SMS sending
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return { success: true, messageId: `sms_${Date.now()}` };
        } catch (error) {
            console.error('SMS sending failed:', error);
            throw error;
        }
    }

    /**
     * Generate enrollment confirmation email
     */
    generateEnrollmentEmail(participantData) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Welcome to HCI-CDS</h2>
                <p>Dear ${participantData.firstName},</p>
                <p>Your enrollment in the Health Care Innovation and Community Development Services program has been confirmed.</p>
                
                <h3 style="color: #1e40af;">What happens next?</h3>
                <ol>
                    <li><strong>Care Advisor Assignment:</strong> A Care Advisor will be assigned to you within 2-3 business days</li>
                    <li><strong>Interview Scheduling:</strong> You will receive a call to schedule your initial assessment</li>
                    <li><strong>Care Plan Development:</strong> Based on your assessment, a personalized care plan will be created</li>
                    <li><strong>Service Coordination:</strong> Services will begin once your care plan is approved</li>
                </ol>
                
                <h3 style="color: #1e40af;">Important Information</h3>
                <ul>
                    <li><strong>Participant ID:</strong> ${participantData.medicaidNumber}</li>
                    <li><strong>Care Level:</strong> ${participantData.careLevel}</li>
                    <li><strong>Primary Diagnosis:</strong> ${participantData.primaryDiagnosis}</li>
                </ul>
                
                <p>If you have any questions, please contact your Care Advisor or call 919-855-3400.</p>
                
                <p>Best regards,<br>HCI-CDS Team</p>
            </div>
        `;
    }

    /**
     * Generate interview scheduling email
     */
    generateInterviewEmail(participantData, interviewDate) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Care Advisor Interview Scheduled</h2>
                <p>Dear ${participantData.firstName},</p>
                <p>Your Care Advisor interview has been scheduled for <strong>${interviewDate}</strong>.</p>
                
                <h3 style="color: #1e40af;">Interview Details</h3>
                <ul>
                    <li><strong>Date:</strong> ${interviewDate}</li>
                    <li><strong>Duration:</strong> 45-60 minutes</li>
                    <li><strong>Format:</strong> Phone or video call</li>
                    <li><strong>Purpose:</strong> Comprehensive assessment of your care needs</li>
                </ul>
                
                <h3 style="color: #1e40af;">What to expect</h3>
                <p>The interview will cover:</p>
                <ul>
                    <li>Daily living activities and independence</li>
                    <li>Health conditions and medications</li>
                    <li>Social support network</li>
                    <li>Safety concerns and risk factors</li>
                    <li>Care preferences and goals</li>
                </ul>
                
                <p>Please have your medication list and any relevant medical documents ready.</p>
                
                <p>If you need to reschedule, please call 919-855-3400 at least 24 hours in advance.</p>
                
                <p>Best regards,<br>HCI-CDS Team</p>
            </div>
        `;
    }

    /**
     * Generate care plan completion email
     */
    generateCarePlanEmail(participantData, carePlan) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Care Plan Approved</h2>
                <p>Dear ${participantData.firstName},</p>
                <p>Your personalized care plan has been approved and services can now begin.</p>
                
                <h3 style="color: #1e40af;">Your Care Plan</h3>
                <ul>
                    <li><strong>Primary Goal:</strong> ${carePlan.primaryGoal}</li>
                    <li><strong>Weekly Hours:</strong> ${carePlan.weeklyHours} hours</li>
                    <li><strong>Monthly Budget:</strong> $${carePlan.monthlyBudget}</li>
                    <li><strong>Service Categories:</strong> ${carePlan.budgetCategories?.join(', ')}</li>
                </ul>
                
                <h3 style="color: #1e40af;">Next Steps</h3>
                <ol>
                    <li><strong>Service Coordination:</strong> Your Care Advisor will coordinate with service providers</li>
                    <li><strong>Service Start:</strong> Services will begin within 1-2 weeks</li>
                    <li><strong>Regular Reviews:</strong> Your care plan will be reviewed every 6 months</li>
                    <li><strong>Ongoing Support:</strong> Your Care Advisor will provide ongoing support</li>
                </ol>
                
                <p>If you have any questions about your care plan, please contact your Care Advisor or call 919-855-3400.</p>
                
                <p>Best regards,<br>HCI-CDS Team</p>
            </div>
        `;
    }

    /**
     * Generate progress update email
     */
    generateProgressEmail(participantData, update) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">HCI-CDS Progress Update</h2>
                <p>Dear ${participantData.firstName},</p>
                <p>${update.message}</p>
                
                <h3 style="color: #1e40af;">Current Status</h3>
                <ul>
                    <li><strong>Status:</strong> ${update.status}</li>
                    <li><strong>Last Updated:</strong> ${update.timestamp}</li>
                    <li><strong>Next Action:</strong> ${update.nextAction}</li>
                </ul>
                
                <p>If you have any questions, please contact your Care Advisor or call 919-855-3400.</p>
                
                <p>Best regards,<br>HCI-CDS Team</p>
            </div>
        `;
    }
}

export default NotificationService;
