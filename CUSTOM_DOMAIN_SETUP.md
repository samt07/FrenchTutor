# 🌐 Custom Domain Setup Guide
*Complete step-by-step guide for connecting your custom domain to Railway*

---

## 📋 **Prerequisites**
- ✅ Railway account with deployed application
- ✅ Credit/debit card for domain purchase
- ✅ Business email address

---

## 🚀 **Step 1: Purchase Your Domain**

### **Recommended Domain Registrars for .in domains:**
- **BigRock**: https://www.bigrock.in (Used in our setup)
- **GoDaddy India**: https://in.godaddy.com
- **Namecheap**: https://www.namecheap.com
- **ResellerClub**: https://www.resellerclub.com

### **Purchase Process:**
1. Go to your chosen domain registrar
2. Search for your desired domain (e.g., `reussirfrench.in`)
3. Add to cart and complete purchase
4. Use your business email for registration
5. Keep registration confirmation email

**💰 Expected Cost:** ₹500-800 per year for .in domains

---

## 🔧 **Step 2: Configure Railway Domain**

### **Get Railway Application Domain:**
1. **Login to Railway:** https://railway.app
2. **Select your project** (e.g., FrenchTutor)
3. **Click on your service**
4. **Go to Settings tab**
5. **Find Domains section**
6. **Note your current Railway domain** (e.g., `yourapp-production.up.railway.app`)

### **Add Custom Domain to Railway:**
1. **In Railway Domains section**, click **"Add Domain"**
2. **Enter your domain:** `www.yourdomain.in` 
   - ⚠️ **Important:** Use WWW version due to DNS limitations
3. **Railway will provide a CNAME target** (e.g., `abc123.up.railway.app`)
4. **Copy this CNAME value** - you'll need it for DNS setup

**🔑 Key Point:** Railway Free tier allows only **ONE custom domain**

---

## 📡 **Step 3: Configure DNS Records**

### **Access DNS Management:**
1. **Login to your domain registrar**
2. **Find "DNS Management" or "Domain Management"**
3. **Look for DNS records or CNAME records section**

### **Add CNAME Record:**

**For BigRock (and similar interfaces):**
- **Type:** `CNAME`
- **Domain/Subdomain:** `www` 
- **Subdomain/FullyQualified Domain:** `[Railway's CNAME target]`
- **TTL:** `1 hour` or `4 hours`

**For GoDaddy/Namecheap:**
- **Type:** `CNAME`
- **Name:** `www`
- **Value/Target:** `[Railway's CNAME target]`
- **TTL:** `3600` (1 hour)

### **Important DNS Notes:**
- ❌ **Don't include `https://`** in the target value
- ❌ **Don't let registrar auto-append your domain** to Railway's target
- ✅ **Use only Railway's exact CNAME value**
- ✅ **Use WWW subdomain** to avoid root domain conflicts

---

## 🚨 **Common DNS Issues & Solutions**

### **Issue 1: Root Domain Conflict**
**Error:** "CNAME cannot be added for @ as there is an existing record"

**Solution:** Use WWW subdomain instead of root domain
- ✅ Use: `www.yourdomain.in`
- ❌ Avoid: `yourdomain.in` (root domain has NS records)

### **Issue 2: Auto-Appended Domain**
**Problem:** Registrar adds `.yourdomain.in` to Railway's target

**Solution:** 
- Enter **only** Railway's CNAME value
- Check that second field shows: `abc123.up.railway.app`
- **Not:** `abc123.up.railway.app.yourdomain.in`

### **Issue 3: Wrong Field Mapping**
**Problem:** Railway target and domain name in wrong fields

**Correct CNAME Setup:**
- **FROM:** Your domain (`www.yourdomain.in`)
- **TO:** Railway's target (`abc123.up.railway.app`)

---

## ⏱️ **Step 4: Wait for DNS Propagation**

### **Expected Timeline:**
- **Normal:** 10-30 minutes
- **Maximum:** Up to 24 hours (rare)
- **Most common:** 15-45 minutes

### **Railway Status Indicators:**
- 🟡 **"Waiting for DNS update"** → DNS propagating (normal)
- 🟢 **"Active" or "Connected"** → Domain live!
- 🔴 **"Error"** → Check DNS configuration

### **Check DNS Propagation:**
1. **Visit:** https://dnschecker.org
2. **Enter:** `www.yourdomain.in`
3. **Select:** `CNAME`
4. **Look for green checkmarks** spreading globally

---

## ✅ **Step 5: Verification & Testing**

### **1. Check Railway Status:**
- **Go to Railway > Settings > Domains**
- **Status should show:** "Active" or "Connected"
- **SSL should be:** Automatically issued

### **2. Test Your Domain:**
- **Open:** `https://www.yourdomain.in`
- **Should show:** Your website with 🔒 secure connection
- **Browser should:** Display your custom domain in URL bar

### **3. SSL Certificate Verification:**
- **Look for:** 🔒 lock icon in browser
- **Certificate should be:** Valid and issued by Railway/Let's Encrypt

---

## 🔄 **Optional: Root Domain Redirect**

### **Set up URL Forwarding (in Domain Registrar):**
1. **Find "URL Forwarding" or "Domain Redirect"**
2. **From:** `yourdomain.in`
3. **To:** `www.yourdomain.in`
4. **Type:** 301 Permanent Redirect

**This allows:** `yourdomain.in` → automatically redirects to → `www.yourdomain.in`

---

## 🛠️ **Troubleshooting Guide**

### **"Site Can't Be Reached" Errors:**
1. **Wait longer** - DNS can take up to 24 hours
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Try incognito mode** or different browser
4. **Test from mobile data** (different DNS servers)
5. **Check DNS propagation** at dnschecker.org

### **Railway Still Shows "Waiting":**
1. **Verify CNAME record** matches Railway's exact target
2. **Check for typos** in domain registrar DNS settings
3. **Ensure no extra domain suffixes** on Railway's target
4. **Wait 30 minutes minimum** before troubleshooting

### **SSL Certificate Issues:**
1. **Wait for Railway** to auto-issue certificate
2. **Check domain is "Active"** before expecting SSL
3. **SSL typically takes 5-15 minutes** after domain activation

---

## 📞 **Support Resources**

### **Railway Issues:**
- **Railway Support:** help@railway.app
- **Railway Documentation:** https://docs.railway.app

### **DNS/Domain Issues:**
- **BigRock Support:** support@bigrock.in
- **GoDaddy Support:** https://in.godaddy.com/help
- **Namecheap Support:** https://www.namecheap.com/support/

### **Online Tools:**
- **DNS Checker:** https://dnschecker.org
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

## 🎯 **Success Checklist**

- [ ] Domain purchased from registrar
- [ ] Custom domain added to Railway
- [ ] CNAME record configured in DNS
- [ ] Railway status shows "Active"
- [ ] Website loads at `https://www.yourdomain.in`
- [ ] SSL certificate is valid (🔒 lock icon)
- [ ] Optional: Root domain redirect set up

---

## 💡 **Pro Tips**

1. **Always use WWW** subdomain to avoid DNS conflicts
2. **Double-check CNAME values** - typos cause failures
3. **Be patient** - DNS propagation takes time
4. **Test from multiple locations** to verify global propagation
5. **Keep Railway CNAME target handy** for future reference
6. **Screenshot successful DNS settings** for backup

---

## 🔐 **Security Notes**

- ✅ **SSL certificates** are automatically issued by Railway
- ✅ **HTTPS is enforced** by default
- ✅ **Domain verification** prevents unauthorized use
- ⚠️ **Keep domain registrar account secure** with strong passwords

---

**🎉 Congratulations! Your custom domain should now be live and secure!**

---

*Last updated: January 2025*  
*Based on successful setup of: reussirfrench.in → Railway deployment* 