# ⚡ DO THIS NOW - 30 Minute Setup

## Your Mission: See Your App Running in 30 Minutes

### Step 1: Setup Firebase (15 minutes)

1. **Open browser** → Go to https://console.firebase.google.com

2. **Create project:**
   - Click "Add Project"
   - Name: "SkillSling"
   - Disable Google Analytics
   - Click "Create Project"

3. **Enable Authentication:**
   - Left menu → "Authentication"
   - Click "Get Started"
   - Click "Email/Password"
   - Toggle ON
   - Click "Save"

4. **Create Database:**
   - Left menu → "Firestore Database"
   - Click "Create Database"
   - Select "Start in test mode"
   - Choose your region
   - Click "Enable"

5. **Enable Storage:**
   - Left menu → "Storage"
   - Click "Get Started"
   - Click "Next" → "Done"

6. **Get Your Keys:**
   - Click ⚙️ (gear icon) → "Project Settings"
   - Scroll down to "Your apps"
   - Click web icon `</>`
   - Register app: "SkillSling"
   - **COPY the firebaseConfig object**

7. **Add Keys to App:**
   - Open `App.js` in your project
   - Find lines 22-28 (the firebaseConfig section)
   - Replace with YOUR keys from Firebase
   - Save the file

### Step 2: Run the App (5 minutes)

1. **Open terminal** in your project folder

2. **Start the app:**
   ```bash
   npm start
   ```

3. **Wait for QR code** to appear (30 seconds)

4. **On your phone:**
   - iPhone: Open Camera → Point at QR code → Tap notification
   - Android: Open Expo Go app → Tap "Scan QR Code"

5. **App should load!** (takes 30-60 seconds first time)

### Step 3: Test It (10 minutes)

1. **Register:**
   - Tap "Get Started"
   - Choose "Offer Services"
   - Fill in details
   - Create account

2. **Browse:**
   - See the home screen
   - Tap categories
   - Check search

3. **Switch modes:**
   - Go to Profile tab
   - Tap "Switch to Customer Mode"
   - See the difference

4. **Success!** Your app is working! 🎉

---

## What If Something Goes Wrong?

### "npm not found"
→ Install Node.js from https://nodejs.org
→ Restart terminal

### "Firebase error"
→ Check you copied ALL the config keys
→ Make sure you replaced the placeholder text

### "Can't scan QR code"
→ Press 'a' in terminal for Android emulator
→ Press 'i' for iOS simulator (Mac only)

### "Expo Go won't connect"
→ Make sure phone and computer on same WiFi
→ Try pressing 'r' to reload

### "Module not found"
→ Run `npm install` again
→ Restart with `npm start`

---

## After It Works

### Immediate (Today):
- [ ] Change app colors (edit styles in screens)
- [ ] Add your logo (replace assets/logo.png)
- [ ] Test all features

### This Week:
- [ ] Setup Stripe (see MONETIZATION-SETUP.md)
- [ ] Add real service data
- [ ] Test payments

### Next Week:
- [ ] Create app store screenshots
- [ ] Write app description
- [ ] Submit to Google Play & App Store

---

## Quick Reference

**Start app:**
```bash
npm start
```

**Stop app:**
Press `Ctrl + C` in terminal

**Reload app:**
Press `r` in terminal or shake phone

**Clear cache:**
```bash
npm start --clear
```

---

## Firebase Config Example

Your `App.js` should look like this (with YOUR keys):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "skillsling-12345.firebaseapp.com",
  projectId: "skillsling-12345",
  storageBucket: "skillsling-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

**Don't use the example above - use YOUR keys from Firebase!**

---

## Success Checklist

After 30 minutes, you should have:
- [x] Firebase project created
- [x] Config keys added to App.js
- [x] App running on your phone
- [x] Registered a test account
- [x] Browsed services
- [x] Switched between modes

**If you have all these ✓ - YOU'RE DONE!**

---

## What's Next?

Read these in order:
1. `PROJECT-SUMMARY.md` - Understand what you have
2. `MONETIZATION-SETUP.md` - Learn how to make money
3. `DEPLOYMENT-GUIDE.md` - When ready to launch

---

## Need Help?

Common questions answered in:
- `QUICK-START.md` - Fast setup
- `firebase-setup.md` - Detailed Firebase guide
- `README.md` - General overview

---

**Ready? Open Firebase console and let's go! 🚀**

Timer starts now: 30 minutes to see your app running!
