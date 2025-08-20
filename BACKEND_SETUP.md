# Backend Setup Guide for FrenchTutor Website

## 🚀 Complete Backend Solution

Your French tutoring website now has a **complete Node.js backend** with Stripe payment processing, email notifications, and data management!

## 📋 Prerequisites

- **Node.js 16+** installed
- **Stripe account** (sign up at [stripe.com](https://stripe.com))
- **Gmail account** (for email notifications)

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example file and update it:
```bash
cp env-example .env
```

Edit `.env` with your real values:
```env
# Stripe Configuration (get from stripe.com dashboard)
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="FrenchTutor <noreply@frenchtutor.com>"

# Business Information
BUSINESS_NAME="FrenchTutor"
BUSINESS_EMAIL="hello@frenchtutor.com"
BUSINESS_PHONE="+1 (555) 123-4567"
```

### 3. Start the Server
```bash
npm start
```

Your website will be available at **http://localhost:3001**

## 📧 Email Setup (Gmail)

### 1. Enable 2-Factor Authentication
- Go to [Google Account Settings](https://myaccount.google.com/)
- Security → 2-Step Verification → Turn On

### 2. Generate App Password
- Security → App passwords
- Select "Mail" and generate password
- Use this password in your `.env` file

### 3. Test Email Configuration
The server will automatically test email on startup and show status.

## 💳 Stripe Integration

### 1. Get Your Keys
1. Sign up at [stripe.com](https://stripe.com)
2. Go to **Developers → API Keys**
3. Copy your **Publishable key** and **Secret key**

### 2. Update Frontend
In `script.js`, replace line 3:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_live_your_actual_publishable_key';
```

### 3. Set Up Webhooks (Optional but Recommended)
1. Go to **Developers → Webhooks** in Stripe dashboard
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook secret to `.env`

## 📁 What the Backend Does

### ✅ **Payment Processing**
- **Stripe card payments** with 3D Secure support
- **Bank transfer instructions** with unique reference numbers
- **Automatic email confirmations** for all payment methods
- **Webhook handling** for payment status updates

### ✅ **Data Management**
- **JSON-based storage** (no database required)
- **Demo bookings** with unique IDs
- **Student registrations** with payment tracking
- **Automatic backups** and data validation

### ✅ **Email Notifications**
- **Beautiful HTML emails** with professional templates
- **Demo confirmations** with booking details
- **Registration confirmations** with payment receipts
- **Bank transfer instructions** with payment details

### ✅ **Security & Performance**
- **Rate limiting** (100 requests/15min, 5 payments/15min)
- **Input validation** with detailed error messages
- **CORS protection** and security headers
- **Error handling** with detailed logging

## 🔄 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Server health check |
| `/api/book-demo` | POST | Schedule demo lesson |
| `/api/register` | POST | Register for classes with payment |
| `/api/stripe/webhook` | POST | Stripe webhook handler |
| `/api/registrations` | GET | View all registrations (admin) |
| `/api/demos` | GET | View all demo bookings (admin) |

## 📊 Data Storage

All data is stored in JSON files in the `./data` directory:
- `demo-bookings.json` - Demo lesson bookings
- `registrations.json` - Student registrations
- `backups/` - Automatic backups

### Example Registration Record:
```json
{
  "id": "REG-123456-ABC",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "classFormat": "private",
  "package": "8-lessons",
  "amount": 300,
  "paymentStatus": "completed",
  "paymentIntentId": "pi_1234567890",
  "registrationDate": "2024-01-15T10:30:00Z"
}
```

## 🔧 Development vs Production

### Development Mode
```bash
npm run dev  # Uses nodemon for auto-restart
```
- Detailed error messages
- Console logging
- Test Stripe keys
- Local email simulation

### Production Mode
```bash
NODE_ENV=production npm start
```
- Minimal error exposure
- Production Stripe keys
- Real email sending
- Enhanced security

## 📱 Admin Features

### View Demo Bookings
GET `/api/demos` returns:
```json
{
  "success": true,
  "data": [
    {
      "id": "DEMO-123456-XYZ",
      "firstName": "John",
      "email": "john@example.com",
      "frenchLevel": "beginner",
      "preferredDate": "2024-01-20",
      "status": "pending"
    }
  ]
}
```

### View Registrations
GET `/api/registrations` returns detailed registration data with payment status.

## 🛠️ Customization

### Adding New Payment Methods
1. Update `routes/stripe.js`
2. Add validation rules
3. Create email template
4. Update frontend form

### Database Migration
To use a real database instead of JSON files:
1. Install database driver (`pg`, `mysql2`, etc.)
2. Replace `services/data.js` functions
3. Update connection configuration

### Email Templates
Edit templates in `services/email.js`:
- `sendDemoConfirmation()` - Demo booking emails
- `sendRegistrationConfirmation()` - Payment confirmations
- `sendBankTransferInstructions()` - Bank transfer details

## 🚨 Troubleshooting

### Common Issues

**❌ "Email not configured"**
- Check Gmail app password
- Verify 2FA is enabled
- Test with different email service

**❌ "Stripe key not found"**
- Verify `.env` file exists
- Check Stripe key format (starts with `sk_` or `pk_`)
- Ensure no extra spaces in .env

**❌ "Permission denied" errors**
- Check file permissions: `chmod 755 ./data`
- Verify Node.js can write to project directory

**❌ Payment not working**
- Check Stripe publishable key in frontend
- Verify webhook endpoints in Stripe dashboard
- Test with Stripe test card: `4242 4242 4242 4242`

### Logs and Debugging
```bash
# View server logs
tail -f server.log

# Test API endpoints
curl http://localhost:3001/api/health

# Check data files
cat ./data/registrations.json
```

## 🌐 Going Live

### 1. Deploy to Server
Popular options:
- **Heroku**: Easy deployment, free tier available
- **DigitalOcean**: VPS with full control
- **Vercel**: Serverless deployment
- **Railway**: Modern hosting platform

### 2. Domain and SSL
- Point domain to your server
- Set up SSL certificate (Let's Encrypt)
- Update `FRONTEND_URL` in `.env`

### 3. Production Checklist
- [ ] Switch to live Stripe keys
- [ ] Set `NODE_ENV=production`
- [ ] Configure real email account
- [ ] Set up monitoring and logging
- [ ] Test all payment flows
- [ ] Set up database backups

## 💡 Tips for Success

1. **Test thoroughly** with Stripe test cards before going live
2. **Monitor email delivery** - check spam folders
3. **Keep backups** of your data files
4. **Use HTTPS** in production for security
5. **Set up monitoring** to track server health

## 🆘 Need Help?

Your backend is **production-ready**! It handles:
- ✅ Real Stripe payments
- ✅ Professional email notifications
- ✅ Secure data storage
- ✅ Error handling and logging
- ✅ Rate limiting and security

The system is designed to scale with your tutoring business from day one!

## 📈 Next Steps

1. **Test everything** with the demo and registration forms
2. **Set up your Stripe account** and replace test keys
3. **Configure Gmail** for email notifications
4. **Deploy to production** when ready
5. **Monitor and maintain** your thriving French tutoring business!

---

**Your complete French tutoring website with payment processing is ready to launch! 🚀** 