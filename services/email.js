const nodemailer = require('nodemailer');

// Create transporter
let transporter;

function createTransporter() {
    if (process.env.EMAIL_SERVICE && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        // Use explicit SMTP settings for better Railway compatibility
        transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            connectionTimeout: 60000, // 60 seconds
            greetingTimeout: 30000, // 30 seconds
            socketTimeout: 60000, // 60 seconds
            pool: true, // Use connection pooling
            maxConnections: 3,
            maxMessages: 10,
            rateDelta: 1000, // 1 second between messages
            rateLimit: 5 // max 5 messages per second
        });
        console.log('📧 Email service initialized with explicit Gmail SMTP settings');
    } else {
        console.log('📧 Email service not configured - emails will be logged to console');
        transporter = nodemailer.createTransport({
            streamTransport: true,
            newline: 'unix',
            buffer: true
        });
    }
}

// Initialize transporter
createTransporter();

// Send demo booking confirmation
async function sendDemoConfirmation(demoData, bookingId) {
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; margin-top: 30px; }
        .btn { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🇫🇷 Demo Lesson Confirmed!</h1>
        </div>
        <div class="content">
            <h2>Bonjour ${demoData.firstName}!</h2>
            <p>Thank you for booking your free French demo lesson! We're excited to help you start your French learning journey.</p>
            
            <div class="details">
                <h3>📅 Your Demo Details</h3>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Date:</strong> ${new Date(demoData.preferredDate).toLocaleDateString()}</p>
                <p><strong>Time:</strong> ${demoData.preferredTime} IST</p>
                <p><strong>Your Level:</strong> ${demoData.frenchLevel}</p>
            </div>

            <h3>📋 What to Expect</h3>
            <ul>
                <li>✓ 30-minute personalized session</li>
                <li>✓ Assessment of your current French level</li>
                <li>✓ Introduction to our teaching methods</li>
                <li>✓ Customized learning plan recommendations</li>
                <li>✓ Free learning resources</li>
            </ul>

            <h3>📱 Joining Your Demo</h3>
            <p>We'll send you a video call link 24 hours before your demo. Please ensure you have:</p>
            <ul>
                <li>Stable internet connection</li>
                <li>Camera and microphone enabled</li>
                <li>A quiet space for 30 minutes</li>
                <li>Notebook and pen for taking notes</li>
            </ul>

            <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${process.env.BUSINESS_EMAIL}" class="btn">Questions? Contact Us</a>
            </div>
        </div>
        <div class="footer">
            <p>À bientôt! (See you soon!)<br>
            <strong>Sandhya Prasanna (Sandy)</strong><br>
            ${process.env.BUSINESS_NAME}<br>
            ${process.env.BUSINESS_EMAIL} | ${process.env.BUSINESS_PHONE}</p>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: demoData.email,
        subject: `🇫🇷 Your French Demo Lesson is Confirmed - ${new Date(demoData.preferredDate).toLocaleDateString()}`,
        html: emailTemplate,
        text: `Demo Lesson Confirmed!\n\nBooking ID: ${bookingId}\nDate: ${demoData.preferredDate}\nTime: ${demoData.preferredTime} IST\n\nWe'll send you the video call link 24 hours before your demo. Questions? Reply to this email or call ${process.env.BUSINESS_PHONE}`
    };

    return await sendEmail(mailOptions);
}

// Send registration confirmation
async function sendRegistrationConfirmation(registrationData, registrationId, amount) {
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; margin-top: 30px; }
        .success { color: #10b981; font-size: 18px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Registration Successful!</h1>
        </div>
        <div class="content">
            <h2>Félicitations ${registrationData.firstName}!</h2>
            <p class="success">Your French lessons are now booked and paid for. Welcome to the FrenchTutor family!</p>
            
            <div class="details">
                <h3>📋 Subscription Summary</h3>
                <p><strong>Registration ID:</strong> ${registrationId}</p>
                <p><strong>Subscription:</strong> Monthly ${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School Plan</p>
                <p><strong>Monthly Fee:</strong> ₹${amount}</p>
                <p><strong>Payment Status:</strong> Completed ✅</p>
                <p><strong>Billing Cycle:</strong> Monthly subscription (auto-renewing)</p>
                ${registrationData.specialties && registrationData.specialties.length > 0 ? 
                    `<p><strong>Additional Services:</strong> ${registrationData.specialties.join(', ')}</p>` : ''}
            </div>

            <div class="details">
                <h3>📅 Schedule Preferences</h3>
                <p><strong>Start Date:</strong> ${registrationData.startDate || 'As soon as possible'}</p>
            </div>

            <h3>📚 What Happens Next?</h3>
            <ol>
                <li><strong>Schedule Your First Lesson:</strong> We'll contact you within 24 hours to schedule your first lesson</li>
                <li><strong>Receive Learning Materials:</strong> Get access to exclusive French learning resources</li>
                <li><strong>Meet Your Instructor:</strong> Connect with Sandy and start your personalized learning journey</li>
                <li><strong>Track Your Progress:</strong> Regular assessments and feedback to ensure you're improving</li>
            </ol>

            <div class="details">
                <h3>📞 Contact Information</h3>
                <p>Have questions? We're here to help!</p>
                <p><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</p>
                <p><strong>Phone:</strong> ${process.env.BUSINESS_PHONE}</p>
                <p><strong>Response Time:</strong> Within 4-6 hours during business days</p>
            </div>
        </div>
        <div class="footer">
            <p>Merci beaucoup! (Thank you very much!)<br>
            <strong>Marie Dubois & The FrenchTutor Team</strong><br>
            ${process.env.BUSINESS_NAME}</p>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: registrationData.email,
        subject: `🎉 Welcome to FrenchTutor! Your Registration is Complete`,
        html: emailTemplate.replace('Marie Dubois & The FrenchTutor Team', 'Sandhya Prasanna (Sandy) & The FrenchTutor Team'),
        text: `Monthly Subscription Activated!\n\nRegistration ID: ${registrationId}\nSubscription: Monthly ${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School Plan\nMonthly Fee: ₹${amount}\n\nYour subscription is now active! We'll contact you within 24 hours to schedule your first lesson. Questions? Reply to this email!`
    };

    return await sendEmail(mailOptions);
}

// Send subscription confirmation (for monthly subscriptions)
async function sendSubscriptionConfirmation(registrationData, registrationId, monthlyAmount, subscriptionId) {
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #6b7280; margin-top: 30px; }
        .success { color: #8b5cf6; font-size: 18px; font-weight: bold; }
        .subscription-badge { background: #f3f4f6; border: 2px solid #8b5cf6; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Monthly Subscription Activated!</h1>
        </div>
        <div class="content">
            <h2>Félicitations ${registrationData.firstName}!</h2>
            <p class="success">Your monthly French subscription is now active. Welcome to the FrenchTutor family!</p>
            
            <div class="subscription-badge">
                <h3>🔄 Monthly Subscription Plan</h3>
                <p><strong>${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School French</strong></p>
                <p><strong>₹${monthlyAmount}/month</strong></p>
            </div>
            
            <div class="details">
                <h3>📋 Subscription Details</h3>
                <p><strong>Registration ID:</strong> ${registrationId}</p>
                <p><strong>Stripe Subscription ID:</strong> ${subscriptionId}</p>
                <p><strong>Grade Level:</strong> ${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School</p>
                <p><strong>Monthly Fee:</strong> ₹${monthlyAmount}</p>
                <p><strong>Billing Cycle:</strong> Monthly (auto-renewing)</p>
                <p><strong>Next Billing Date:</strong> ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
                ${registrationData.specialties && registrationData.specialties.length > 0 ? 
                    `<p><strong>Additional Services:</strong> ${registrationData.specialties.join(', ')} (Contact us for pricing)</p>` : ''}
            </div>

            <div class="details">
                <h3>📅 Your Preferences</h3>
                <p><strong>Start Date:</strong> ${registrationData.startDate || 'As soon as possible'}</p>
            </div>

            <h3>📚 What Happens Next?</h3>
            <ol>
                <li><strong>Schedule Your First Lesson:</strong> We'll contact you within 24 hours to schedule your first lesson</li>
                <li><strong>Receive Learning Materials:</strong> Get access to grade-appropriate French learning resources</li>
                <li><strong>Meet Your Instructor:</strong> Connect with our experienced French teachers</li>
                <li><strong>Monthly Progress Tracking:</strong> Regular assessments and feedback on your learning progress</li>
            </ol>

            <div class="details">
                <h3>💳 Billing Information</h3>
                <p><strong>Automatic Billing:</strong> Your subscription will automatically renew each month</p>
                <p><strong>Payment Method:</strong> The card you provided will be charged monthly</p>
                <p><strong>Manage Subscription:</strong> Contact us to update payment methods or cancel anytime</p>
                <p><strong>No Hidden Fees:</strong> Your monthly fee covers all regular lessons</p>
            </div>

            <div class="details">
                <h3>📞 Contact Information</h3>
                <p>Questions about your subscription? We're here to help!</p>
                <p><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</p>
                <p><strong>Phone:</strong> ${process.env.BUSINESS_PHONE}</p>
                <p><strong>Response Time:</strong> Within 4-6 hours during business days</p>
            </div>
        </div>
        <div class="footer">
            <p>Merci beaucoup! (Thank you very much!)<br>
            <strong>Marie Dubois & The FrenchTutor Team</strong><br>
            ${process.env.BUSINESS_NAME}</p>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: registrationData.email,
        subject: `🎉 Monthly French Subscription Activated - Welcome ${registrationData.firstName}!`,
        html: emailTemplate.replace('Marie Dubois & The FrenchTutor Team', 'Sandhya Prasanna (Sandy) & The FrenchTutor Team'),
        text: `Monthly French Subscription Activated!\n\nRegistration ID: ${registrationId}\nSubscription ID: ${subscriptionId}\nGrade Level: ${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School\nMonthly Fee: ₹${monthlyAmount}\n\nYour monthly subscription is now active! We'll contact you within 24 hours to schedule your first lesson. Your card will be charged ₹${monthlyAmount} monthly. Questions? Reply to this email!`
    };

    return await sendEmail(mailOptions);
}

// Send bank transfer instructions
async function sendBankTransferInstructions(registrationData, registrationId, amount) {
    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f8f9fa; padding: 30px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .bank-details { background: #fef3c7; padding: 20px; border-radius: 8px; font-family: monospace; }
        .footer { text-align: center; color: #6b7280; margin-top: 30px; }
        .important { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏦 Bank Transfer Instructions</h1>
        </div>
        <div class="content">
            <h2>Thank you ${registrationData.firstName}!</h2>
            <p>Your registration has been received. Please complete your payment via bank transfer using the details below.</p>
            
            <div class="details">
                <h3>📋 Subscription Summary</h3>
                <p><strong>Registration ID:</strong> ${registrationId}</p>
                <p><strong>Subscription:</strong> Monthly ${registrationData.gradeLevel.charAt(0).toUpperCase() + registrationData.gradeLevel.slice(1)} School Plan</p>
                <p><strong>Monthly Fee Due:</strong> ₹${amount}</p>
                <p><strong>Payment Deadline:</strong> ${new Date(Date.now() + 48*60*60*1000).toLocaleDateString()}</p>
            </div>

            <div class="bank-details">
                <h3>🏦 Bank Transfer Details</h3>
                <p><strong>Bank Name:</strong> First National Bank</p>
                <p><strong>Account Name:</strong> FrenchTutor Education Services</p>
                <p><strong>Account Number:</strong> 1234567890</p>
                <p><strong>Routing Number:</strong> 021000021</p>
                <p><strong>Reference:</strong> ${registrationId}</p>
            </div>

            <div class="important">
                <h4>⚠️ Important Instructions</h4>
                <ul>
                    <li><strong>Include Reference:</strong> Always include your registration ID (${registrationId}) in the transfer reference</li>
                    <li><strong>Exact Amount:</strong> Transfer exactly ₹${amount}</li>
                    <li><strong>Processing Time:</strong> Bank transfers typically take 1-2 business days to process</li>
                    <li><strong>Payment Deadline:</strong> Payment must be received within 48 hours to secure your slot</li>
                </ul>
            </div>

            <h3>📱 After You Transfer</h3>
            <ol>
                <li>Send us a copy of your transfer receipt to ${process.env.BUSINESS_EMAIL}</li>
                <li>We'll confirm receipt within 24 hours</li>
                <li>Once confirmed, we'll contact you to schedule your first lesson</li>
            </ol>

            <div class="details">
                <h3>📞 Need Help?</h3>
                <p>Having trouble with the bank transfer? Contact us:</p>
                <p><strong>Email:</strong> ${process.env.BUSINESS_EMAIL}</p>
                <p><strong>Phone:</strong> ${process.env.BUSINESS_PHONE}</p>
                <p><strong>Office Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
            </div>
        </div>
        <div class="footer">
            <p>We appreciate your patience with bank transfers!<br>
            <strong>The FrenchTutor Team</strong><br>
            ${process.env.BUSINESS_NAME}</p>
        </div>
    </div>
</body>
</html>
    `;

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: registrationData.email,
        subject: `🏦 Bank Transfer Instructions - Registration ${registrationId}`,
        html: emailTemplate,
        text: `Bank Transfer Instructions\n\nRegistration ID: ${registrationId}\nAmount: ₹${amount}\n\nBank: First National Bank\nAccount: FrenchTutor Education Services\nAccount Number: 1234567890\nRouting: 021000021\nReference: ${registrationId}\n\nIMPORTANT: Include registration ID in transfer reference and send receipt to ${process.env.BUSINESS_EMAIL}`
    };

    return await sendEmail(mailOptions);
}

// Generic email sender with retry logic
async function sendEmail(mailOptions, retryCount = 0) {
    const maxRetries = 3;
    const retryDelay = 2000 * Math.pow(2, retryCount); // Exponential backoff: 2s, 4s, 8s
    
    try {
        if (!transporter) {
            console.log('⚠️ Email not configured, logging email content:', {
                to: mailOptions.to,
                subject: mailOptions.subject,
                text: mailOptions.text?.substring(0, 200) + '...'
            });
            return { success: true, messageId: 'mock-' + Date.now() };
        }

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email sent successfully:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            messageId: info.messageId,
            attempt: retryCount + 1
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`📧 Email sending failed (attempt ${retryCount + 1}/${maxRetries + 1}):`, error.message);
        
        // Check if error is retryable (connection issues, timeouts)
        const retryableErrors = ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'CONN'];
        const isRetryable = retryableErrors.some(code => error.code === code || error.message.includes(code));
        
        if (retryCount < maxRetries && isRetryable) {
            console.log(`🔄 Retrying email send in ${retryDelay}ms...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return await sendEmail(mailOptions, retryCount + 1);
        }
        
        // Log email content if all retries failed
        console.log('Email that failed to send after all retries:', {
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text?.substring(0, 200) + '...',
            finalError: error.message,
            totalAttempts: retryCount + 1
        });
        
        return { success: false, error: error.message, attempts: retryCount + 1 };
    }
}

// Test email configuration
async function testEmailConfig() {
    if (!transporter) {
        return { success: false, message: 'Email not configured' };
    }

    try {
        await transporter.verify();
        console.log('📧 Email configuration verified successfully');
        return { success: true, message: 'Email configuration valid' };
    } catch (error) {
        console.error('📧 Email configuration test failed:', error);
        return { success: false, message: error.message };
    }
}

module.exports = {
    sendDemoConfirmation,
    sendRegistrationConfirmation,
    sendSubscriptionConfirmation,
    sendBankTransferInstructions,
    testEmailConfig
}; 