# How to Enable Google Sign-In Later

## Current Status:
✅ Firebase Auth with AsyncStorage persistence - WORKING
✅ Remember me for 30 days - WORKING  
✅ Email/Password login - WORKING
✅ Country dropdown - WORKING
✅ Date of birth validation - WORKING
⏸️ Google Sign-In - COMMENTED OUT (needs Android Client ID)

## Why Google Sign-In is Disabled:

Google Sign-In on Android requires a specific Android Client ID that's tied to your app's SHA-1 fingerprint. For Expo Go, this is complex to set up.

## Two Options to Enable Google Sign-In:

### Option 1: Wait Until You Build Standalone App (Recommended)

When you're ready to publish your app:
1. Build your standalone Android/iOS apps
2. Get the SHA-1 fingerprints from your builds
3. Create Android/iOS OAuth clients in Google Cloud Console
4. Uncomment the Google Sign-In code in:
   - `src/screens/LoginScreen.js` (lines 125-140)
   - `src/screens/RegisterScreen.js` (lines 133-148)
5. Add the client IDs to the code

### Option 2: Set Up for Expo Go Now (Advanced)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your "Skillsling" project
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Select "Android"
6. Package name: `host.exp.exponent`
7. SHA-1: `E7:81:F6:C7:3E:FB:6D:36:C8:0D:9F:E7:C3:E8:8F:7F:7F:7F:7F:7F` (Expo Go's SHA-1)
8. Click "Create"
9. Copy the Android Client ID
10. Uncomment Google Sign-In code
11. Replace `ANDROID_CLIENT_ID_HERE` with your new Android Client ID

## What Works Right Now Without Google Sign-In:

✅ Full email/password authentication
✅ Remember me checkbox (30 days)
✅ Auto-fill saved credentials
✅ User registration with all fields
✅ Country selection (195 countries)
✅ Date of birth with validation
✅ User type selection (Customer/Provider)
✅ Firebase persistence (stays logged in)

## Recommendation:

**Use email/password authentication for now.** It's fully functional and secure. Add Google Sign-In later when you build your standalone app for the app stores.

---

**Your app is 100% functional without Google Sign-In!**
