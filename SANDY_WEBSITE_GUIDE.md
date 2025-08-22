# 🌟 Sandy's French Tutor Website Management Guide

**Welcome Sandy! This guide will help you manage and update your website `sandhyamadame.in` independently.**

---

## 📋 **Table of Contents**
1. [Getting Started with Cursor IDE](#cursor-ide)
2. [Setting Up GitHub Account](#github-setup)  
3. [Getting Your Website Code](#getting-code)
4. [Making Changes to Your Website](#making-changes)
5. [Publishing Changes Live](#publishing-changes)
6. [Managing Railway Hosting](#railway-management)
7. [Troubleshooting Common Issues](#troubleshooting)
8. [Important Contact Information](#contact-info)

---

## 🖥️ **1. Getting Started with Cursor IDE** {#cursor-ide}

Cursor IDE is your website editing tool - think of it as Microsoft Word, but for websites.

### **Step 1.1: Install Cursor IDE**

1. **Download Cursor:**
   - Go to: https://cursor.sh
   - Click **"Download for Windows"**
   - Wait for download to complete

2. **Install Cursor:**
   - Double-click the downloaded file
   - Follow the installation wizard (click "Next" → "Next" → "Install")
   - Launch Cursor when installation completes

3. **First Time Setup:**
   - Cursor will ask you to sign up - **use your personal email**
   - Choose the **Free Plan** (it's sufficient for your needs)
   - Complete the welcome tutorial if prompted

### **Step 1.2: Understanding Cursor Interface**

When you open Cursor, you'll see:
- **Left Panel:** Your website files (like folders on your computer)
- **Main Area:** Where you edit content
- **Bottom Panel:** Terminal (like a command prompt)
- **Right Panel:** AI Chat (your assistant for making changes)

---

## 🐙 **2. Setting Up GitHub Account** {#github-setup}

GitHub stores your website code safely in the cloud - like Google Drive for websites.

### **Step 2.1: Create GitHub Account**

1. **Sign Up:**
   - Go to: https://github.com
   - Click **"Sign up"**
   - Use **your personal email accoutn or create a new email and use that so that you will have one email exclusively for github** 
   - Create a strong password
   - Choose a username of your choice (e.g., `sandyp`, `sandhyaprasanna`, or any name you prefer)
   - **Tip:** Choose something you can use for future projects too!

2. **Verify Your Account:**
   - Check your email for verification link
   - Click the link to verify

3. **Choose Free Plan:**
   - Select **"Free"** plan (perfect for your needs)
   - Skip team setup for now

### **Step 2.2: Getting Your Website Code to GitHub**

**⚠️ IMPORTANT:** Ask the person who set up your website to:
1. Transfer the code repository to your GitHub account
2. Make you the owner of the repository
3. Provide you with the repository link

You should receive a link like: `https://github.com/YOUR_USERNAME/FrenchTutor`

---

## 💻 **3. Getting Your Website Code** {#getting-code}

Now let's get your website code into Cursor so you can edit it.

### **Step 3.1: Clone Your Repository**

1. **Open Cursor IDE**

2. **Open Terminal:**
   - Click **"Terminal"** in the top menu
   - Select **"New Terminal"**
   - A black box will appear at the bottom

3. **Download Your Code:**
   - In the terminal, type:
   ```
   git clone https://github.com/YOUR_USERNAME/FrenchTutor
   ```
   - Replace `YOUR_USERNAME` with your actual GitHub username
   - Press **Enter**

4. **Open Your Website Folder:**
   - Click **"File"** → **"Open Folder"**
   - Navigate to the **"FrenchTutor"** folder that was just created
   - Click **"Open"**

**🎉 Success!** You should now see your website files in the left panel.

---

## ✏️ **4. Making Changes to Your Website** {#making-changes}

This is where the magic happens! You can ask Cursor's AI to help you make any changes.

### **Step 4.1: How to Ask for Changes**

1. **Open AI Chat:**
   - Look for the chat icon (💬) on the right side
   - Or press **Ctrl + L** (shortcut)

2. **Ask for What You Want:**
   Write natural requests like:
   - *"Change my phone number to +91 98765 43210"*
   - *"Update the pricing from ₹3,500 to ₹4,000"*
   - *"Add a new testimonial to the home page"*
   - *"Change the class timing from 6 PM to 7 PM"*

3. **Be Specific:**
   - Mention which page you want to change
   - Give exact text you want to replace
   - Provide new content you want to add

### **Step 4.2: Accepting Changes**

When Cursor suggests changes:

1. **Review the Changes:**
   - Cursor will show you exactly what it wants to change
   - Green text = new content being added
   - Red text = old content being removed

2. **Accept the Changes:**
   - If you're happy with the changes, click **"Accept"**
   - If not, click **"Reject"** and ask for modifications

3. **Test Your Changes:**
   - Ask Cursor: *"How do I test these changes locally?"*
   - Follow the instructions to see your changes before publishing

### **Step 4.3: Common Change Requests**

Here are examples of changes you might want:

**Pricing Updates:**
```
"Update all pricing from ₹3,500 to ₹4,000 for elementary level students"
```

**Contact Information:**
```
"Change my phone number from +91 98765 43210 to +91 XXXXX XXXXX across the entire website"
```

**Schedule Changes:**
```
"Update class timings from 6-7 PM to 7-8 PM in all places"
```

**Content Updates:**
```
"Add a new testimonial on the home page: 'Sandy helped my daughter excel in French!' - Parent from Delhi"
```

---

## 🚀 **5. Publishing Changes Live** {#publishing-changes}

After making changes, you need to publish them so they appear on your live website.

### **Step 5.1: Saving Changes to GitHub**

1. **Check What Changed:**
   - In terminal, type: `git status`
   - This shows you which files were modified

2. **Stage Your Changes:**
   - Type: `git add .`
   - This prepares all changes for saving

3. **Save Changes with Message:**
   - Type: `git commit -m "Updated pricing and contact info"`
   - Replace the message with what you actually changed

4. **Upload to GitHub:**
   - Type: `git push`
   - Your changes are now saved on GitHub

### **Step 5.2: Automatic Deployment**

**Good news!** Your website is set up for automatic deployment:
- Once you push to GitHub, Railway automatically updates your live website
- Wait 2-3 minutes, then check `sandhyamadame.in`
- Your changes should be live!

---

## ☁️ **6. Managing Railway Hosting** {#railway-management}

Railway hosts your website and keeps it running 24/7.

### **Step 6.1: Accessing Railway**

1. **Login to Railway:**
   - Go to: https://railway.app
   - Login with the account used during setup
   - You should see your **FrenchTutor** project

2. **Check Website Status:**
   - Click on **FrenchTutor** project
   - Look for **"Active"** status (green)
   - If it shows **"Crashed"** (red), there's an issue

### **Step 6.2: Managing Environment Variables**

Sometimes you need to update settings (like email passwords):

1. **Go to Settings:**
   - Click your **FrenchTutor** service
   - Click **"Settings"** tab
   - Scroll to **"Environment Variables"**

2. **Update Variables:**
   - Find the variable you need to change
   - Click **"Edit"**
   - Update the value
   - Click **"Save"**

3. **Deploy Changes:**
   - After updating variables, click **"Deploy"** button (top-left)
   - Wait for deployment to complete

### **Step 6.3: Checking Logs**

If something isn't working:

1. **View Logs:**
   - Go to your FrenchTutor service
   - Click **"Logs"** tab
   - Look for red error messages

2. **Common Issues:**
   - **"Connection timeout"** = Email service issue
   - **"Environment variable undefined"** = Missing settings
   - **"404 error"** = File not found

---

## 🔧 **7. Troubleshooting Common Issues** {#troubleshooting}

### **Problem: Changes Not Showing on Website**

**Solution:**
1. Check if you pushed to GitHub: `git status`
2. Wait 5 minutes for deployment
3. Hard refresh your browser: **Ctrl + F5**
4. Check Railway logs for errors

### **Problem: Git Push Fails**

**Common Error:** *"Please tell me who you are"*

**Solution:**
```
git config --global user.email "sandy.frenchtutor@gmail.com"
git config --global user.name "Sandhya Prasanna"
```

### **Problem: Website Shows Error**

**Solution:**
1. Check Railway logs
2. Look for red error messages
3. Most common: environment variables missing
4. Contact support if needed

### **Problem: Email Confirmations Not Sending**

**Solution:**
1. Check Railway environment variables
2. Ensure `GMAIL_APP_PASSWORD` is set correctly
3. Verify `EMAIL_FROM` format is correct

### **Problem: Payments Not Working**

**Solution:**
1. Check Stripe dashboard for errors
2. Verify all `STRIPE_*` environment variables are set
3. Test with Stripe test card: `4242 4242 4242 4242`

---

## 📞 **8. Important Contact Information** {#contact-info}

### **Your Account Details:**
- **Website:** https://sandhyamadame.in
- **GitHub:** https://github.com/YOUR_USERNAME/FrenchTutor
- **Railway:** https://railway.app (your project: FrenchTutor)
- **Email Service:** sandy.frenchtutor@gmail.com
- **Stripe Dashboard:** https://dashboard.stripe.com

### **Emergency Contacts:**
If you're completely stuck: just ask Cursor AI chat for help. Look for logs as mentioend above and just paste those logs in chat. Cursor will help to find the issue.
Ask Cursor to give you step by step instructions and ask it to wait for your confirmation before proceeding to next step.

### **Quick Reference Commands:**

**Check status:** `git status`  
**Save changes:** `git add . && git commit -m "your message"`  
**Publish changes:** `git push`  
**Start local server:** `npm start`

---

## 🎉 **Congratulations!**

You now have everything you need to independently manage your French tutoring website! 

**Remember:**
- ✅ Start small with simple text changes
- ✅ Always test changes before publishing
- ✅ Save your work frequently
- ✅ Don't be afraid to ask Cursor's AI for help
- ✅ Keep this guide handy for reference

**Your website is professional, secure, and ready to help you grow your French tutoring business!** 🇫🇷✨
