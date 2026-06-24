import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Resend } from 'resend';

interface EmailTemplate {
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_xxx') {
      this.logger.error('RESEND_API_KEY is not configured properly');
    }
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  }

  /**
   * Send OTP email for registration
   */
  async sendRegistrationOtp(email: string, otp: string, name?: string): Promise<void> {
    const template = this.getRegistrationOtpTemplate(otp, name);
    await this.sendEmail(email, template.subject, template.html);
  }

  /**
   * Send OTP email for password reset
   */
  async sendPasswordResetOtp(email: string, otp: string, name?: string): Promise<void> {
    const template = this.getPasswordResetOtpTemplate(otp, name);
    await this.sendEmail(email, template.subject, template.html);
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    const template = this.getWelcomeEmailTemplate(name);
    await this.sendEmail(email, template.subject, template.html);
  }

  /**
   * Send password changed confirmation email
   */
  async sendPasswordChangedEmail(email: string, name: string): Promise<void> {
    const template = this.getPasswordChangedTemplate(name);
    await this.sendEmail(email, template.subject, template.html);
  }

  /**
   * Generic email sender with error handling
   */
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      // Validate Resend API key
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey || apiKey === 're_xxx') {
        throw new BadRequestException(
          'Email service is not configured. Please contact support.'
        );
      }

      // Validate from email
      if (!this.fromEmail) {
        throw new BadRequestException(
          'Email sender address is not configured.'
        );
      }

      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Resend API error: ${error.message}`, error);
        throw new BadRequestException(`Failed to send email: ${error.message}`);
      }

      this.logger.log(`Email sent successfully to ${to}. Message ID: ${data?.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to}: ${(error as Error).message}`,
        (error as Error).stack
      );
      
      // Re-throw with user-friendly message
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to send email. Please try again later.');
    }
  }

  /**
   * Registration OTP email template
   */
  private getRegistrationOtpTemplate(otp: string, name?: string): EmailTemplate {
    const greeting = name ? `Hi ${name},` : 'Hi there,';
    
    return {
      subject: 'Your Verification Code - Shiksha',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #3730A3; }
            .logo { font-size: 24px; font-weight: bold; color: #3730A3; }
            .content { padding: 30px 0; }
            .otp-box { background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #3730A3; letter-spacing: 4px; }
            .footer { text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Shiksha</div>
            </div>
            <div class="content">
              <p>${greeting}</p>
              <p>Thank you for signing up! To complete your registration, please use the verification code below:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="warning">
                <strong>Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
              </div>
              
              <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Shiksha. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Password reset OTP email template
   */
  private getPasswordResetOtpTemplate(otp: string, name?: string): EmailTemplate {
    const greeting = name ? `Hi ${name},` : 'Hi there,';
    
    return {
      subject: 'Password Reset Request - Shiksha',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #3730A3; }
            .logo { font-size: 24px; font-weight: bold; color: #3730A3; }
            .content { padding: 30px 0; }
            .otp-box { background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 4px; }
            .footer { text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px; }
            .warning { background: #fee2e2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Shiksha</div>
            </div>
            <div class="content">
              <p>${greeting}</p>
              <p>We received a request to reset your password. Use the code below to proceed:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <div class="warning">
                <strong>Security Alert:</strong> This code expires in 10 minutes. If you didn't request a password reset, please ignore this email or contact support immediately.
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Shiksha. All rights reserved.</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Welcome email template
   */
  private getWelcomeEmailTemplate(name: string): EmailTemplate {
    return {
      subject: 'Welcome to Shiksha!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #3730A3; }
            .logo { font-size: 24px; font-weight: bold; color: #3730A3; }
            .content { padding: 30px 0; }
            .cta-button { display: inline-block; background: #3730A3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Shiksha</div>
            </div>
            <div class="content">
              <h2>Welcome aboard, ${name}!</h2>
              <p>Your account has been successfully created. We're excited to help you on your educational journey.</p>
              <p>You can now:</p>
              <ul>
                <li>Explore universities and courses</li>
                <li>Track your applications</li>
                <li>Connect with admission counselors</li>
              </ul>
              <center>
                <a href="${process.env.FRONTEND_URL}/dashboard" class="cta-button">Go to Dashboard</a>
              </center>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Shiksha. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }

  /**
   * Password changed confirmation template
   */
  private getPasswordChangedTemplate(name: string): EmailTemplate {
    return {
      subject: 'Password Changed Successfully - Shiksha',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Changed</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #3730A3; }
            .logo { font-size: 24px; font-weight: bold; color: #3730A3; }
            .content { padding: 30px 0; }
            .success { background: #d1fae5; border-left: 4px solid #10b981; padding: 12px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Shiksha</div>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <div class="success">
                <strong>Success!</strong> Your password has been changed successfully.
              </div>
              <p>If you didn't make this change, please contact our support team immediately.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Shiksha. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };
  }
}
