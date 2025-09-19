import { HCI_FORMS_CONFIG } from '../config/hci-forms-config.js';
import { EmailService } from './email-service.js';

/**
 * FMS (Financial Management Services) Integration
 * Handles transaction processing and payroll management via Gusto and other providers
 */
export class FMSIntegration {
  static async processParticipantSetup(participantData, fmsProvider = 'gusto') {
    try {
      const provider = this.getProvider(fmsProvider);
      
      const setupResult = await provider.setupParticipant(participantData);
      
      // Calculate and record transaction fees
      const fees = this.calculateSetupFees(participantData);
      await this.recordTransaction({
        type: 'setup_fee',
        participantId: participantData.participantId,
        amount: fees.total,
        fmsProvider,
        transactionId: setupResult.transactionId
      });

      // Send welcome notification
      await EmailService.sendNotification(
        participantData.email,
        'FMS Account Setup Complete',
        this.buildWelcomeMessage(participantData, setupResult)
      );

      return {
        success: true,
        accountId: setupResult.accountId,
        fees: fees,
        nextSteps: this.getParticipantNextSteps(participantData)
      };
    } catch (error) {
      console.error('FMS setup error:', error);
      throw new Error(`FMS setup failed: ${error.message}`);
    }
  }

  static async processPayrollAuthorization(authorizationData, fmsProvider = 'gusto') {
    try {
      const provider = this.getProvider(fmsProvider);
      
      // Setup personal assistant in payroll system
      const employeeResult = await provider.setupEmployee({
        participantId: authorizationData.participantId,
        employeeData: {
          firstName: authorizationData.paFirstName,
          lastName: authorizationData.paLastName,
          ssn: authorizationData.paSSN,
          address: authorizationData.paAddress,
          phone: authorizationData.paPhone
        },
        payrollData: {
          hourlyRate: authorizationData.hourlyRate,
          maxWeeklyHours: authorizationData.serviceHours,
          startDate: authorizationData.startDate,
          endDate: authorizationData.endDate
        }
      });

      // Calculate transaction fees
      const fees = this.calculateTransactionFees(authorizationData);
      await this.recordTransaction({
        type: 'payroll_setup',
        participantId: authorizationData.participantId,
        amount: fees.total,
        fmsProvider,
        employeeId: employeeResult.employeeId
      });

      return {
        success: true,
        employeeId: employeeResult.employeeId,
        fees: fees,
        expectedMonthlyFees: this.calculateMonthlyFees(authorizationData)
      };
    } catch (error) {
      console.error('Payroll authorization error:', error);
      throw new Error(`Payroll authorization failed: ${error.message}`);
    }
  }

  static async processMonthlyPayroll(participantId, payrollData, fmsProvider = 'gusto') {
    try {
      const provider = this.getProvider(fmsProvider);
      
      const payrollResult = await provider.processPayroll({
        participantId,
        payrollData
      });

      // Calculate and record transaction fees
      const fees = this.calculatePayrollFees(payrollData);
      await this.recordTransaction({
        type: 'monthly_payroll',
        participantId,
        amount: fees.total,
        fmsProvider,
        payrollId: payrollResult.payrollId
      });

      // Generate revenue for platform
      await this.recordRevenue({
        participantId,
        amount: fees.platformFee,
        type: 'transaction_fee',
        period: new Date().toISOString().slice(0, 7) // YYYY-MM format
      });

      return {
        success: true,
        payrollId: payrollResult.payrollId,
        fees: fees,
        totalProcessed: payrollData.totalAmount
      };
    } catch (error) {
      console.error('Monthly payroll error:', error);
      throw new Error(`Payroll processing failed: ${error.message}`);
    }
  }

  static getProvider(providerName) {
    const providers = {
      gusto: new GustoProvider(),
      // Add other FMS providers here
    };

    const provider = providers[providerName];
    if (!provider) {
      throw new Error(`Unknown FMS provider: ${providerName}`);
    }

    return provider;
  }

  static calculateSetupFees(participantData) {
    const config = HCI_FORMS_CONFIG.fms.fees;
    const setupFee = config.setup_fee;
    const platformFee = setupFee * 0.3; // 30% platform fee
    const providerFee = setupFee * 0.7; // 70% to provider

    return {
      setupFee: setupFee,
      platformFee: platformFee,
      providerFee: providerFee,
      total: setupFee
    };
  }

  static calculateTransactionFees(authorizationData) {
    const config = HCI_FORMS_CONFIG.fms.fees;
    const weeklyAmount = authorizationData.hourlyRate * authorizationData.serviceHours;
    const monthlyAmount = weeklyAmount * 4.33; // Average weeks per month
    
    const transactionFee = monthlyAmount * (config.transaction_fee_percent / 100);
    const platformFee = transactionFee * 0.4; // 40% platform fee
    const providerFee = transactionFee * 0.6; // 60% to provider

    return {
      transactionFee: transactionFee,
      platformFee: platformFee,
      providerFee: providerFee,
      total: transactionFee
    };
  }

  static calculatePayrollFees(payrollData) {
    const config = HCI_FORMS_CONFIG.fms.fees;
    const totalPayroll = payrollData.totalAmount;
    
    const transactionFee = Math.max(
      totalPayroll * (config.transaction_fee_percent / 100),
      config.monthly_minimum
    );
    
    const platformFee = transactionFee * 0.4;
    const providerFee = transactionFee * 0.6;

    return {
      transactionFee: transactionFee,
      platformFee: platformFee,
      providerFee: providerFee,
      total: transactionFee
    };
  }

  static calculateMonthlyFees(authorizationData) {
    const weeklyAmount = authorizationData.hourlyRate * authorizationData.serviceHours;
    const monthlyAmount = weeklyAmount * 4.33;
    const config = HCI_FORMS_CONFIG.fms.fees;
    
    return Math.max(
      monthlyAmount * (config.transaction_fee_percent / 100),
      config.monthly_minimum
    );
  }

  static async recordTransaction(transactionData) {
    try {
      // In production, this would write to database
      console.log('Recording FMS transaction:', transactionData);
      
      // TODO: Implement database transaction logging
      // await DatabaseService.recordTransaction(transactionData);
      
      return {
        success: true,
        transactionId: this.generateTransactionId()
      };
    } catch (error) {
      console.error('Transaction recording error:', error);
      throw error;
    }
  }

  static async recordRevenue(revenueData) {
    try {
      // In production, this would write to database
      console.log('Recording platform revenue:', revenueData);
      
      // TODO: Implement revenue tracking
      // await DatabaseService.recordRevenue(revenueData);
      
      return {
        success: true,
        revenueId: this.generateTransactionId()
      };
    } catch (error) {
      console.error('Revenue recording error:', error);
      throw error;
    }
  }

  static buildWelcomeMessage(participantData, setupResult) {
    return `
Dear ${participantData.firstName} ${participantData.lastName},

Your Financial Management Services (FMS) account has been successfully set up!

Account Details:
- Account ID: ${setupResult.accountId}
- FMS Provider: Gusto Payroll Services
- Setup Fee: $${this.calculateSetupFees(participantData).total.toFixed(2)}

Next Steps:
1. Your Care Advisor will help you complete personal assistant authorization
2. Once authorized, payroll services will begin automatically
3. You'll receive monthly statements showing all transactions

For questions about your FMS account, contact:
- Gusto Support: 1-800-GUSTO-HR
- HCI-CDS Program: ${HCI_FORMS_CONFIG.email.recipients.admin_notifications}

Thank you for choosing our platform!

HCI-CDS Forms Platform
    `;
  }

  static getParticipantNextSteps(participantData) {
    return [
      'Complete personal assistant authorization forms',
      'Ensure PA passes background check',
      'Review and sign service agreements',
      'Set up direct deposit for PA payments',
      'Schedule orientation with Care Advisor'
    ];
  }

  static generateTransactionId() {
    return `FMS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Analytics and reporting methods
  static async generateRevenueReport(startDate, endDate) {
    try {
      // In production, this would query database
      console.log('Generating revenue report:', { startDate, endDate });
      
      return {
        period: { startDate, endDate },
        totalRevenue: 0,
        transactionCount: 0,
        averageTransactionValue: 0,
        topParticipants: [],
        monthlyTrend: []
      };
    } catch (error) {
      console.error('Revenue report error:', error);
      throw error;
    }
  }
}

/**
 * Gusto Provider Implementation
 * Handles integration with Gusto Payroll Services
 */
class GustoProvider {
  constructor() {
    this.config = HCI_FORMS_CONFIG.fms.providers.gusto;
    this.baseUrl = this.config.endpoint;
  }

  async setupParticipant(participantData) {
    try {
      const response = await fetch(`${this.baseUrl}/companies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `HCI Participant ${participantData.participantId}`,
          trade_name: `Care Services - ${participantData.firstName} ${participantData.lastName}`,
          ein: '00-0000000', // Would need to generate or use HCI program EIN
          entity_type: 'LLC',
          company_addresses: [{
            street_1: participantData.streetAddress,
            city: participantData.city,
            state: participantData.state,
            zip: participantData.zipCode
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gusto API error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        accountId: result.uuid,
        companyId: result.uuid,
        transactionId: this.generateTransactionId()
      };
    } catch (error) {
      console.error('Gusto participant setup error:', error);
      throw error;
    }
  }

  async setupEmployee(employeeData) {
    try {
      const response = await fetch(`${this.baseUrl}/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_uuid: employeeData.participantId, // Company UUID from participant setup
          first_name: employeeData.employeeData.firstName,
          last_name: employeeData.employeeData.lastName,
          ssn: employeeData.employeeData.ssn,
          phone: employeeData.employeeData.phone,
          home_address: {
            street_1: employeeData.employeeData.address,
            city: 'Unknown', // Would need to parse address
            state: 'NC',
            zip: '00000'
          },
          jobs: [{
            title: 'Personal Assistant',
            rate: employeeData.payrollData.hourlyRate * 100, // Gusto uses cents
            payment_unit: 'Hour',
            hire_date: employeeData.payrollData.startDate
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gusto employee setup error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        employeeId: result.uuid,
        jobId: result.jobs[0].uuid
      };
    } catch (error) {
      console.error('Gusto employee setup error:', error);
      throw error;
    }
  }

  async processPayroll(payrollData) {
    try {
      // Simplified payroll processing - would need full implementation
      const response = await fetch(`${this.baseUrl}/payrolls`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company_uuid: payrollData.participantId,
          start_date: payrollData.startDate,
          end_date: payrollData.endDate,
          processed: true
        })
      });

      if (!response.ok) {
        throw new Error(`Gusto payroll error: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        payrollId: result.uuid,
        processedDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Gusto payroll processing error:', error);
      throw error;
    }
  }

  generateTransactionId() {
    return `GUSTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}