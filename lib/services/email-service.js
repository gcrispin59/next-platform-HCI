import sgMail from '@sendgrid/mail';
import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';

/**
 * Email Service for ARMS Integration
 * Handles XML document transmission to NC ARMS via email
 */
export class EmailService {
  static isInitialized = false;

  static initialize() {
    if (!this.isInitialized && HCI_FORMS_CONFIG.email.apiKey) {
      sgMail.setApiKey(HCI_FORMS_CONFIG.email.apiKey);
      this.isInitialized = true;
    }
  }

  static async sendXMLSubmission(xmlContent, submissionType) {
    this.initialize();
    
    try {
      const attachmentFilename = this.generateXMLFilename(submissionType);
      
      const msg = {
        to: HCI_FORMS_CONFIG.email.recipients.arms_submissions,
        from: {
          email: HCI_FORMS_CONFIG.email.recipients.admin_notifications,
          name: 'HCI-Forms Platform'
        },
        subject: `HCI-CDS ${submissionType} Submission - ${new Date().toLocaleDateString()}`,
        text: this.buildEmailBodyText(submissionType),
        html: this.buildEmailBodyHTML(submissionType),
        attachments: [
          {
            content: Buffer.from(xmlContent, 'utf8').toString('base64'),
            filename: attachmentFilename,
            type: 'application/xml',
            disposition: 'attachment'
          }
        ],
        // Email tracking and compliance
        trackingSettings: {
          clickTracking: { enable: false },
          openTracking: { enable: true },
          subscriptionTracking: { enable: false }
        },
        mailSettings: {
          bypassListManagement: { enable: false },
          footer: { enable: false },
          sandboxMode: { enable: HCI_FORMS_CONFIG.environment === 'development' }
        }
      };

      const response = await sgMail.send(msg);
      
      // Log successful transmission
      await this.logEmailSubmission({
        submissionType,
        recipient: msg.to,
        filename: attachmentFilename,
        messageId: response[0].headers['x-message-id'],
        status: 'sent',
        timestamp: new Date().toISOString()
      });

      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        filename: attachmentFilename,
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Email transmission error:', error);
      
      await this.logEmailSubmission({
        submissionType,
        error: error.message,
        status: 'failed',
        timestamp: new Date().toISOString()
      });
      
      throw new Error(`Email transmission failed: ${error.message}`);
    }
  }

  static async sendNotification(recipients, subject, message, options = {}) {
    this.initialize();
    
    try {
      const msg = {
        to: Array.isArray(recipients) ? recipients : [recipients],
        from: {
          email: HCI_FORMS_CONFIG.email.recipients.admin_notifications,
          name: 'HCI-Forms Platform'
        },
        subject: subject,
        text: message,
        html: options.html || this.convertTextToHTML(message),
        ...(options.templateId && {
          templateId: options.templateId,
          dynamicTemplateData: options.templateData || {}
        })
      };

      const response = await sgMail.send(msg);
      
      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        sentAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Notification email error:', error);
      throw new Error(`Notification failed: ${error.message}`);
    }
  }

  static buildEmailBodyText(submissionType) {
    const timestamp = new Date().toLocaleString();
    
    return `
NC ARMS HCI-CDS Submission

Submission Type: ${submissionType}
Submission Date: ${timestamp}
Source System: HCI-Forms Platform v${HCI_FORMS_CONFIG.version}

Please find the attached XML document for processing in the NC ARMS system.

This is an automated submission from the HCI-CDS Forms Platform.

For questions or issues, please contact:
${HCI_FORMS_CONFIG.email.recipients.admin_notifications}

System Information:
- Platform Version: ${HCI_FORMS_CONFIG.version}
- Environment: ${HCI_FORMS_CONFIG.environment}
- Submission ID: Please refer to XML document header

Thank you,
HCI-CDS Forms Platform
    `.trim();
  }

  static buildEmailBodyHTML(submissionType) {
    const timestamp = new Date().toLocaleString();
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>HCI-CDS Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
    .info-box { background-color: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0; }
    .footer { background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px; }
    .highlight { background-color: #fef3c7; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NC ARMS HCI-CDS Submission</h1>
    </div>
    
    <div class="content">
      <div class="info-box">
        <h3>Submission Details</h3>
        <p><strong>Type:</strong> <span class="highlight">${submissionType}</span></p>
        <p><strong>Date:</strong> ${timestamp}</p>
        <p><strong>Source:</strong> HCI-Forms Platform v${HCI_FORMS_CONFIG.version}</p>
      </div>
      
      <div class="info-box">
        <h3>Processing Instructions</h3>
        <p>Please find the attached XML document for processing in the NC ARMS system.</p>
        <p>This is an automated submission from the HCI-CDS Forms Platform.</p>
      </div>
      
      <div class="info-box">
        <h3>Support Information</h3>
        <p><strong>Contact:</strong> ${HCI_FORMS_CONFIG.email.recipients.admin_notifications}</p>
        <p><strong>Environment:</strong> ${HCI_FORMS_CONFIG.environment}</p>
        <p><strong>Submission ID:</strong> Refer to XML document header</p>
      </div>
    </div>
    
    <div class="footer">
      <p>HCI-CDS Forms Platform | North Carolina Department of Medical Assistance</p>
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  static generateXMLFilename(submissionType) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const timeString = new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
    const random = Math.random().toString(36).substr(2, 6);
    
    return `HCI-${submissionType}-${timestamp}-${timeString}-${random}.xml`;
  }

  static convertTextToHTML(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      .replace(/  /g, '&nbsp;&nbsp;');
  }

  static async logEmailSubmission(logData) {
    try {
      // In production, this would write to database
      console.log('Email Submission Log:', logData);
      
      // TODO: Implement database logging
      // await DatabaseService.logEmailSubmission(logData);
    } catch (error) {
      console.error('Failed to log email submission:', error);
    }
  }

  // Utility methods for email management
  static async sendWelcomeEmail(participantData) {
    const subject = 'Welcome to HCI-CDS Program';
    const message = `
Dear ${participantData.firstName} ${participantData.lastName},

Welcome to the North Carolina Home and Community Care Services (HCI-CDS) program!

Your enrollment has been successfully submitted and is currently being processed.

What happens next:
1. Your application will be reviewed within 5-7 business days
2. You will be contacted by a Care Advisor to discuss your care plan
3. Once approved, services can begin

If you have any questions, please contact your assigned Care Advisor or call our main office.

Thank you for choosing HCI-CDS.

Best regards,
HCI-CDS Program Team
    `;

    return await this.sendNotification(
      participantData.email,
      subject,
      message,
      { templateId: HCI_FORMS_CONFIG.email.templates.notification }
    );
  }

  static async sendStatusUpdateEmail(recipientEmail, statusUpdate) {
    const subject = `HCI-CDS Application Status Update`;
    const message = `
Your HCI-CDS application status has been updated:

Status: ${statusUpdate.status}
Date: ${new Date().toLocaleDateString()}
Comments: ${statusUpdate.comments || 'None'}

For more information, please contact your Care Advisor.

HCI-CDS Program Team
    `;

    return await this.sendNotification(recipientEmail, subject, message);
  }

  static async sendErrorNotification(errorDetails) {
    const subject = `HCI-Forms Platform Error Alert`;
    const message = `
An error occurred in the HCI-Forms platform:

Error Type: ${errorDetails.type}
Timestamp: ${errorDetails.timestamp}
Details: ${errorDetails.message}
User ID: ${errorDetails.userId || 'Unknown'}
Form Type: ${errorDetails.formType || 'Unknown'}

Please investigate and resolve as necessary.

HCI-Forms Platform
    `;

    return await this.sendNotification(
      HCI_FORMS_CONFIG.email.recipients.admin_notifications,
      subject,
      message
    );
  }
}