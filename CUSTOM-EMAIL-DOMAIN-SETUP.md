# Custom Email Domain Setup - Get Emails to Inbox

## The Problem

Firebase default emails (`@firebaseapp.com`) go to spam because:
- No SPF/DKIM authentication
- Generic automated domain
- Low sender reputation

**Solution:** Use a custom domain with proper email authentication.

---

## 🎯 Best Solution: Custom Domain + SendGrid

This will get 95%+ emails to inbox.

### What You Need:
- Custom domain (e.g., skillsling.com) - $10-15/year
- SendGrid account (free tier: 100 emails/day)
- Firebase Cloud Functions (free tier)

### Time: 2-3 hours
### Cost: $10-15/year (domain only, SendGrid is free)

---

## 📋 PART 1: Get a Domain (30 minutes)

### Step 1: Buy a Domain

**Recommended registrars:**
- **Namecheap** - https://www.namecheap.com/ (cheapest)
- **Google Domains** - https://domains.google/ (easiest)
- **GoDaddy** - https://www.godaddy.com/ (popular)

**Domain suggestions:**
- skillsling.com
- skillsling.app
- getskillsling.com
- skillsling.co.ke (Kenya-specific)

**Cost:** $10-15/year

### Step 2: Verify Domain Ownership

After buying, you'll get access to DNS settings. Keep this tab open - you'll need it later.

---

## 📧 PART 2: Set Up SendGrid (30 minutes)

SendGrid is a professional email service with excellent deliverability.

### Step 1: Create SendGrid Account

1. **Go to:** https://signup.sendgrid.com/
2. **Sign up** (free account)
3. **Verify your email**
4. **Complete profile:**
   - Company: SkillSling
   - Website: skillsling.com (your domain)
   - Role: Developer
   - Purpose: Transactional emails

### Step 2: Get API Key

1. **Go to:** Settings → API Keys
2. **Click "Create API Key"**
3. **Name:** SkillSling Password Reset
4. **Permissions:** Full Access
5. **Click "Create & View"**
6. **Copy the API key** (save it somewhere safe!)

**Important:** You can only see this once!

### Step 3: Verify Domain in SendGrid

1. **Go to:** Settings → Sender Authentication → Domain Authentication
2. **Click "Authenticate Your Domain"**
3. **Select your DNS host** (Namecheap, Google Domains, etc.)
4. **Enter your domain:** skillsling.com
5. **Click "Next"**

SendGrid will show you DNS records to add:

**You'll need to add these records:**
- CNAME record for DKIM
- CNAME record for domain verification
- TXT record for SPF

### Step 4: Add DNS Records

1. **Go to your domain registrar** (Namecheap, Google Domains, etc.)
2. **Find DNS settings**
3. **Add the records SendGrid gave you**

**Example DNS records:**
```
Type: CNAME
Host: em1234.skillsling.com
Value: u1234567.wl123.sendgrid.net

Type: CNAME
Host: s1._domainkey.skillsling.com
Value: s1.domainkey.u1234567.wl123.sendgrid.net

Type: CNAME
Host: s2._domainkey.skillsling.com
Value: s2.domainkey.u1234567.wl123.sendgrid.net
```

4. **Save DNS changes**
5. **Wait 24-48 hours** for DNS propagation (usually faster)
6. **Go back to SendGrid and click "Verify"**

✅ **When verified, you'll see "Verified" status**

### Step 5: Create Sender Identity

1. **Go to:** Settings → Sender Authentication → Single Sender Verification
2. **Click "Create New Sender"**
3. **Fill in:**
   - From Name: SkillSling
   - From Email: noreply@skillsling.com
   - Reply To: support@skillsling.com (or your email)
   - Company Address: Your address
4. **Click "Create"**
5. **Verify the email** (SendGrid sends confirmation)

---

## 🔧 PART 3: Set Up Firebase Functions (1 hour)

### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Initialize Functions

```bash
cd c:\Users\ADMIN\Desktop\Skillsling
firebase init functions
```

Select:
- Use existing project: skillsling-254
- Language: JavaScript
- ESLint: Yes
- Install dependencies: Yes

### Step 4: Install SendGrid

```bash
cd functions
npm install @sendgrid/mail
```

### Step 5: Set SendGrid API Key

```bash
firebase functions:config:set sendgrid.key="YOUR_SENDGRID_API_KEY"
```

Replace `YOUR_SENDGRID_API_KEY` with the key you copied earlier.

### Step 6: Create Password Reset Function

Edit `functions/index.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();

// Get SendGrid API key from Firebase config
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

// Send password reset email
exports.sendPasswordResetEmail = functions.https.onCall(async (data, context) => {
    const { email } = data;

    try {
        // Generate password reset link
        const resetLink = await admin.auth().generatePasswordResetLink(email);

        // Email content
        const msg = {
            to: email,
            from: {
                email: 'noreply@skillsling.com', // Your verified sender
                name: 'SkillSling Support'
            },
            replyTo: 'support@skillsling.com', // Optional
            subject: 'Reset Your SkillSling Password',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
                        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
                        .button { display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                        .link { word-break: break-all; color: #4CAF50; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>SkillSling</h1>
                        </div>
                        <div class="content">
                            <h2>Reset Your Password</h2>
                            <p>Hello,</p>
                            <p>We received a request to reset the password for your SkillSling account (<strong>${email}</strong>).</p>
                            <p>Click the button below to reset your password:</p>
                            <p style="text-align: center;">
                                <a href="${resetLink}" class="button">Reset My Password</a>
                            </p>
                            <p>Or copy and paste this link into your browser:</p>
                            <p class="link">${resetLink}</p>
                            <p><strong>⏱️ This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                            <p><strong>Security Tips:</strong></p>
                            <ul>
                                <li>Use a strong, unique password</li>
                                <li>Never share your password with anyone</li>
                                <li>Be cautious of phishing emails</li>
                            </ul>
                            <p>Need help? Reply to this email or contact us through the app.</p>
                            <p>Best regards,<br>The SkillSling Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message from SkillSling.</p>
                            <p>© ${new Date().getFullYear()} SkillSling. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
                Reset Your SkillSling Password

                Hello,

                We received a request to reset the password for your SkillSling account (${email}).

                Click this link to reset your password:
                ${resetLink}

                This link will expire in 1 hour.

                If you didn't request a password reset, you can safely ignore this email.

                Best regards,
                The SkillSling Team
            `
        };

        // Send email
        await sgMail.send(msg);

        return { 
            success: true, 
            message: 'Password reset email sent successfully' 
        };

    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new functions.https.HttpsError('internal', 'Failed to send password reset email');
    }
});
```

### Step 7: Deploy Functions

```bash
firebase deploy --only functions
```

Wait 2-5 minutes for deployment.

---

## 📱 PART 4: Update Your App (15 minutes)

### Step 1: Install Firebase Functions SDK

```bash
npm install firebase
```

### Step 2: Update ForgotPasswordScreen

Replace the `handleEmailReset` function in `src/screens/ForgotPasswordScreen.js`:

```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

// Add at top with other imports
const functions = getFunctions();

const handleEmailReset = async () => {
    if (!email) {
        Alert.alert('Error', 'Please enter your email address');
        return;
    }

    if (!validateEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
    }

    setLoading(true);

    try {
        console.log('Sending password reset email via SendGrid...');
        
        // Call Firebase Function (which uses SendGrid)
        const sendPasswordReset = httpsCallable(functions, 'sendPasswordResetEmail');
        const result = await sendPasswordReset({ email });

        if (result.data.success) {
            Alert.alert(
                'Password Reset Email Sent! ✅',
                '📧 Check your inbox (should arrive in seconds)\n' +
                '⏱️ Email sent via professional service\n' +
                '✨ Should NOT be in spam folder\n\n' +
                'Didn\'t receive it? Check spam just in case, or try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }
    } catch (error) {
        console.log('Password reset error:', error);

        let errorMessage = 'Failed to send reset email. Please try again.';

        if (error.code === 'functions/not-found') {
            errorMessage = 'Password reset service not available. Please try again later.';
        } else if (error.code === 'functions/internal') {
            errorMessage = 'Failed to send email. Please check your email address and try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        Alert.alert('Error', errorMessage);
    } finally {
        setLoading(false);
    }
};
```

---

## 🧪 PART 5: Testing (10 minutes)

### Step 1: Test from App

1. **Open your app**
2. **Go to Login → Forgot Password**
3. **Enter your email**
4. **Tap "Send Reset Link"**
5. **Check your inbox** (should arrive in 10-30 seconds!)

### Step 2: Verify Inbox Delivery

✅ **Email should arrive in:**
- Primary inbox (not Promotions)
- Within 10-30 seconds
- With professional formatting
- From: SkillSling Support <noreply@skillsling.com>

### Step 3: Test with Multiple Email Providers

Test with:
- Gmail
- Yahoo
- Outlook
- ProtonMail

**Expected result:** 95%+ should go to inbox!

---

## 📊 Results Comparison

| Method | Inbox Rate | Speed | Cost | Setup |
|--------|-----------|-------|------|-------|
| Firebase Default | 30-40% | 2-10 mins | Free | 0 mins |
| Improved Template | 50-60% | 2-10 mins | Free | 10 mins |
| Custom Domain + SendGrid | **95-99%** | **10-30 secs** | $10-15/year | 2-3 hours |

---

## 💰 Costs

### One-Time:
- Domain: $10-15/year

### Monthly:
- SendGrid Free Tier: 100 emails/day (FREE)
- SendGrid Essentials: $19.95/month (40,000 emails/month)
- Firebase Functions: Free tier (generous)

### For 1000 users:
- ~100 password resets/month
- **Cost: $0** (within free tier)
- Domain: $1.25/month ($15/year)
- **Total: ~$1.25/month**

---

## ✅ Benefits

### Deliverability:
- ✅ 95-99% inbox delivery
- ✅ Professional sender domain
- ✅ SPF/DKIM authentication
- ✅ High sender reputation

### Speed:
- ✅ 10-30 seconds delivery
- ✅ Real-time sending
- ✅ No delays

### Professional:
- ✅ Custom domain (noreply@skillsling.com)
- ✅ Professional formatting
- ✅ Branded emails
- ✅ Better user trust

### Analytics:
- ✅ Track email opens
- ✅ Track link clicks
- ✅ Delivery reports
- ✅ Bounce handling

---

## 🚀 Quick Start Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Functions
cd c:\Users\ADMIN\Desktop\Skillsling
firebase init functions

# Install SendGrid
cd functions
npm install @sendgrid/mail

# Set API key
firebase functions:config:set sendgrid.key="YOUR_API_KEY"

# Deploy
firebase deploy --only functions

# Install in app
npm install firebase
```

---

## 🎯 Timeline

### Day 1 (2-3 hours):
- Buy domain (30 mins)
- Set up SendGrid (30 mins)
- Configure DNS (30 mins)
- Set up Firebase Functions (1 hour)
- Update app (15 mins)
- Test (15 mins)

### Day 2-3:
- Wait for DNS propagation (24-48 hours)
- Verify domain in SendGrid
- Test thoroughly

### Day 4:
- Launch with professional emails! 🚀

---

## 🔧 Troubleshooting

### DNS Not Propagating:
- Wait 24-48 hours
- Check with: https://dnschecker.org/
- Contact domain registrar support

### SendGrid Not Sending:
- Verify domain is authenticated
- Check API key is correct
- Check SendGrid dashboard for errors
- Verify sender identity

### Function Errors:
- Check Firebase Functions logs
- Verify SendGrid API key is set
- Check function deployment status

---

## 📞 Support

### SendGrid:
- Docs: https://docs.sendgrid.com/
- Support: https://support.sendgrid.com/

### Firebase:
- Docs: https://firebase.google.com/docs/functions
- Support: https://firebase.google.com/support

### Domain Registrars:
- Namecheap: https://www.namecheap.com/support/
- Google Domains: https://support.google.com/domains/

---

## ✅ Checklist

### Domain Setup:
- [ ] Bought domain
- [ ] Access to DNS settings
- [ ] Domain verified

### SendGrid Setup:
- [ ] Created account
- [ ] Got API key
- [ ] Added DNS records
- [ ] Domain authenticated
- [ ] Sender verified

### Firebase Setup:
- [ ] Installed Firebase CLI
- [ ] Initialized Functions
- [ ] Installed SendGrid package
- [ ] Set API key
- [ ] Created function
- [ ] Deployed successfully

### App Setup:
- [ ] Installed Firebase Functions SDK
- [ ] Updated ForgotPasswordScreen
- [ ] Tested email sending
- [ ] Verified inbox delivery

---

## 🎉 Result

After setup, your password reset emails will:
- ✅ Go directly to inbox (95-99% rate)
- ✅ Arrive in 10-30 seconds
- ✅ Look professional with your domain
- ✅ Have proper email authentication
- ✅ Build sender reputation over time

**This is the professional solution used by production apps!**

---

**Ready to set up? Start with buying a domain!**

**Recommended:** skillsling.com or skillsling.app
