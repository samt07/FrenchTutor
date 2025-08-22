# 📱 Mobile App Testing Guide
*Step-by-step instructions to test your French Tutor mobile app*

---

## 🚀 **Getting Started - Initial Setup**

### **Step 1: Install Prerequisites**

#### **Install Node.js**
1. Go to: https://nodejs.org/
2. Download and install the **LTS version** (recommended)
3. Open Command Prompt/Terminal and verify: `node --version`

#### **Install Expo CLI**
1. Open Command Prompt/Terminal as Administrator
2. Run: `npm install -g @expo/cli`
3. Verify installation: `expo --version`

#### **Install Expo Go App on Your Phone**
- **Android**: Download from Google Play Store
- **iOS**: Download from Apple App Store
- Search for "Expo Go" and install

---

## 📦 **Step 2: Project Setup**

### **Navigate to Mobile App Directory**
1. Open Command Prompt/Terminal
2. Navigate to your project:
   ```bash
   cd "C:\Users\236305\OneDrive - Cognizant\Desktop\Vibe Coding week\FrenchTutor\FrenchTutorMobile"
   ```

### **Install Dependencies**
1. Run the following command:
   ```bash
   npm install
   ```
2. **Wait for completion** (may take 2-5 minutes)
3. You should see "added X packages" message

### **Install Expo Package (Fix Common Issues)**
1. Install the Expo package specifically:
   ```bash
   npm install expo
   ```
2. This fixes the "Cannot determine Expo SDK version" error
3. Wait for completion

---

## 🏃‍♂️ **Step 3: Start the Development Server**

### **Launch the App**
1. In the same Command Prompt/Terminal, run:
   ```bash
   npm start
   ```
   OR
   ```bash
   expo start
   ```

2. **Wait for the server to start** - you'll see:
   ```
   Metro waiting on exp://192.168.x.x:8081
   › Press s │ switch to development build
   › Press a │ open Android
   › Press i │ open iOS simulator
   › Press w │ open web
   › Press r │ reload app
   › Press m │ toggle menu
   ```

3. **QR Code will appear** in the terminal or browser

---

## 📱 **Step 4: Run on Your Phone (Recommended)**

### **Android Phone Testing:**
1. **Open Expo Go app** on your Android phone
2. **Tap "Scan QR code"**
3. **Point camera at the QR code** in your terminal/browser
4. **Wait for app to load** (first time may take 1-2 minutes)
5. **App should open** with the French Tutor home screen

### **iPhone Testing:**
1. **Open Camera app** on your iPhone
2. **Point at the QR code** - a banner will appear
3. **Tap the banner** to open in Expo Go
4. **Wait for app to load**
5. **App should open** with the French Tutor home screen

---

## 🖥️ **Step 5: Alternative - Test in Web Browser**

If phone testing doesn't work:
1. In the terminal, **press 'w'**
2. **Browser will open** with the app running
3. **Use browser dev tools** to simulate mobile view:
   - Press F12
   - Click mobile device icon
   - Choose iPhone/Android preset

---

## 🧪 **Step 6: Testing Each Screen**

### **🏠 Home Screen Testing**
✅ **What to Check:**
- [ ] App opens to Home screen with gradient header
- [ ] "Master French with Sandy" title displays
- [ ] Four feature cards show with icons
- [ ] Quick action buttons work (Book Demo, View Classes, etc.)
- [ ] Contact information shows at bottom
- [ ] Navigation tabs at bottom (Home, Classes, About, Demo, Portal)

✅ **Test Actions:**
- [ ] Tap "Start Learning French" button → Should go to Classes screen
- [ ] Tap quick action cards → Should navigate to respective screens
- [ ] Tap bottom navigation tabs → Should switch screens

### **🎓 Classes Screen Testing**
✅ **What to Check:**
- [ ] Three class plans display (Elementary, Middle, High)
- [ ] Pricing shows for each plan (₹55, ₹65, ₹75 per month)
- [ ] Education boards chips display
- [ ] "Enroll Now" buttons work
- [ ] "What's Included" section shows

✅ **Test Actions:**
- [ ] Tap "Enroll Now" → Should go to Registration screen
- [ ] Check different plan prices display correctly
- [ ] Scroll through all content smoothly

### **👩‍🏫 About Screen Testing**
✅ **What to Check:**
- [ ] Sandy's profile section with person icon
- [ ] "Sandhya Prasanna (Sandy)" name displays
- [ ] Qualifications cards show with icons
- [ ] Track record achievements list
- [ ] Teaching philosophy quote section
- [ ] Contact buttons work

✅ **Test Actions:**
- [ ] Tap "Book Free Demo" → Should go to Demo screen
- [ ] Tap "View Classes" → Should go to Classes screen
- [ ] All text displays properly and readable

### **▶️ Demo Screen Testing**
✅ **What to Check:**
- [ ] Demo booking form loads
- [ ] All input fields present (Name, Email, Phone, Age)
- [ ] French level radio buttons work
- [ ] Grade level selection works
- [ ] Time slot options show (Morning, Afternoon, Evening)
- [ ] Form validation works (try submitting empty form)

✅ **Test Actions:**
- [ ] Fill out complete form with valid data
- [ ] Try submitting with invalid email → Should show error
- [ ] Try submitting without required fields → Should show errors
- [ ] Submit valid form → Should show success/API response

**📧 Expected Result:** Form submission will either:
- Show success message if backend is accessible
- Show network error if backend is not reachable (this is normal in testing)

### **👤 Student Portal Testing**
✅ **What to Check:**
- [ ] Login form displays
- [ ] Email and Subscription ID fields present
- [ ] Help section shows contact info
- [ ] Form validation works

✅ **Test Actions:**
- [ ] Try logging in with test credentials:
  - Email: `test@example.com`
  - Subscription ID: `sub_test123`
- [ ] Check form validation with invalid inputs
- [ ] Verify error messages display properly

**📧 Expected Result:** 
- Will show "Login Failed" since test credentials don't exist
- This is normal - real login requires actual student data

### **📝 Registration Screen Testing**
✅ **What to Check:**
- [ ] Multi-section registration form
- [ ] Personal information fields
- [ ] French level selection
- [ ] Grade level with pricing
- [ ] Time slot preferences
- [ ] Registration summary shows
- [ ] Terms & conditions checkboxes

✅ **Test Actions:**
- [ ] Fill out all required fields
- [ ] Select different grade levels → Prices should update
- [ ] Try submitting without checking terms → Should show error
- [ ] Complete valid form → Should go to Payment screen

### **💳 Payment Screen Testing**
✅ **What to Check:**
- [ ] Registration summary displays
- [ ] Payment method selection (Card/Bank Transfer)
- [ ] Bank transfer instructions appear
- [ ] Contact support section

✅ **Test Actions:**
- [ ] Select Card payment → Should show "Coming Soon" message
- [ ] Select Bank Transfer → Should show instructions
- [ ] Tap "Complete Registration" → Should show confirmation or API error

---

## ✅ **Step 7: What Should Work vs Expected Issues**

### **🟢 What Should Work Perfectly:**
- ✅ **App Navigation** - All screens accessible via tabs
- ✅ **UI/UX** - Beautiful design, smooth scrolling, responsive
- ✅ **Form Validation** - Real-time error checking
- ✅ **Local Features** - Everything that doesn't require backend

### **🟡 What Might Show Errors (Normal):**
- ⚠️ **API Calls** - May fail if backend is not accessible from your network
- ⚠️ **Demo Booking** - Will show network error if backend unreachable
- ⚠️ **Registration** - May fail at payment step due to API connectivity
- ⚠️ **Student Login** - Will fail without real student credentials

### **🔴 Expected Error Messages:**
- `"Failed to load pricing information"` - Normal if backend not accessible
- `"Network request failed"` - Normal connectivity issue
- `"Login Failed"` - Expected with test credentials

---

## 🔧 **Step 8: Troubleshooting Common Issues**

### **🚨 App Won't Start**
**Problem:** `npm start` fails
**Solution:**
1. Install Expo package: `npm install expo`
2. If still fails, delete `node_modules` folder
3. Run `npm install` again
4. Run `npm install expo` again

### **🚨 "Expo is not recognized" Error**
**Problem:** `'expo' is not recognized as an internal or external command`
**Solution:**
1. The `package.json` has been updated to use `npx expo` 
2. Run `npm install expo` in the project directory
3. Use `npm start` instead of `expo start`
4. Global Expo CLI installation not required

### **🚨 "Cannot determine Expo SDK version" Error**
**Problem:** `ConfigError: Cannot determine the project's Expo SDK version because the module 'expo' is not installed`
**Solution:**
1. Run `npm install expo` in the project directory
2. This installs the required Expo module locally
3. Then run `npm start` again
4. This is a common issue with fresh installations

### **🚨 QR Code Not Working**
**Problem:** Expo Go can't scan QR code
**Solution:**
1. Ensure phone and computer on same WiFi network
2. Try pressing 'w' to open in web browser instead
3. Manually type the URL shown in terminal into Expo Go

### **🚨 App Crashes on Phone**
**Problem:** App closes immediately
**Solution:**
1. Close and restart Expo Go app
2. Try clearing Expo Go cache in phone settings
3. Use web browser testing instead

### **🚨 Network Errors in App**
**Problem:** API calls fail
**Solution:**
1. This is expected if testing locally
2. Check if `https://www.reussirfrench.in` is accessible in browser
3. Continue testing UI/UX features

### **🚨 Slow Loading**
**Problem:** App takes long time to load
**Solution:**
1. First load always takes longer (1-2 minutes)
2. Subsequent loads should be faster
3. Use faster internet connection if available

---

## 📋 **Step 9: Testing Checklist**

### **Basic Functionality Test:**
- [ ] App starts without crashing
- [ ] All 5 tabs work (Home, Classes, About, Demo, Portal)
- [ ] Navigation between screens works
- [ ] Forms can be filled out
- [ ] Buttons respond to taps
- [ ] Scrolling works smoothly

### **Visual Design Test:**
- [ ] Colors match website theme (navy blue, bright blue)
- [ ] Text is readable on mobile screen
- [ ] Icons display properly
- [ ] Cards and buttons look professional
- [ ] Gradient headers look good

### **User Experience Test:**
- [ ] App feels intuitive to navigate
- [ ] Form validation provides helpful feedback
- [ ] Loading states show when appropriate
- [ ] Error messages are user-friendly
- [ ] Contact information is easily accessible

---

## 📊 **Step 10: Test Results Documentation**

### **Create Test Report:**
After testing, note:

✅ **What Works:**
- List all successful features
- Note smooth navigation
- Confirm UI looks good

⚠️ **What Shows Errors:**
- Note any API errors (expected)
- Document any crashes or issues
- List any visual problems

🔄 **Recommendations:**
- Suggest any improvements
- Note any confusing user flows
- Recommend additional features

---

## 🎯 **Expected Test Outcomes**

### **Successful Test Session:**
- App loads and runs smoothly
- All screens accessible and functional
- Forms work with proper validation
- Design looks professional and mobile-friendly
- Some API errors are normal and expected

### **What This Proves:**
✅ Mobile app is fully functional  
✅ UI/UX is production-ready  
✅ Forms and validation work correctly  
✅ Navigation system is solid  
✅ Ready for real backend integration  
✅ Professional enough for app store submission  

---

## 📞 **Need Help?**

### **If Testing Fails:**
1. **Check Prerequisites** - Node.js, Expo CLI installed correctly
2. **Try Web Browser** - Press 'w' in terminal to open in browser
3. **Restart Everything** - Close terminal, restart, try again
4. **Network Issues** - Try different WiFi network

### **If Everything Works:**
🎉 **Congratulations!** Your mobile app is ready and working perfectly!

### **Next Steps After Successful Testing:**
1. **Share with Sandy** - Show her the working app
2. **Consider App Store Publishing** - If you want wider distribution
3. **Plan Updates** - Add features like Stripe payments, push notifications
4. **Monitor Usage** - Track how students use the mobile app

---

## **📋 Quick Command Reference**

### **Complete Setup Commands:**
```bash
# Navigate to mobile app directory
cd "C:\Users\236305\OneDrive - Cognizant\Desktop\Vibe Coding week\FrenchTutor\FrenchTutorMobile"

# Install all dependencies (fixes common Expo issues)
npm install
npm install expo

# Start the app
npm start
```

### **If Problems Occur:**
```bash
# Reset everything
rm -rf node_modules (or delete folder manually on Windows)
npm install
npm install expo
npm start
```

**📱 Your French Tutor mobile app is ready to help Sandy reach students on their smartphones!**

*Testing Guide Updated - January 2025*  
*Happy Testing! 🚀* 