# Twilio SMS & WhatsApp Setup Guide - Complete

## Overview

This guide will help you set up:
1. **SMS password reset** - Send verification codes via SMS
2. **WhatsApp password reset** - Send verification codes via WhatsApp
3. **Backend integration** - Connect Twilio to your app

---

## 📋 What You Need

### Costs:
- **Twilio Account:** Free trial ($15 credit)
- **SMS:** ~$0.01 per message (Kenya)
- **WhatsApp:** ~$0.005 per message
- **Phone Number:** $1-2/month (for SMS)
- **WhatsApp:** Free (uses Twilio sandbox for testing)

### Time:
- **Setup:** 30-45 minutes
- **Testing:** 10-15 minutes
- **Total:** 1 hour

---

## 🚀 PART 1: Create Twilio Account (10 minutes)

### Step 1: Sign Up

1. **Go to:** https://www.twilio.com/try-twilio
2. **Click "Sign up"**
3. **Fill in details:**
   - First name
   - Last name
   - Email
   - Password
4. **Verify your email**
5. **Verify your phone number** (they'll send you a code)

### Step 2: Get Free Trial Credits

1. **After signup, you get $15 free credit** ✅
2. **This is enough for:**
   - ~1,500 SMS messages
   - ~3,000 WhatsApp messages
3. **No credit card required for trial**

### Step 3: Get Your Credentials

1. **Go to Twilio Console:** https://console.twilio.com/
2. **You'll see your dashboard**
3. **Copy these (you'll need them):**
   - **Account SID:** (starts with AC...)
   - **Auth Token:** (click to reveal and copy)

**Save these somewhere safe!**

---

## 📱 PART 2: Setup SMS (15 minutes)

### Step 1: Get a Phone Number

1. **In Twilio Console, click "Phone Numbers"** (left menu)
2. **Click "Buy a number"**
3. **Select country:** Kenya (or your country)
4. **Check "SMS" capability**
5. **Click "Search"**
6. **Choose a number** (costs $1-2/month)
7. **Click "Buy"**

**Your Twilio phone number:** Save this! (e.g., +254712345678)

### Step 2: Configure SMS Settings

1. **Go to Phone Numbers → Manage → Active numbers**
2. **Click on your number**
3. **Scroll to "Messaging"**
4. **Configure webhook:** (we'll set this up later)
5. **Save**

### Step 3: Test SMS

1. **Go to:** https://console.twilio.com/us1/develop/sms/try-it-out/send-an-sms
2. **From:** Your Twilio number
3. **To:** Your verified phone number
4. **Message:** "Test from SkillSling"
5. **Click "Send"**
6. **Check your phone** - you should receive the SMS!

✅ **If you received the SMS, SMS is working!**

---

## 💬 PART 3: Setup WhatsApp (10 minutes)

### Step 1: Join Twilio WhatsApp Sandbox

1. **Go to:** https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. **You'll see instructions to join sandbox**
3. **On your phone, open WhatsApp**
4. **Send a message to:** +1 415 523 8886 (Twilio's WhatsApp number)
5. **Message:** `join [your-sandbox-code]` (shown on the page)
6. **You'll receive a confirmation** from Twilio

✅ **You're now connected to Twilio WhatsApp sandbox!**

### Step 2: Test WhatsApp

1. **In Twilio Console, go to:** Messaging → Try it out → Send a WhatsApp message
2. **From:** Your Twilio WhatsApp number (shown on page)
3. **To:** Your WhatsApp number (must be joined to sandbox)
4. **Message:** "Test from SkillSling"
5. **Click "Send"**
6. **Check WhatsApp** - you should receive the message!

✅ **If you received the WhatsApp message, WhatsApp is working!**

### Step 3: WhatsApp Production (Optional - For Launch)

**For testing:** Sandbox is fine (free)
**For production:** You need approved WhatsApp Business Account

**To get approved:**
1. Go to: https://console.twilio.com/us1/develop/sms/whatsapp/senders
2. Click "Request Access"
3. Fill in business details
4. Wait 1-3 days for approval
5. Costs: ~$0.005 per message

**For now, use sandbox for testing!**

---

## 🔧 PART 4: Backend Setup (Firebase Functions)

You need a backend to send SMS/WhatsApp (can't do it directly from React Native for security).

### Option A: Firebase Cloud Functions (Recommended)

**Step 1: Install Firebase CLI**

```bash
npm install -g firebase-tools
```

**Step 2: Login to Firebase**

```bash
firebase login
```

**Step 3: Initialize Functions**

```bash
cd c:\Users\ADMIN\Desktop\Skillsling
firebase init functions
```

Select:
- Use existing project: skillsling-254
- Language: JavaScript
- ESLint: Yes
- Install dependencies: Yes

**Step 4: Install Twilio in Functions**

```bash
cd functions
npm install twilio
```

**Step 5: Create Function for SMS**

Create file: `functions/index.js`

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Twilio credentials (get from Twilio Console)
const accountSid = 'YOUR_ACCOUNT_SID'; // Replace with your Account SID
const authToken = 'YOUR_AUTH_TOKEN';   // Replace with your Auth Token
const twilioPhone = 'YOUR_TWILIO_PHONE'; // Replace with your Twilio phone number

const client = twilio(accountSid, authToken);

// Send SMS verification code
exports.sendSMSVerification = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Send SMS
        await client.messages.create({
            body: `Your SkillSling verification code is: ${code}. Valid for 10 minutes.`,
            from: twilioPhone,
            to: phoneNumber
        });

        // Store code in Firestore (expires in 10 minutes)
        await admin.firestore().collection('verificationCodes').doc(phoneNumber).set({
            code: code,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000)
        });

        return { success: true, message: 'SMS sent successfully' };
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send SMS');
    }
});

// Send WhatsApp verification code
exports.sendWhatsAppVerification = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Send WhatsApp message
        await client.messages.create({
            body: `Your SkillSling verification code is: ${code}. Valid for 10 minutes.`,
            from: 'whatsapp:+14155238886', // Twilio WhatsApp sandbox number
            to: `whatsapp:${phoneNumber}`
        });

        // Store code in Firestore (expires in 10 minutes)
        await admin.firestore().collection('verificationCodes').doc(phoneNumber).set({
            code: code,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + 10 * 60 * 1000)
        });

        return { success: true, message: 'WhatsApp message sent successfully' };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send WhatsApp message');
    }
});

// Verify code
exports.verifyCode = functions.https.onCall(async (data, context) => {
    const { phoneNumber, code } = data;

    try {
        // Get stored code
        const doc = await admin.firestore().collection('verificationCodes').doc(phoneNumber).get();

        if (!doc.exists) {
            throw new functions.https.HttpsError('not-found', 'No verification code found');
        }

        const storedData = doc.data();

        // Check if expired
        if (storedData.expiresAt.toMillis() < Date.now()) {
            await doc.ref.delete();
            throw new functions.https.HttpsError('deadline-exceeded', 'Verification code expired');
        }

        // Check if code matches
        if (storedData.code !== code) {
            throw new functions.https.HttpsError('invalid-argument', 'Invalid verification code');
        }

        // Delete used code
        await doc.ref.delete();

        return { success: true, message: 'Code verified successfully' };
    } catch (error) {
        console.error('Error verifying code:', error);
        throw error;
    }
});
```

**Step 6: Deploy Functions**

```bash
firebase deploy --only functions
```

Wait 2-5 minutes for deployment.

---

## 📱 PART 5: Update Your App (React Native)

### Step 1: Install Firebase Functions SDK

```bash
npm install firebase
```

### Step 2: Update ForgotPasswordScreen

Update `src/screens/ForgotPasswordScreen.js`:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

// Add at top with other imports
const functions = getFunctions();

// Update handlePhoneReset function
const handlePhoneReset = async () => {
    if (!phone) {
        Alert.alert('Error', 'Please enter your phone number');
        return;
    }

    if (!validatePhone(phone)) {
        Alert.alert('Error', 'Please enter a valid phone number (e.g., +254712345678)');
        return;
    }

    setLoading(true);

    try {
        // Find user by phone number
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('phone', '==', phone));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            Alert.alert('Error', 'No account found with this phone number');
            setLoading(false);
            return;
        }

        // Get user email
        const userData = querySnapshot.docs[0].data();
        setUserEmail(userData.email);

        // Choose SMS or WhatsApp based on resetMethod
        const functionName = resetMethod === 'phone' 
            ? 'sendSMSVerification' 
            : 'sendWhatsAppVerification';

        // Call Firebase Function
        const sendVerification = httpsCallable(functions, functionName);
        const result = await sendVerification({ phoneNumber: phone });

        if (result.data.success) {
            Alert.alert(
                'Success',
                `Verification code sent to your ${resetMethod === 'phone' ? 'phone' : 'WhatsApp'}!`,
                [{ text: 'OK' }]
            );
            setCodeSent(true);
        }

        setLoading(false);
    } catch (error) {
        console.log('Phone reset error:', error);
        Alert.alert('Error', error.message || 'Failed to send verification code');
        setLoading(false);
    }
};

// Update handleVerifyCodeAndReset function
const handleVerifyCodeAndReset = async () => {
    if (!verificationCode) {
        Alert.alert('Error', 'Please enter the verification code');
        return;
    }

    if (!newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please enter and confirm your new password');
        return;
    }

    if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
    }

    if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
    }

    setLoading(true);

    try {
        // Verify code with Firebase Function
        const verifyCode = httpsCallable(functions, 'verifyCode');
        const result = await verifyCode({ 
            phoneNumber: phone, 
            code: verificationCode 
        });

        if (result.data.success) {
            // Code is valid, now update password
            // Note: You'll need to implement password update via Firebase Admin SDK
            // For now, show success message
            Alert.alert(
                'Success',
                'Code verified! Please contact support to complete password reset.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }

        setLoading(false);
    } catch (error) {
        console.log('Verification error:', error);
        Alert.alert('Error', error.message || 'Invalid or expired code');
        setLoading(false);
    }
};
```

---

## 🧪 PART 6: Testing

### Test SMS:

1. **Open your app**
2. **Go to Login → Forgot Password**
3. **Select "Phone" method**
4. **Enter your phone number:** +254712345678
5. **Tap "Send Code"**
6. **Check your phone** - you should receive SMS with 6-digit code
7. **Enter the code in app**
8. **Enter new password**
9. **Tap "Reset Password"**

### Test WhatsApp:

1. **Make sure you joined Twilio sandbox** (see Part 3)
2. **Open your app**
3. **Go to Login → Forgot Password**
4. **Select "WhatsApp" method**
5. **Enter your WhatsApp number:** +254712345678
6. **Tap "Send Code"**
7. **Check WhatsApp** - you should receive message with 6-digit code
8. **Enter the code in app**
9. **Enter new password**
10. **Tap "Reset Password"**

---

## 💰 Costs Breakdown

### Free Trial:
- **$15 credit** (enough for testing)
- **~1,500 SMS messages**
- **~3,000 WhatsApp messages**

### After Trial:
- **SMS:** $0.01 per message (Kenya)
- **WhatsApp:** $0.005 per message
- **Phone number:** $1-2/month
- **No monthly fees** (pay as you go)

### Example Monthly Cost (1000 users):
- **100 SMS resets:** $1
- **100 WhatsApp resets:** $0.50
- **Phone number:** $1.50
- **Total:** ~$3/month

---

## 🔒 Security Best Practices

### 1. Secure Your Credentials

**Never put Twilio credentials in your React Native app!**

✅ **Correct:** Store in Firebase Functions (backend)
❌ **Wrong:** Store in React Native code (anyone can see)

### 2. Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// In Firebase Functions
const rateLimit = {};

exports.sendSMSVerification = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;

    // Check rate limit (max 3 per hour)
    const now = Date.now();
    if (rateLimit[phoneNumber]) {
        const attempts = rateLimit[phoneNumber].filter(time => now - time < 3600000);
        if (attempts.length >= 3) {
            throw new functions.https.HttpsError(
                'resource-exhausted', 
                'Too many attempts. Please try again in 1 hour.'
            );
        }
        rateLimit[phoneNumber] = [...attempts, now];
    } else {
        rateLimit[phoneNumber] = [now];
    }

    // Rest of the code...
});
```

### 3. Code Expiry

Codes expire after 10 minutes (already implemented above).

### 4. One-Time Use

Codes are deleted after use (already implemented above).

---

## 📊 Comparison: Email vs SMS vs WhatsApp

| Feature | Email | SMS | WhatsApp |
|---------|-------|-----|----------|
| **Cost** | Free | $0.01/msg | $0.005/msg |
| **Speed** | 2-10 mins | Instant | Instant |
| **Reliability** | 70% | 95% | 98% |
| **Spam Issues** | High | Low | Very Low |
| **User Preference** | Medium | High | Very High |
| **Setup Complexity** | Easy | Medium | Medium |

**Recommendation:** Offer all three options!

---

## 🚀 Quick Start Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Functions
firebase init functions

# Install Twilio
cd functions
npm install twilio

# Deploy Functions
firebase deploy --only functions

# Install in React Native
npm install firebase
```

---

## ✅ Checklist

### Twilio Setup:
- [ ] Created Twilio account
- [ ] Got $15 free credit
- [ ] Copied Account SID and Auth Token
- [ ] Bought phone number for SMS
- [ ] Joined WhatsApp sandbox
- [ ] Tested SMS (received test message)
- [ ] Tested WhatsApp (received test message)

### Backend Setup:
- [ ] Installed Firebase CLI
- [ ] Initialized Firebase Functions
- [ ] Installed Twilio in functions
- [ ] Created sendSMSVerification function
- [ ] Created sendWhatsAppVerification function
- [ ] Created verifyCode function
- [ ] Deployed functions to Firebase

### App Setup:
- [ ] Installed Firebase Functions SDK
- [ ] Updated ForgotPasswordScreen
- [ ] Tested SMS reset flow
- [ ] Tested WhatsApp reset flow

---

## 🎯 Next Steps

1. **Complete the setup** (follow steps above)
2. **Test thoroughly** with real phone numbers
3. **Add rate limiting** (prevent abuse)
4. **Monitor costs** in Twilio Console
5. **Apply for WhatsApp Business** (for production)
6. **Add SMS to registration** (optional - verify phone on signup)

---

## 📞 Support

### Twilio Support:
- **Docs:** https://www.twilio.com/docs
- **Support:** https://support.twilio.com/
- **Community:** https://www.twilio.com/community

### Firebase Support:
- **Docs:** https://firebase.google.com/docs/functions
- **Support:** https://firebase.google.com/support

---

**Ready to set up SMS and WhatsApp? Start with Part 1!** 🚀
