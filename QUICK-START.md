# Quick Start Guide - Get Running in 15 Minutes

## What You Need
- Computer (Windows/Mac/Linux)
- Smartphone (iPhone or Android)
- Internet connection

## Step-by-Step

### 1. Install Node.js (5 minutes)
- Go to https://nodejs.org
- Download and install the LTS version
- Restart your computer

### 2. Install Expo Go on Your Phone (2 minutes)
- iPhone: App Store → Search "Expo Go" → Install
- Android: Play Store → Search "Expo Go" → Install

### 3. Setup Firebase (5 minutes)
- Go to https://console.firebase.google.com
- Click "Add Project" → Name it "SkillSling"
- Enable Authentication (Email/Password)
- Create Firestore Database (test mode)
- Enable Storage
- Get your config keys (see DEPLOYMENT-GUIDE.md)
- Paste them in `App.js`

### 4. Run the App (3 minutes)
Open terminal/command prompt in project folder:

```bash
npm start
```

Wait for QR code to appear, then:
- **iPhone**: Open Camera app → Point at QR code → Tap notification
- **Android**: Open Expo Go app → Tap "Scan QR Code"

That's it! The app should load on your phone.

## Test It Out

1. Click "Get Started"
2. Register as a service provider
3. Add a service with photos
4. Switch to customer mode
5. Browse services

## Common Issues

**"npm not found"**
- Install Node.js and restart terminal

**"Expo Go won't connect"**
- Make sure phone and computer are on same WiFi

**"Firebase error"**
- Check you pasted the config correctly in App.js

**"Can't scan QR code"**
- Press 'a' for Android emulator or 'i' for iOS simulator

## Next Steps

Once it works:
1. Customize colors in styles
2. Add your logo
3. Test all features
4. Follow DEPLOYMENT-GUIDE.md to publish

Need help? Check the docs or ask!
