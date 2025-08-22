# 📱 French Tutor Mobile App

A beautiful React Native mobile application for Sandy's French tutoring business, connecting students with expert French instruction across all education boards.

---

## 🌟 **Features**

### **✨ Core Functionality**
- **Student Registration** - Complete enrollment process with grade-level selection
- **Demo Booking** - Free 30-minute trial classes
- **Student Portal** - Account access and subscription management
- **Payment Integration** - Bank transfer support with card payments coming soon
- **Multi-Board Support** - CBSE, ICSE, IB, Cambridge, and international curricula

### **🎯 User Experience**
- **Beautiful UI** - Modern design with French-inspired color scheme
- **Smooth Navigation** - Tab-based navigation with screen stacks
- **Form Validation** - Real-time input validation and error handling
- **Responsive Design** - Optimized for all mobile screen sizes
- **Offline Capability** - Core features work without internet

### **🔧 Technical Features**
- **API Integration** - Seamlessly connects to existing backend
- **Cross-Platform** - Single codebase for iOS and Android
- **Type Safety** - Comprehensive error handling and validation
- **Performance Optimized** - Fast loading and smooth animations

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

### **Installation**

1. **Clone/Copy the Mobile App**
   ```bash
   cd FrenchTutorMobile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Update API Configuration**
   Edit `src/services/api.js` and update the BASE_URL:
   ```javascript
   const BASE_URL = 'https://www.reussirfrench.in/api';
   ```

4. **Start Development Server**
   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on Device/Simulator**
   - **Android**: `npm run android` or scan QR code with Expo Go app
   - **iOS**: `npm run ios` or scan QR code with Expo Go app
   - **Web**: `npm run web` for browser testing

---

## 📁 **Project Structure**

```
FrenchTutorMobile/
├── App.js                 # Main app entry point with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── babel.config.js       # Babel configuration
├── src/
│   ├── screens/          # All app screens
│   │   ├── HomeScreen.js
│   │   ├── AboutScreen.js
│   │   ├── ClassesScreen.js
│   │   ├── DemoScreen.js
│   │   ├── StudentPortalScreen.js
│   │   ├── RegistrationScreen.js
│   │   └── PaymentScreen.js
│   ├── services/         # API and external services
│   │   └── api.js        # Backend API integration
│   └── theme/            # Styling and theming
│       └── theme.js      # Colors, fonts, and styles
├── assets/               # Images, icons, splash screens
└── README.md            # This file
```

---

## 🎨 **Design System**

### **Color Palette**
- **Primary**: `#2c3e50` (Navy Blue)
- **Secondary**: `#3498db` (Bright Blue) 
- **Accent**: `#e74c3c` (Red)
- **Success**: `#27ae60` (Green)
- **Background**: `#f8f9fa` (Light Gray)

### **Typography**
- **Titles**: Bold, 28px, Primary color
- **Subtitles**: Regular, 18px, Text color
- **Body Text**: Regular, 16px, Text color
- **Buttons**: Bold, 16px, White/Primary

### **Components**
- **Cards**: Rounded corners, subtle shadows
- **Buttons**: Rounded, elevation for depth
- **Inputs**: Material Design style with floating labels

---

## 📱 **App Screens**

### **🏠 Home Screen**
- Welcome hero section with gradient background
- Key features highlighting Sandy's expertise
- Quick action buttons for main functions
- Contact information

### **👩‍🏫 About Screen** 
- Sandy's profile with photo placeholder
- Qualifications and teaching philosophy
- Track record and achievements
- Call-to-action buttons

### **🎓 Classes Screen**
- Three grade levels (Elementary, Middle, High)
- Pricing for each plan
- Education boards covered
- Feature comparisons

### **▶️ Demo Screen**
- Free demo booking form
- Student information collection
- French level assessment
- Time slot selection

### **👤 Student Portal**
- Login with email and subscription ID
- Account dashboard with student info
- Subscription status and details
- Quick actions and contact options

### **📝 Registration Screen**
- Multi-step registration form
- Grade level and plan selection
- Terms and conditions
- Form validation

### **💳 Payment Screen**
- Registration summary
- Payment method selection
- Bank transfer instructions
- Support contact options

---

## 🔌 **API Integration**

The mobile app connects to your existing backend at `https://www.reussirfrench.in/api` using the following endpoints:

### **Available Endpoints**
- `POST /book-demo` - Demo class booking
- `POST /register` - Student registration  
- `POST /create-subscription-intent` - Payment setup
- `POST /confirm-subscription` - Payment confirmation
- `POST /student-login` - Portal access
- `POST /create-bank-transfer-payment` - Bank transfer setup

### **API Configuration**
Update the base URL in `src/services/api.js`:
```javascript
const BASE_URL = 'https://your-domain.com/api';
```

---

## 🛠️ **Development**

### **Adding New Screens**
1. Create new screen file in `src/screens/`
2. Import and add to navigation in `App.js`
3. Update navigation types if using TypeScript

### **Styling Guidelines**
- Use the theme colors defined in `src/theme/theme.js`
- Follow consistent spacing (multiples of 8px)
- Use React Native Paper components when possible
- Test on both iOS and Android

### **API Integration**
- All API calls go through `src/services/api.js`
- Use async/await with proper error handling
- Add loading states for better UX
- Validate responses before using data

---

## 📦 **Build & Deployment**

### **Development Build**
```bash
expo build:android --type apk
expo build:ios --type simulator
```

### **Production Build**
```bash
expo build:android --type app-bundle
expo build:ios --type archive
```

### **Publishing to Stores**
1. **Google Play Store**
   - Upload the generated APK/AAB
   - Configure store listing
   - Submit for review

2. **Apple App Store**
   - Upload via Xcode or Application Loader
   - Configure App Store Connect
   - Submit for review

---

## 🔧 **Customization**

### **Branding**
- Update colors in `src/theme/theme.js`
- Replace logo and icons in `assets/`
- Modify app name in `app.json`

### **Content**
- Edit screen text and descriptions
- Update contact information
- Modify pricing and plans

### **Features**
- Add new screens for additional functionality
- Integrate new payment methods
- Add push notifications

---

## 📞 **Support & Contact**

### **For Sandy (Website Owner)**
- **Email**: sandy.frenchtutor@gmail.com
- **WhatsApp**: +91 98765 43210

### **Technical Support**
- Check the existing website backend logs
- Verify API endpoints are working
- Test mobile app in Expo Go first

### **Common Issues**
- **API Errors**: Check backend server status
- **Build Errors**: Clear node_modules and reinstall
- **Navigation Issues**: Verify all screens are imported

---

## 🎯 **Future Enhancements**

### **Phase 1** 
- [ ] Stripe card payment integration
- [ ] Push notifications for class reminders
- [ ] Offline mode for better connectivity

### **Phase 2**
- [ ] Video calling integration
- [ ] Study materials download
- [ ] Progress tracking with charts

### **Phase 3**
- [ ] Multi-language support
- [ ] Advanced scheduling system
- [ ] Parent dashboard

---

## 📜 **License**

This mobile app is created for Sandy's French Tutoring business. All rights reserved.

---

**🇫🇷 Bonne chance avec votre application mobile! (Good luck with your mobile app!)**

*Created with ❤️ for Sandy's French Tutoring Business*  
*Mobile App Version 1.0 - January 2025* 