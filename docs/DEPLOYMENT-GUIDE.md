# Complete Deployment Guide

## Step 1: Setup Firebase (YOU MUST DO THIS FIRST)

### A. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Name: "SkillSling"
4. Disable Google Analytics (optional)
5. Click "Create Project"

### B. Enable Authentication
1. In left menu, click "Authentication"
2. Click "Get Started"
3. Click "Email/Password" tab
4. Toggle "Enable" and Save

### C. Create Firestore Database
1. Click "Firestore Database" in left menu
2. Click "Create Database"
3. Choose "Start in test mode"
4. Select your nearest region
5. Click "Enable"

### D. Enable Storage
1. Click "Storage" in left menu
2. Click "Get Started"
3. Click "Next" (default rules)
4. Select same region as Firestore
5. Click "Done"

### E. Get Your Config Keys
1. Click gear icon ⚙️ next to "Project Overview"
2. Click "Project Settings"
3. Scroll to "Your apps" section
4. Click web icon (</>)
5. Register app: "SkillSling"
6. Copy the firebaseConfig object
7. Open `App.js` in your project
8. Replace the firebaseConfig section with your keys

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "skillsling-xxxxx.firebaseapp.com",
  projectId: "skillsling-xxxxx",
  storageBucket: "skillsling-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxx"
};
```

---

## Step 2: Test the App Locally ✅ (DONE)

Dependencies are installed! Now run:

```bash
npm start
```

Then:
- Press 'a' for Android emulator
- Press 'i' for iOS simulator
- Scan QR code with Expo Go app on your phone

---

## Step 3: Setup Stripe Payment

### A. Create Stripe Account
1. Go to https://stripe.com
2. Sign up for free account
3. Complete verification

### B. Get API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy "Publishable key" and "Secret key"
3. Save them securely

### C. Create Backend for Payments
You need a simple server to create payment intents. Two options:

**Option 1: Firebase Cloud Functions (Recommended)**
```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

Create `functions/index.js`:
```javascript
const functions = require('firebase-functions');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');

exports.createPaymentIntent = functions.https.onCall(async (data) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: 'usd',
  });
  return { clientSecret: paymentIntent.client_secret };
});
```

Deploy:
```bash
firebase deploy --only functions
```

**Option 2: Use Vercel/Netlify**
Create a simple serverless function (easier for beginners)

### D. Update App.js
Add Stripe provider:
```javascript
import { StripeProvider } from '@stripe/stripe-react-native';

// Wrap your app
<StripeProvider publishableKey="YOUR_PUBLISHABLE_KEY">
  {/* Your app */}
</StripeProvider>
```

---

## Step 4: Launch on App Stores

### A. Build the App

**For Android (Google Play):**
```bash
expo build:android
```
or
```bash
eas build --platform android
```

**For iOS (App Store):**
```bash
expo build:ios
```
or
```bash
eas build --platform ios
```

### B. Google Play Store

1. **Create Developer Account**
   - Go to https://play.google.com/console
   - Pay $25 one-time fee
   - Complete registration

2. **Create App**
   - Click "Create App"
   - Fill in app details
   - Upload screenshots (use your phone)
   - Upload APK/AAB file from build

3. **Set Pricing**
   - Free to download
   - In-app purchases (for subscriptions)

4. **Submit for Review**
   - Takes 1-7 days

### C. Apple App Store

1. **Join Apple Developer Program**
   - Go to https://developer.apple.com
   - Pay $99/year
   - Complete enrollment

2. **Create App in App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Click "My Apps" → "+"
   - Fill in app information
   - Upload screenshots (iPhone required)

3. **Upload Build**
   - Use Transporter app or Xcode
   - Upload .ipa file from build

4. **Submit for Review**
   - Takes 1-3 days
   - Apple is stricter than Google

### D. Required Assets

**Screenshots:**
- Android: 1080x1920px (at least 2)
- iOS: Various sizes for different devices

**App Icon:**
- 1024x1024px PNG
- No transparency
- No rounded corners (system adds them)

**Description:**
```
SkillSling - Find Local Services

Connect with skilled professionals in your area. From barbers to plumbers, find trusted service providers with verified reviews and transparent pricing.

Features:
• Browse services by category
• View provider portfolios
• Book appointments instantly
• Secure payments
• Real-time chat
• Location-based search
```

---

## Step 5: Post-Launch

### Marketing:
1. Social media (Instagram, Facebook, TikTok)
2. Local business partnerships
3. Referral program ($5 credit for invites)
4. Google/Facebook ads

### Monetization Activation:
1. Enable in-app purchases in stores
2. Set up Stripe subscriptions
3. Add commission tracking
4. Create admin dashboard

---

## Costs Summary

| Item | Cost |
|------|------|
| Firebase | Free (up to 50k reads/day) |
| Stripe | 2.9% + $0.30 per transaction |
| Google Play | $25 one-time |
| Apple Developer | $99/year |
| **Total to Start** | **$124** |

---

## Timeline

- Firebase Setup: 30 minutes
- Testing: 1-2 days
- Payment Integration: 2-3 hours
- App Store Submission: 1 day
- Review Process: 3-7 days
- **Total: ~2 weeks to launch**

---

## Need Help?

- Firebase: https://firebase.google.com/docs
- Stripe: https://stripe.com/docs
- Expo: https://docs.expo.dev
- React Native: https://reactnative.dev

Good luck! 🚀
