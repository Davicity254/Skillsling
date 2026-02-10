# WhatsApp/SMS Password Reset - Implementation Guide

**Status:** Future Enhancement (Post-Launch)
**Priority:** Medium
**Estimated Time:** 4-6 hours
**Cost:** ~$0.005 per message

---

## 📋 Overview

This guide explains how to add WhatsApp and SMS password reset functionality to SkillSling. Currently, the app supports email-based password reset. This enhancement will allow users to receive reset codes via:
- SMS (text message)
- WhatsApp

---

## 🎯 Why Add This Feature?

### Benefits:
- ✅ **Better accessibility** - Not everyone checks email regularly
- ✅ **Faster delivery** - SMS/WhatsApp is instant
- ✅ **Higher engagement** - People check phones more than email
- ✅ **Global reach** - WhatsApp is popular worldwide
- ✅ **User preference** - Give users options

### Use Cases:
- User doesn't have email access
- User prefers WhatsApp communication
- Faster password recovery
- Better user experience in developing markets

---

## 🛠️ Technical Requirements

### 1. Twilio Account
**What:** SMS and WhatsApp messaging service
**Cost:** 
- Account: Free to create
- SMS: ~$0.0075 per message
- WhatsApp: ~$0.005 per message
- Monthly minimum: ~$20 (recommended)

**Sign Up:**
1. Go to https://www.twilio.com
2. Create free account
3. Verify your phone number
4. Get $15 free trial credit

### 2. Firebase Cloud Functions
**What:** Backend serverless functions
**Cost:**
- Free tier: 2M invocations/month
- Paid: $0.40 per million invocations

**Setup:**
1. Upgrade Firebase to Blaze plan (pay-as-you-go)
2. Enable Cloud Functions
3. Install Firebase CLI

### 3. Additional Dependencies
```bash
npm install twilio
npm install firebase-functions
npm install firebase-admin
```

---

## 📱 Implementation Steps

### Phase 1: Twilio Setup (30 minutes)

#### Step 1: Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up with email
3. Verify your phone number
4. Complete account setup

#### Step 2: Get Credentials
1. Go to Twilio Console
2. Find your **Account SID**
3. Find your **Auth Token**
4. Save these securely

#### Step 3: Get Phone Number (SMS)
1. In Twilio Console, go to Phone Numbers
2. Click "Buy a Number"
3. Select country (Kenya: +254)
4. Choose a number (~$1/month)
5. Purchase the number

#### Step 4: Setup WhatsApp (Optional)
1. Go to Messaging → Try WhatsApp
2. Follow WhatsApp Business API setup
3. Get WhatsApp-enabled number
4. Complete verification

**Note:** WhatsApp Business API requires business verification and may take 1-2 weeks for approval.

---

### Phase 2: Firebase Cloud Functions (2 hours)

#### Step 1: Initialize Firebase Functions
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions in your project
cd SkillSling
firebase init functions

# Select JavaScript
# Install dependencies: Yes
```

#### Step 2: Create Password Reset Function

Create `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');

admin.initializeApp();

// Twilio credentials (store in Firebase config)
const accountSid = functions.config().twilio.sid;
const authToken = functions.config().twilio.token;
const twilioPhone = functions.config().twilio.phone;
const client = twilio(accountSid, authToken);

// Generate 6-digit code
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send SMS reset code
exports.sendSMSResetCode = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;
    
    try {
        // Generate code
        const code = generateCode();
        const expiresAt = Date.now() + 600000; // 10 minutes
        
        // Store code in Firestore
        await admin.firestore().collection('resetCodes').doc(phoneNumber).set({
            code: code,
            expiresAt: expiresAt,
            attempts: 0,
            createdAt: Date.now()
        });
        
        // Send SMS
        await client.messages.create({
            body: `Your SkillSling password reset code is: ${code}. Valid for 10 minutes.`,
            from: twilioPhone,
            to: phoneNumber
        });
        
        return { success: true, message: 'Code sent successfully' };
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send SMS');
    }
});

// Send WhatsApp reset code
exports.sendWhatsAppResetCode = functions.https.onCall(async (data, context) => {
    const { phoneNumber } = data;
    
    try {
        // Generate code
        const code = generateCode();
        const expiresAt = Date.now() + 600000; // 10 minutes
        
        // Store code in Firestore
        await admin.firestore().collection('resetCodes').doc(phoneNumber).set({
            code: code,
            expiresAt: expiresAt,
            attempts: 0,
            createdAt: Date.now()
        });
        
        // Send WhatsApp
        await client.messages.create({
            body: `Your SkillSling password reset code is: ${code}. Valid for 10 minutes.`,
            from: 'whatsapp:' + twilioPhone,
            to: 'whatsapp:' + phoneNumber
        });
        
        return { success: true, message: 'Code sent successfully' };
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send WhatsApp message');
    }
});

// Verify reset code
exports.verifyResetCode = functions.https.onCall(async (data, context) => {
    const { phoneNumber, code } = data;
    
    try {
        // Get stored code
        const doc = await admin.firestore().collection('resetCodes').doc(phoneNumber).get();
        
        if (!doc.exists) {
            throw new functions.https.HttpsError('not-found', 'No reset code found');
        }
        
        const storedData = doc.data();
        
        // Check expiry
        if (Date.now() > storedData.expiresAt) {
            await doc.ref.delete();
            throw new functions.https.HttpsError('deadline-exceeded', 'Code expired');
        }
        
        // Check attempts
        if (storedData.attempts >= 3) {
            await doc.ref.delete();
            throw new functions.https.HttpsError('resource-exhausted', 'Too many attempts');
        }
        
        // Verify code
        if (storedData.code !== code) {
            await doc.ref.update({ attempts: storedData.attempts + 1 });
            throw new functions.https.HttpsError('invalid-argument', 'Invalid code');
        }
        
        // Code is valid, delete it
        await doc.ref.delete();
        
        return { success: true, message: 'Code verified' };
    } catch (error) {
        console.error('Error verifying code:', error);
        throw error;
    }
});

// Reset password with verified code
exports.resetPasswordWithCode = functions.https.onCall(async (data, context) => {
    const { phoneNumber, newPassword } = data;
    
    try {
        // Find user by phone number
        const usersSnapshot = await admin.firestore()
            .collection('users')
            .where('phone', '==', phoneNumber)
            .limit(1)
            .get();
        
        if (usersSnapshot.empty) {
            throw new functions.https.HttpsError('not-found', 'User not found');
        }
        
        const userDoc = usersSnapshot.docs[0];
        const userId = userDoc.id;
        
        // Update password in Firebase Auth
        await admin.auth().updateUser(userId, {
            password: newPassword
        });
        
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        console.error('Error resetting password:', error);
        throw new functions.https.HttpsError('internal', 'Failed to reset password');
    }
});
```

#### Step 3: Set Twilio Config
```bash
# Set Twilio credentials in Firebase
firebase functions:config:set twilio.sid="YOUR_ACCOUNT_SID"
firebase functions:config:set twilio.token="YOUR_AUTH_TOKEN"
firebase functions:config:set twilio.phone="+1234567890"

# Deploy functions
firebase deploy --only functions
```

---

### Phase 3: App UI Updates (2 hours)

#### Step 1: Update ForgotPasswordScreen

Add option to choose reset method:

```javascript
// Add to ForgotPasswordScreen.js
const [resetMethod, setResetMethod] = useState('email'); // 'email', 'sms', 'whatsapp'
const [phoneNumber, setPhoneNumber] = useState('');

// Add method selector UI
<View style={styles.methodSelector}>
    <TouchableOpacity
        style={[styles.methodButton, resetMethod === 'email' && styles.methodButtonActive]}
        onPress={() => setResetMethod('email')}
    >
        <Ionicons name="mail" size={24} color={resetMethod === 'email' ? '#fff' : theme.text} />
        <Text style={[styles.methodText, resetMethod === 'email' && styles.methodTextActive]}>
            Email
        </Text>
    </TouchableOpacity>
    
    <TouchableOpacity
        style={[styles.methodButton, resetMethod === 'sms' && styles.methodButtonActive]}
        onPress={() => setResetMethod('sms')}
    >
        <Ionicons name="chatbubble" size={24} color={resetMethod === 'sms' ? '#fff' : theme.text} />
        <Text style={[styles.methodText, resetMethod === 'sms' && styles.methodTextActive]}>
            SMS
        </Text>
    </TouchableOpacity>
    
    <TouchableOpacity
        style={[styles.methodButton, resetMethod === 'whatsapp' && styles.methodButtonActive]}
        onPress={() => setResetMethod('whatsapp')}
    >
        <Ionicons name="logo-whatsapp" size={24} color={resetMethod === 'whatsapp' ? '#fff' : theme.text} />
        <Text style={[styles.methodText, resetMethod === 'whatsapp' && styles.methodTextActive]}>
            WhatsApp
        </Text>
    </TouchableOpacity>
</View>

{/* Show email or phone input based on method */}
{resetMethod === 'email' ? (
    <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
    />
) : (
    <TextInput
        placeholder="Phone Number (+254...)"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
    />
)}
```

#### Step 2: Create VerifyCodeScreen

Create `src/screens/VerifyCodeScreen.js`:

```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useTheme } from '../config/ThemeContext';

export default function VerifyCodeScreen({ route, navigation }) {
    const { phoneNumber, resetMethod } = route.params;
    const { theme } = useTheme();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const functions = getFunctions();
    
    const handleVerifyAndReset = async () => {
        if (!code || !newPassword) {
            Alert.alert('Error', 'Please enter code and new password');
            return;
        }
        
        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        
        setLoading(true);
        
        try {
            // Verify code
            const verifyCode = httpsCallable(functions, 'verifyResetCode');
            await verifyCode({ phoneNumber, code });
            
            // Reset password
            const resetPassword = httpsCallable(functions, 'resetPasswordWithCode');
            await resetPassword({ phoneNumber, newPassword });
            
            Alert.alert(
                'Success',
                'Password reset successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Enter Verification Code</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                We sent a 6-digit code to {phoneNumber}
            </Text>
            
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
            />
            
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text }]}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={handleVerifyAndReset}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Verifying...' : 'Reset Password'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
```

#### Step 3: Update ForgotPasswordScreen Handler

```javascript
const handleResetPassword = async () => {
    setLoading(true);
    
    try {
        if (resetMethod === 'email') {
            // Existing email reset code
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Reset link sent to your email!');
        } else {
            // SMS or WhatsApp
            const functions = getFunctions();
            const functionName = resetMethod === 'sms' ? 'sendSMSResetCode' : 'sendWhatsAppResetCode';
            const sendCode = httpsCallable(functions, functionName);
            
            await sendCode({ phoneNumber });
            
            // Navigate to verification screen
            navigation.navigate('VerifyCode', {
                phoneNumber,
                resetMethod
            });
        }
    } catch (error) {
        Alert.alert('Error', error.message);
    } finally {
        setLoading(false);
    }
};
```

---

## 💰 Cost Breakdown

### Twilio Costs:
- **SMS (Kenya):** ~$0.0075 per message
- **WhatsApp:** ~$0.005 per message
- **Phone Number:** ~$1/month
- **Estimated monthly (100 resets):** ~$1-2

### Firebase Costs:
- **Cloud Functions:** Free tier covers most usage
- **Firestore:** Minimal (storing codes temporarily)
- **Estimated monthly:** ~$0-5

### Total Estimated Cost:
- **Setup:** $0 (free trials)
- **Monthly:** $1-7 (low usage)
- **Per reset:** ~$0.005-0.0075

---

## 🔒 Security Considerations

### Code Security:
- ✅ 6-digit random codes
- ✅ 10-minute expiry
- ✅ Maximum 3 attempts
- ✅ One-time use
- ✅ Stored securely in Firestore

### Rate Limiting:
- ✅ Limit requests per phone number
- ✅ Limit requests per IP
- ✅ Prevent spam/abuse
- ✅ Twilio has built-in rate limiting

### Data Protection:
- ✅ Codes deleted after use
- ✅ Codes deleted after expiry
- ✅ No sensitive data in logs
- ✅ Secure Firebase rules

---

## 📋 Testing Checklist

### Before Production:
- [ ] Test SMS sending
- [ ] Test WhatsApp sending
- [ ] Test code verification
- [ ] Test password reset
- [ ] Test expiry (wait 10 minutes)
- [ ] Test invalid codes
- [ ] Test too many attempts
- [ ] Test with different phone formats
- [ ] Test error handling
- [ ] Test rate limiting

### Production Monitoring:
- [ ] Monitor Twilio usage
- [ ] Monitor Firebase function calls
- [ ] Track success/failure rates
- [ ] Monitor costs
- [ ] Set up alerts for high usage

---

## 🚀 Deployment Steps

### 1. Development Testing
```bash
# Test functions locally
firebase emulators:start

# Test in app with emulator
# Update Firebase config to use emulator
```

### 2. Production Deployment
```bash
# Deploy functions
firebase deploy --only functions

# Verify deployment
firebase functions:log

# Test with real phone number
```

### 3. App Update
```bash
# Update app with new screens
# Test thoroughly
# Build new version
eas build --platform android
```

---

## 📱 User Experience Flow

### SMS/WhatsApp Reset Flow:
1. User taps "Forgot Password?"
2. User selects SMS or WhatsApp
3. User enters phone number
4. User taps "Send Code"
5. User receives code via SMS/WhatsApp
6. User enters code in app
7. User enters new password
8. User taps "Reset Password"
9. Password is reset
10. User can login with new password

### Time: ~2-3 minutes (vs 5-10 minutes for email)

---

## 🎯 Launch Strategy

### Phase 1: Email Only (Current)
- ✅ Launch with email reset
- ✅ Gather user feedback
- ✅ Monitor usage

### Phase 2: Add SMS (Post-Launch)
- Add SMS reset option
- Test with small user group
- Monitor costs and usage
- Roll out to all users

### Phase 3: Add WhatsApp (Optional)
- Complete WhatsApp Business verification
- Add WhatsApp option
- Market as premium feature
- Monitor adoption

---

## 💡 Pro Tips

### Cost Optimization:
- Use WhatsApp (cheaper than SMS)
- Set daily limits per user
- Implement rate limiting
- Monitor and alert on high usage

### User Experience:
- Make email the default (free)
- Offer SMS/WhatsApp as alternatives
- Show estimated delivery time
- Provide resend option

### Security:
- Use short expiry times (10 minutes)
- Limit attempts (3 max)
- Log all reset attempts
- Monitor for abuse patterns

---

## 📞 Support Resources

### Twilio:
- Docs: https://www.twilio.com/docs
- Support: https://support.twilio.com
- Console: https://console.twilio.com

### Firebase:
- Docs: https://firebase.google.com/docs/functions
- Support: https://firebase.google.com/support
- Console: https://console.firebase.google.com

### Community:
- Stack Overflow: twilio + firebase tags
- GitHub: Twilio samples
- Discord: Firebase community

---

## ✅ Recommendation

### For Launch:
**Use email reset only** (current implementation)
- ✅ Free
- ✅ Standard practice
- ✅ Works globally
- ✅ No additional setup

### Post-Launch (Based on User Demand):
**Add SMS/WhatsApp if:**
- Users request it
- Email delivery is slow
- Target market prefers SMS/WhatsApp
- Budget allows (~$50-100/month)

### Priority:
- **High:** If targeting markets where WhatsApp is primary (Kenya, India, Brazil)
- **Medium:** If users complain about email delays
- **Low:** If email works well and users are satisfied

---

## 🎉 Conclusion

WhatsApp/SMS password reset is a valuable feature but not critical for launch. Your current email-based reset is:
- ✅ Professional
- ✅ Free
- ✅ Standard
- ✅ Sufficient for launch

**Recommendation:** Launch with email reset, gather user feedback, then add SMS/WhatsApp if there's demand.

**Estimated Implementation Time:** 4-6 hours when you're ready
**Estimated Cost:** $1-7/month for low usage

---

**Status:** Guide complete, ready for future implementation
**Priority:** Post-launch enhancement
**Next:** Focus on Play Store launch first! 🚀
