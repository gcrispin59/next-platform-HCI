# SendGrid Email Service Setup

This guide walks you through setting up SendGrid for the HCI-Forms platform email communications.

## 🚀 Quick Setup

### 1. Create SendGrid Account

1. **Sign up at [SendGrid](https://sendgrid.com)**
   - Choose the **Free Plan** (100 emails/day) for development
   - Or **Essentials Plan** ($19.95/month, 40K emails) for production

2. **Verify Your Account**
   - Complete email verification
   - Provide company information
   - Complete domain verification (recommended)

### 2. Generate API Key

1. **Navigate to Settings > API Keys**
2. **Create API Key**
   - Name: `HCI-Forms-Production` (or `HCI-Forms-Dev`)
   - Permissions: **Full Access** (or **Restricted Access** with specific permissions)
3. **Copy the API Key** - you'll only see it once!

```bash
# Example API key format
SG.XXXXXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Domain Authentication (Recommended)

1. **Navigate to Settings > Sender Authentication**
2. **Authenticate Your Domain**
   - Domain: `your-domain.com` (e.g., `hci-forms.com`)
   - Advanced Settings: Enable all options
3. **Add DNS Records** to your domain provider:

```dns
# CNAME Records (examples)
em1234.your-domain.com    CNAME    u1234.wl123.sendgrid.net
s1._domainkey.your-domain.com    CNAME    s1.domainkey.u1234.wl123.sendgrid.net
s2._domainkey.your-domain.com    CNAME    s2.domainkey.u1234.wl123.sendgrid.net
```

4. **Verify Domain** - may take up to 24 hours

### 4. Environment Configuration

Add to your `.env` file:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_actual_api_key_here
SENDGRID_FROM_EMAIL=noreply@your-domain.com
SENDGRID_FROM_NAME=HCI-Forms Platform
ADMIN_EMAIL=admin@your-domain.com
ARMS_EMAIL_RECIPIENT=arms-submissions@nc.gov

# Email Templates (will be created below)
SENDGRID_TEMPLATE_ARMS=d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_TEMPLATE_NOTIFICATION=d-yyyyyyyyyyyyyyyyyyyyyyyyyyyy
SENDGRID_TEMPLATE_WELCOME=d-zzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
SENDGRID_TEMPLATE_STATUS_UPDATE=d-aaaaaaaaaaaaaaaaaaaaaaaaaaa
```

### 5. Create Email Templates

#### A. ARMS Submission Template

1. **Navigate to Email API > Dynamic Templates**
2. **Create Template**
   - Name: `HCI-ARMS-Submission`
   - Generate Template ID

3. **Template Content:**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>HCI-CDS ARMS Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .info-box { background: white; border: 1px solid #e5e7eb; border-radius: 6px; padding: 15px; margin: 15px 0; }
        .highlight { background-color: #fef3c7; padding: 2px 6px; border-radius: 3px; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px; }
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
                <p><strong>Type:</strong> <span class="highlight">{{submissionType}}</span></p>
                <p><strong>Date:</strong> {{submissionDate}}</p>
                <p><strong>Source:</strong> HCI-Forms Platform v{{platformVersion}}</p>
                <p><strong>Submission ID:</strong> {{submissionId}}</p>
            </div>
            
            <div class="info-box">
                <h3>Processing Instructions</h3>
                <p>Please find the attached XML document for processing in the NC ARMS system.</p>
                <p>This is an automated submission from the HCI-CDS Forms Platform.</p>
            </div>
            
            {{#if participantInfo}}
            <div class="info-box">
                <h3>Participant Information</h3>
                <p><strong>Name:</strong> {{participantInfo.firstName}} {{participantInfo.lastName}}</p>
                <p><strong>Participant ID:</strong> {{participantInfo.participantId}}</p>
                <p><strong>Care Advisor:</strong> {{participantInfo.careAdvisor}}</p>
            </div>
            {{/if}}
            
            <div class="info-box">
                <h3>Support Information</h3>
                <p><strong>Platform Contact:</strong> {{adminEmail}}</p>
                <p><strong>Environment:</strong> {{environment}}</p>
                <p><strong>Processing Priority:</strong> Normal</p>
            </div>
        </div>
        
        <div class="footer">
            <p>HCI-CDS Forms Platform | North Carolina Department of Medical Assistance</p>
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

#### B. Welcome Notification Template

**Template Name:** `HCI-Welcome-Notification`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to HCI-CDS</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .step { background: white; border-left: 4px solid #10b981; padding: 15px; margin: 15px 0; }
        .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { background: #374151; color: white; padding: 20px; text-align: center; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to HCI-CDS!</h1>
            <p>Your enrollment has been successfully submitted</p>
        </div>
        
        <div class="content">
            <p>Dear {{firstName}} {{lastName}},</p>
            
            <p>Welcome to the North Carolina Home and Community Care Services (HCI-CDS) program! We're excited to help you on your care journey.</p>
            
            <h3>What happens next:</h3>
            
            <div class="step">
                <strong>1. Application Review</strong><br>
                Your application will be reviewed within 5-7 business days by our team.
            </div>
            
            <div class="step">
                <strong>2. Care Advisor Contact</strong><br>
                {{#if careAdvisor}}{{careAdvisor}}{{else}}A Care Advisor{{/if}} will contact you to discuss your care plan and answer any questions.
            </div>
            
            <div class="step">
                <strong>3. Service Authorization</strong><br>
                Once approved, we'll help you set up services and connect with qualified personal assistants.
            </div>
            
            <div class="step">
                <strong>4. Services Begin</strong><br>
                You can start receiving services according to your approved care plan.
            </div>
            
            <a href="{{portalUrl}}" class="button">Access Your Portal</a>
            
            <h3>Important Information:</h3>
            <ul>
                <li><strong>Participant ID:</strong> {{participantId}}</li>
                <li><strong>Enrollment Date:</strong> {{enrollmentDate}}</li>
                <li><strong>Care Advisor:</strong> {{careAdvisor}}</li>
                <li><strong>Contact Number:</strong> {{supportPhone}}</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us at {{supportEmail}} or call {{supportPhone}}.</p>
            
            <p>Thank you for choosing HCI-CDS!</p>
            
            <p>Best regards,<br>The HCI-CDS Program Team</p>
        </div>
        
        <div class="footer">
            <p><strong>HCI-CDS Program</strong><br>
            North Carolina Department of Medical Assistance</p>
            <p>This is an automated message from the HCI-Forms Platform.</p>
        </div>
    </div>
</body>
</html>
```

#### C. Status Update Template

**Template Name:** `HCI-Status-Update`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>HCI-CDS Status Update</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status-box { padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .status-approved { background: #d1fae5; border: 2px solid #10b981; color: #065f46; }
        .status-pending { background: #fef3c7; border: 2px solid #f59e0b; color: #92400e; }
        .status-action-required { background: #fee2e2; border: 2px solid #ef4444; color: #991b1b; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Application Status Update</h1>
            <p>{{firstName}} {{lastName}} - {{participantId}}</p>
        </div>
        
        <div class="content">
            <div class="status-box status-{{statusClass}}">
                <h2>{{statusIcon}} {{statusTitle}}</h2>
                <p><strong>Current Status:</strong> {{currentStatus}}</p>
                <p><strong>Updated:</strong> {{updateDate}}</p>
            </div>
            
            {{#if statusMessage}}
            <div class="info-item">
                <h3>Update Details</h3>
                <p>{{statusMessage}}</p>
            </div>
            {{/if}}
            
            <div class="info-grid">
                <div class="info-item">
                    <h4>Application Info</h4>
                    <p><strong>Submitted:</strong> {{submissionDate}}</p>
                    <p><strong>Type:</strong> {{applicationType}}</p>
                    <p><strong>Priority:</strong> {{priority}}</p>
                </div>
                
                <div class="info-item">
                    <h4>Care Team</h4>
                    <p><strong>Care Advisor:</strong> {{careAdvisor}}</p>
                    <p><strong>Contact:</strong> {{careAdvisorPhone}}</p>
                    <p><strong>Email:</strong> {{careAdvisorEmail}}</p>
                </div>
            </div>
            
            {{#if nextSteps}}
            <div class="info-item">
                <h3>Next Steps</h3>
                <ul>
                {{#each nextSteps}}
                    <li>{{this}}</li>
                {{/each}}
                </ul>
            </div>
            {{/if}}
            
            {{#if actionRequired}}
            <div class="info-item" style="border-left: 4px solid #ef4444;">
                <h3>⚠️ Action Required</h3>
                <p>{{actionMessage}}</p>
                {{#if actionDeadline}}
                <p><strong>Deadline:</strong> {{actionDeadline}}</p>
                {{/if}}
            </div>
            {{/if}}
            
            <div class="info-item">
                <h3>Questions or Concerns?</h3>
                <p>Contact your Care Advisor or our support team:</p>
                <ul>
                    <li><strong>Email:</strong> {{supportEmail}}</li>
                    <li><strong>Phone:</strong> {{supportPhone}}</li>
                    <li><strong>Portal:</strong> <a href="{{portalUrl}}">Access Your Account</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>HCI-CDS Program | North Carolina Department of Medical Assistance</p>
            <p>This is an automated update from the HCI-Forms Platform.</p>
        </div>
    </div>
</body>
</html>
```

## 📧 Testing Email Integration

Create a test file to verify your SendGrid setup:

```javascript
// scripts/test-sendgrid.js
import sgMail from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function testEmail() {
  const msg = {
    to: 'your-test-email@example.com',
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME
    },
    subject: 'HCI-Forms SendGrid Test',
    text: 'This is a test email from HCI-Forms platform.',
    html: `
      <h2>🎉 SendGrid Integration Test</h2>
      <p>If you receive this email, your SendGrid integration is working correctly!</p>
      <p><strong>Platform:</strong> HCI-Forms</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Test email sent successfully!');
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    if (error.response) {
      console.error('Response body:', error.response.body);
    }
  }
}

testEmail();
```

Run the test:

```bash
node scripts/test-sendgrid.js
```

## 🔧 Advanced Configuration

### Webhook Setup for Email Events

1. **Create Webhook Endpoint** in your app:

```javascript
// netlify/functions/sendgrid-webhook.js
export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const events = JSON.parse(event.body);
    
    for (const eventData of events) {
      console.log('SendGrid Event:', {
        email: eventData.email,
        event: eventData.event,
        timestamp: eventData.timestamp,
        sg_message_id: eventData.sg_message_id
      });
      
      // Update database with email event
      await updateEmailStatus(eventData);
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('Webhook error:', error);
    return { statusCode: 500, body: 'Error processing webhook' };
  }
}

async function updateEmailStatus(eventData) {
  // TODO: Update email_communications table
  // with delivery status, opens, clicks, etc.
}
```

2. **Configure Webhook in SendGrid:**
   - Navigate to **Settings > Mail Settings > Event Webhook**
   - HTTP Post URL: `https://your-domain.netlify.app/.netlify/functions/sendgrid-webhook`
   - Select Events: Delivered, Opened, Clicked, Bounced, Spam Report

### IP Whitelisting (if required)

If NC ARMS requires IP whitelisting for email submissions:

1. **Get SendGrid IP Addresses:**
   - Navigate to **Settings > IP Management**
   - Note your dedicated IP (if you have one) or use shared IPs

2. **Provide to NC ARMS:**
   - Shared IP ranges: Contact SendGrid support for current ranges
   - Dedicated IP: Your specific assigned IP

### Email Authentication Records

Add these DNS records for maximum deliverability:

```dns
# SPF Record
your-domain.com    TXT    "v=spf1 include:sendgrid.net ~all"

# DMARC Record  
_dmarc.your-domain.com    TXT    "v=DMARC1; p=quarantine; rua=mailto:dmarc@your-domain.com"
```

## 📊 Monitoring and Analytics

### Email Analytics Dashboard

SendGrid provides built-in analytics at **Activity Feed > Stats Overview**:

- **Delivery Rate**: Target >95%
- **Open Rate**: Target >20% for transactional emails
- **Click Rate**: Target >5%
- **Bounce Rate**: Keep <5%
- **Spam Rate**: Keep <0.1%

### Custom Monitoring

Add monitoring to your platform:

```javascript
// lib/services/email-analytics.js
export class EmailAnalytics {
  static async getEmailStats(startDate, endDate) {
    const response = await fetch('https://api.sendgrid.com/v3/stats', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      params: {
        start_date: startDate,
        end_date: endDate,
        aggregated_by: 'day'
      }
    });
    
    return await response.json();
  }

  static async getSuppressionList() {
    // Get bounces, spam reports, unsubscribes
    const response = await fetch('https://api.sendgrid.com/v3/suppression/bounces', {
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      }
    });
    
    return await response.json();
  }
}
```

## 🔒 Security Best Practices

1. **API Key Security:**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys periodically
   - Use restricted access keys when possible

2. **Email Content Security:**
   - Sanitize all dynamic content
   - Use HTTPS for all links
   - Validate all email addresses

3. **Rate Limiting:**
   - Monitor your SendGrid usage
   - Implement application-level rate limiting
   - Set up alerts for unusual activity

## 🎯 Production Checklist

- [ ] SendGrid account created and verified
- [ ] Domain authentication completed
- [ ] API key generated and secured
- [ ] Email templates created and tested
- [ ] Test emails successfully sent
- [ ] Webhook endpoint configured
- [ ] DNS records updated
- [ ] Rate limiting implemented
- [ ] Monitoring dashboard set up
- [ ] Error handling tested

## 📞 Support

- **SendGrid Support:** [support.sendgrid.com](https://support.sendgrid.com)
- **Documentation:** [docs.sendgrid.com](https://docs.sendgrid.com)
- **Status Page:** [status.sendgrid.com](https://status.sendgrid.com)

---

**Your SendGrid integration is now ready for production HCI-Forms email communications!** 📧
