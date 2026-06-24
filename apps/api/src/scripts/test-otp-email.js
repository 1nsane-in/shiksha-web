const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Load environment variables from apps/api/.env
const envPath = path.resolve(__dirname, '../../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  
  const match = trimmed.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

const TEST_EMAIL = 'tushar.sahu0207@gmail.com';
const TEST_NAME = 'Tushar Sahu';

async function testOtpEmail() {
  console.log('🚀 Testing OTP Email Service...\n');

  // Check if API key is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 're_xxx') {
    console.error('❌ Error: RESEND_API_KEY is not configured properly!');
    console.log('   Please update apps/api/.env with a valid Resend API key.');
    console.log('   Get your API key from: https://resend.com/api-keys');
    process.exit(1);
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@auth.shiksha.study';
  
  console.log('📧 Configuration:');
  console.log('   From:', fromEmail);
  console.log('   To:', TEST_EMAIL);
  console.log('   API Key:', apiKey.substring(0, 10) + '...\n');

  // Initialize Resend
  const resend = new Resend(apiKey);

  // Generate a test OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log('🔢 Generated OTP:', otp);
  console.log('📤 Sending email...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: TEST_EMAIL,
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
              <p>Hi ${TEST_NAME},</p>
              <p>This is a test email from your OTP email service!</p>
              <p>Your verification code is:</p>
              
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
    });

    if (error) {
      console.error('❌ Failed to send email:');
      console.error('   Error:', error.message);
      console.error('\n💡 Common fixes:');
      console.error('   - Verify your domain at https://resend.com/domains');
      console.error('   - Check that RESEND_FROM_EMAIL uses your verified domain');
      console.error('   - Ensure your API key has permission to send emails');
      process.exit(1);
    }

    console.log('✅ Email sent successfully!\n');
    console.log('📨 Message ID:', data.id);
    console.log('📧 Check your inbox at:', TEST_EMAIL);
    console.log('\n💡 Tips:');
    console.log('   - Check your spam/junk folder if not in inbox');
    console.log('   - View logs at: https://resend.com/logs');
    console.log('   - OTP Code was:', otp);
    console.log('\n🎉 Your email service is working correctly!');
    
  } catch (error) {
    console.error('❌ Error sending email:');
    console.error('   ', error.message);
    process.exit(1);
  }
}

// Run the test
testOtpEmail();
