# Google Sign-In Setup Guide

## ✅ Features Added:

### Login Screen:
- ✅ Remember me for 30 days checkbox
- ✅ Google Sign-In button
- ✅ Link to registration

### Register Screen:
- ✅ Google Sign-Up button
- ✅ Country dropdown (all 195 countries)
- ✅ Date of birth field (DD/MM/YYYY format)
- ✅ Age validation (must be 13+)
- ✅ Link to login

## 🔧 To Enable Google Sign-In:

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"

### Step 2: Create OAuth Client IDs

You need 3 client IDs:

**For Android:**
- Application type: Android
- Package name: `com.skillsling.app` (from app.json)
- SHA-1: Get from running `expo credentials:manager`

**For iOS:**
- Application type: iOS
- Bundle ID: `com.skillsling.app` (from app.json)

**For Web:**
- Application type: Web application
- Authorized redirect URIs: Add your Expo redirect URI

### Step 3: Update Firebase

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Google" provider
3. Add your Web client ID from Google Cloud Console

### Step 4: Update Your Code

Replace the placeholder client IDs in both screens:

**In `src/screens/LoginScreen.js` (line 15-19):**
```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

**In `src/screens/RegisterScreen.js` (line 18-22):**
```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
    webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

## 📱 Features Working Now (Without Google Setup):

### Login Screen:
- ✅ Email/password login
- ✅ Remember me checkbox (saves credentials for 30 days)
- ✅ Auto-fill saved credentials on next login
- ⏸️ Google Sign-In (needs OAuth setup)

### Register Screen:
- ✅ Email/password registration
- ✅ User type selection (Customer/Provider)
- ✅ Full name, email, phone
- ✅ Date of birth with auto-formatting (DD/MM/YYYY)
- ✅ Age validation (must be 13+)
- ✅ Country dropdown with all 195 countries
- ✅ Default country: Kenya
- ⏸️ Google Sign-Up (needs OAuth setup)

## 🎯 What Works Right Now:

You can test the app immediately with:
1. Email/password registration
2. Email/password login
3. Remember me feature
4. Country selection
5. Date of birth validation

Google Sign-In will show the button but won't work until you add the OAuth credentials.

## 🔐 Remember Me Feature:

- Saves email and password securely in AsyncStorage
- Auto-fills credentials on next login
- Expires after 30 days
- Can be toggled on/off
- Clears saved data when unchecked

## 🌍 Countries:

All 195 countries are available in the dropdown, including:
- Kenya (default)
- United States
- United Kingdom
- Canada
- Australia
- And 190 more...

## 📅 Date of Birth:

- Format: DD/MM/YYYY
- Auto-formats as you type
- Validates age (must be 13+)
- Validates date format
- Required field

## 🚀 Test It Now:

1. Scan the QR code with Expo Go
2. Try registering with email/password
3. Test the country dropdown
4. Enter a date of birth
5. Login and test "Remember me"

---

**Note:** Google Sign-In requires additional setup but all other features work immediately!
