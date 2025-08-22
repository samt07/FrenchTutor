# 🔄 **Website Transfer Checklist for Sandy**

**Use this checklist to properly transfer the French Tutor website to Sandy for independent management.**

---

## 📋 **Pre-Transfer Checklist**

### ✅ **1. GitHub Repository Transfer**

**Current Repository:** Make sure the code is in your GitHub account first.

**Steps to Transfer:**
1. Go to your GitHub repository settings
2. Scroll to **"Danger Zone"** 
3. Click **"Transfer ownership"**
4. Enter Sandy's GitHub username (whatever she chose during signup)
5. Confirm the transfer

**⚠️ Important:** Sandy must have a GitHub account first!

### ✅ **2. Railway Project Transfer**

**Steps to Transfer:**
1. Login to Railway: https://railway.app
2. Go to your **FrenchTutor** project
3. Click **"Settings"** → **"General"**
4. Scroll to **"Transfer Project"**
5. Enter Sandy's Railway email: `sandy.frenchtutor@gmail.com`
6. Confirm the transfer

**Alternative:** Add Sandy as a collaborator if transfer isn't available:
1. Project Settings → **"Members"**
2. Add Sandy's email with **"Admin"** role

### ✅ **3. Environment Variables Documentation**

**Create a secure document with all environment variables:**

```
# Railway Environment Variables for Sandy
NODE_ENV=production

# Stripe Keys (Live)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_ELEMENTARY_PRICE_ID=price_xxxxx
STRIPE_MIDDLE_PRICE_ID=price_xxxxx
STRIPE_HIGH_PRICE_ID=price_xxxxx

# Email Configuration
EMAIL_USER=sandy.frenchtutor@gmail.com
EMAIL_PASS=[App Password - 16 characters]
EMAIL_FROM="FrenchTutor" <sandy.frenchtutor@gmail.com>

# Business Details
BUSINESS_EMAIL=sandy.frenchtutor@gmail.com
BUSINESS_PHONE=+91 98765 43210
```

**⚠️ Send this securely** (encrypted email or secure file sharing)

### ✅ **4. Account Access Transfer**

**Stripe Account:**
- Sandy should create her own Stripe account
- OR transfer ownership of existing Stripe account
- Update webhook endpoints to new Railway URL

**Domain Management:**
- Transfer `sandhyamadame.in` domain to Sandy's registrar account
- OR provide Sandy with domain management access

**Email Account:**
- `sandy.frenchtutor@gmail.com` - Sandy already has this
- Ensure 2FA is enabled
- App Password is documented

---

## 📖 **Sandy's Learning Path**

### **Week 1: Basic Setup**
- [ ] Install Cursor IDE
- [ ] Set up GitHub account
- [ ] Clone repository locally
- [ ] Make first simple change (like updating phone number)
- [ ] Practice git commands: add, commit, push

### **Week 2: Content Management**
- [ ] Update pricing
- [ ] Add testimonials
- [ ] Modify class schedules
- [ ] Update about page content

### **Week 3: Advanced Management**
- [ ] Monitor Railway logs
- [ ] Update environment variables
- [ ] Handle basic troubleshooting
- [ ] Monitor Stripe dashboard

---

## 🆘 **Support Transition**

### **Initial Support (First Month):**
- Be available for urgent issues
- Help with first few changes
- Guide through first deployment
- Troubleshoot any major issues

### **Gradual Independence:**
- Sandy should try solving issues first using the guide
- Encourage using Cursor AI for help
- Point to official documentation
- Reduce dependency over time

### **Emergency Contact:**
- Provide your contact for critical website-down situations
- Set clear boundaries for support availability
- Consider creating a simple support agreement

---

## 🔐 **Security Handover**

### **Important Passwords to Share:**
- [ ] GitHub repository access (if not transferred)
- [ ] Railway project access
- [ ] Environment variables (securely)
- [ ] Domain registrar login (if applicable)

### **Passwords Sandy Already Has:**
- [x] `sandy.frenchtutor@gmail.com` email
- [x] Gmail App Password
- [x] Stripe account (if transferred)

### **Security Recommendations:**
- Change all shared passwords after handover
- Enable 2FA on all accounts
- Use password manager for Sandy
- Regular security reviews

---

## ✅ **Final Verification**

Before considering the transfer complete:

- [ ] Sandy can successfully make a small change
- [ ] Sandy can push changes to GitHub
- [ ] Changes appear on live website (`sandhyamadame.in`)
- [ ] All environment variables work correctly
- [ ] Railway deployment is successful
- [ ] Email confirmations are working
- [ ] Stripe payments are processing
- [ ] Sandy has the complete helper guide
- [ ] Support contact information is exchanged

---

## 📞 **Emergency Contacts for Sandy**

**Your Contact:** [Your name and contact info]
**Available for:** Critical website-down issues only
**Response time:** Within 24 hours
**Duration:** First 3 months after transfer

**Platform Support:**
- **Cursor:** help@cursor.sh
- **GitHub:** support.github.com  
- **Railway:** help@railway.app
- **Stripe:** support.stripe.com

---

## 🎯 **Success Metrics**

**Transfer is successful when:**
✅ Sandy can independently make content changes  
✅ Sandy can publish changes to live website  
✅ Sandy can handle basic troubleshooting  
✅ All payments and emails are working  
✅ Website is fully functional on `sandhyamadame.in`  

**🎉 Congratulations! Sandy is now an independent website owner!**

---

*Created: January 2025*  
*Website: sandhyamadame.in*  
*Transfer Guide for French Tutor Website* 