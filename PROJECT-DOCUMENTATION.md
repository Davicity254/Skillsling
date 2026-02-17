# Skillsling - Complete Project Documentation

**Service Marketplace Mobile App | React Native + Expo + Firebase**

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Features Implemented](#features-implemented)
4. [Technical Stack](#technical-stack)
5. [Setup Guide](#setup-guide)
6. [Common Issues & Solutions](#common-issues--solutions)
7. [Project Status](#project-status)

---

## Project Overview

**Skillsling** is a two-sided marketplace mobile app connecting service providers with customers.

**Core Concept:**
- Service providers (salons, barbers, repair shops, etc.) create profiles and list services
- Customers browse, filter by location, and book services
- Real-time chat, reviews, and ratings system
- Works globally with 192 countries supported

**Target Users:**
- Service Providers: 18+ years old
- Customers: 13+ years old

**Repository:** https://github.com/Davicity254/Skillsling

---

## Quick Start

### Prerequisites
- Node.js 18+
- Phone with Expo Go app installed
- Firebase account

### Run the App
```bash
# Clone and install
git clone https://github.com/Davicity254/Skillsling.git
cd Skillsling
npm install

# Start development server
npx expo start

# Scan QR code with Expo Go app on your phone
```

### First Time Setup
1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore Database (test mode)
4. Enable Storage (test mode)
5. Copy config to `src/config/firebase.js`

---

## Features Implemented

### ✅ Core Features (100% Complete)

**Authentication & User Management**
- Email/password registration and login
- Google Sign-In ready (requires client ID setup)
- Password reset via email
- Change password in Settings (no email needed)
- User roles: Customer or Service Provider (can switch)
- Age verification (18+ for providers, 13+ for customers)

**Service Listings**
- Create/edit/delete services
- Upload photos and videos (up to 5 each)
- Set pricing and descriptions
- Category selection (20+ categories)
- Service visibility toggle

**Search & Discovery**
- Browse all services
- Filter by category
- Filter by location (Country, State/County)
- GPS-based location detection
- Search by service name

**Booking System**
- Request bookings with date/time
- Provider accepts/rejects bookings
- Booking status tracking
- Booking history

**Chat System**
- Real-time messaging
- Unread message badges
- Chat list with last message preview
- Instagram-style features:
  - Tap header to view profile
  - Keyboard moves input above (no covering)
- Messages marked as read automatically

**Reviews & Ratings**
- 5-star rating system
- Written reviews
- Average rating display
- Review history

**Profile Management**
- Edit profile information
- Upload profile photo
- Add bio and Instagram handle
- Set location (Country, State, Street, Zip)
- Phone number with country code prefix
- Date of birth (DD/MM/YYYY format)

**Theme System**
- 6 themes available:
  1. Orange Sunset (default)
  2. Ocean Blue
  3. Forest Green
  4. Royal Purple
  5. Crimson Red
  6. Midnight Dark
- Applies to all screens
- Persists across sessions

**Legal & Compliance**
- Privacy Policy screen
- Terms of Service screen
- Age verification on signup
- Prohibited services filtering

---

## Technical Stack

### Frontend
- **React Native** - Mobile framework
- **Expo SDK 54** - Development platform
- **React Navigation** - Screen navigation
- **Expo Image Picker** - Photo/video selection
- **Expo Location** - GPS coordinates
- **Expo Video** - Video playback

### Backend
- **Firebase Authentication** - User management
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Hosting** - (Optional for web version)

### Key Libraries
```json
{
  "expo": "~54.0.0",
  "react-native": "0.76.5",
  "firebase": "^11.1.0",
  "@react-navigation/native": "^7.0.13",
  "@react-native-picker/picker": "2.11.4",
  "expo-image-picker": "~16.0.5",
  "expo-location": "~18.0.4",
  "expo-video": "~2.1.2"
}
```

---

## Setup Guide

### 1. Firebase Configuration

**Create Project:**
1. Go to https://console.firebase.google.com
2. Click "Add project" → Name it (e.g., `skillsling-prod`)
3. Disable Google Analytics → Create

**Enable Services:**

**Authentication:**
- Click Authentication → Get started
- Enable Email/Password → Save
- (Optional) Enable Google Sign-In

**Firestore Database:**
- Click Firestore Database → Create database
- Start in test mode (for development)
- Choose region closest to your users

**Storage:**
- Click Storage → Get started
- Start in test mode

**Get Config Keys:**
- Project Settings → Your apps → Web app
- Copy the `firebaseConfig` object
- Paste into `src/config/firebase.js`

**Security Rules (Important!):**

Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth.uid == resource.data.userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Google Sign-In Setup (Optional)

1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Get Android and iOS client IDs
4. Add to Firebase Authentication
5. Update `app.json` with client IDs

See: https://docs.expo.dev/guides/google-authentication/

### 3. Environment Setup

**Install Dependencies:**
```bash
npm install
```

**Update Expo SDK (if needed):**
```bash
npx expo upgrade
```

**Clear Cache (if issues):**
```bash
npx expo start --clear
```

---

## Common Issues & Solutions

### Firebase Errors

**Error: auth/invalid-api-key**
- **Cause:** Wrong Firebase config
- **Fix:** Copy exact values from Firebase Console to `src/config/firebase.js`

**Error: Missing or insufficient permissions**
- **Cause:** Firestore security rules blocking access
- **Fix:** Update rules in Firebase Console → Firestore → Rules tab

**Error: Firebase app already initialized**
- **Cause:** `initializeApp()` called multiple times
- **Fix:** Already handled in `src/config/firebase.js` with conditional check

### Expo Errors

**Error: Unable to resolve module**
- **Cause:** Failed npm install or corrupted node_modules
- **Fix:** 
```bash
rm -rf node_modules
npm install
```

**Error: QR code won't scan**
- **Cause:** Phone and laptop on different networks
- **Fix:** Connect both to same Wi-Fi, or use tunnel mode:
```bash
npx expo start --tunnel
```

**Error: Expo SDK version mismatch**
- **Cause:** Expo Go app version doesn't match project
- **Fix:** Update Expo Go app on phone, or run:
```bash
npx expo upgrade
```

### App-Specific Issues

**Location not working**
- **Fix:** Grant location permissions in device settings

**Camera/Photos not working**
- **Fix:** Grant camera and storage permissions

**Password reset emails going to spam**
- **Cause:** Firebase default email template triggers spam filters
- **Fix:** 
  1. Use "Change Password" feature in Settings (no email needed)
  2. Update email template in Firebase Console → Authentication → Templates
  3. (Production) Use custom email domain

**Unread badges not updating**
- **Status:** Fixed in latest version
- **How:** Chat document's `unreadCount` resets when opening chat

**Keyboard covering input in chat**
- **Status:** Fixed in latest version
- **How:** KeyboardAvoidingView with proper configuration + app.json settings

---

## Project Status

### Completion: 98%

**✅ Completed Features:**
- User authentication (email/password)
- Service CRUD operations
- Photo/video uploads
- Search and filtering
- Location system (192 countries)
- Booking system
- Real-time chat with unread badges
- Reviews and ratings
- Theme switching (6 themes)
- Profile management
- Legal documents (Privacy, Terms)
- Age verification
- Password reset (email + in-app)
- Instagram-style chat features

**⚠️ Optional Enhancements:**
- Google Sign-In (requires OAuth setup)
- SMS/WhatsApp password reset (requires Twilio)
- Custom email domain (reduces spam, costs $10-15/year)
- Push notifications (requires EAS Build)
- Payment integration (Stripe/PayPal)

**🚀 Ready For:**
- Development testing
- User acceptance testing
- Beta release
- App Store submission (requires EAS Build)

### Known Limitations

**Expo Go Restrictions:**
- Some native modules require development build
- Push notifications need EAS Build
- In-app purchases need development build

**Firebase Free Tier Limits:**
- 50K reads/day
- 20K writes/day
- 1GB storage
- 10GB bandwidth/month

**Upgrade to Blaze (pay-as-you-go) when:**
- Exceeding free tier limits
- Need custom email domain
- Require advanced features

---

## File Structure

```
Skillsling/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── config/
│   │   ├── firebase.js            # Firebase initialization
│   │   ├── ThemeContext.js        # Theme provider
│   │   ├── countries.js           # Country list (192)
│   │   ├── allCountryStates.js    # States/counties by country
│   │   ├── services.js            # Service categories
│   │   ├── prohibitedServices.js  # Blocked services
│   │   └── permissions.js         # Permission handlers
│   ├── screens/
│   │   ├── WelcomeScreen.js       # Landing page
│   │   ├── LoginScreen.js         # Login
│   │   ├── RegisterScreen.js      # Signup
│   │   ├── ForgotPasswordScreen.js # Password reset
│   │   ├── HomeScreen.js          # Service listings
│   │   ├── SearchScreen.js        # Search & filters
│   │   ├── ServiceDetailScreen.js # Service details
│   │   ├── BookingScreen.js       # Booking form
│   │   ├── ChatListScreen.js      # Chat list
│   │   ├── ChatScreen.js          # Chat messages
│   │   ├── ProfileScreen.js       # User profile
│   │   ├── PublicProfileScreen.js # Other user's profile
│   │   ├── ReviewScreen.js        # Reviews
│   │   ├── SettingsScreen.js      # App settings
│   │   ├── PrivacyPolicyScreen.js # Privacy policy
│   │   └── TermsOfServiceScreen.js # Terms of service
│   └── utils/
│       └── logoutAllUsers.js      # Admin utility
└── assets/
    ├── icon.png                    # App icon
    ├── splash.png                  # Splash screen
    └── adaptive-icon.png           # Android adaptive icon
```

---

## Development Commands

```bash
# Start development server
npx expo start

# Start with cache cleared
npx expo start --clear

# Start with tunnel (for network issues)
npx expo start --tunnel

# Install dependencies
npm install

# Update Expo SDK
npx expo upgrade

# Check for issues
npx expo doctor

# Build for production (requires EAS)
eas build --platform android
eas build --platform ios
```

---

## Testing Checklist

**Authentication:**
- [ ] Register new user (customer)
- [ ] Register new user (provider)
- [ ] Login with email/password
- [ ] Forgot password (check spam folder)
- [ ] Change password in Settings
- [ ] Logout

**Service Management:**
- [ ] Create service with photos
- [ ] Create service with videos
- [ ] Edit service
- [ ] Delete service
- [ ] Toggle service visibility

**Search & Browse:**
- [ ] Browse all services
- [ ] Filter by category
- [ ] Filter by location
- [ ] Search by name

**Booking:**
- [ ] Request booking
- [ ] Provider accepts booking
- [ ] Provider rejects booking
- [ ] View booking history

**Chat:**
- [ ] Send message
- [ ] Receive message
- [ ] Unread badge appears
- [ ] Badge disappears after reading
- [ ] Tap header to view profile
- [ ] Keyboard doesn't cover input

**Profile:**
- [ ] Edit profile info
- [ ] Upload profile photo
- [ ] Change location
- [ ] Add Instagram handle
- [ ] Switch role (customer ↔ provider)

**Reviews:**
- [ ] Leave review
- [ ] View reviews
- [ ] See average rating

**Theme:**
- [ ] Switch theme
- [ ] Theme persists after restart
- [ ] All screens use theme colors

---

## Deployment Guide

### Expo Go (Development)
Already working - just scan QR code

### Standalone App (Production)

**Prerequisites:**
1. Expo account (free)
2. Apple Developer account ($99/year for iOS)
3. Google Play Developer account ($25 one-time for Android)

**Steps:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

**See:** https://docs.expo.dev/build/setup/

---

## Support & Resources

**Official Documentation:**
- React Native: https://reactnative.dev
- Expo: https://docs.expo.dev
- Firebase: https://firebase.google.com/docs

**Community:**
- Expo Forums: https://forums.expo.dev
- React Native Discord: https://reactnative.dev/community/overview
- Stack Overflow: [react-native] [expo] tags

**Project Repository:**
- GitHub: https://github.com/Davicity254/Skillsling
- Issues: https://github.com/Davicity254/Skillsling/issues

---

## License

This project is for educational purposes.

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready (98% complete)
