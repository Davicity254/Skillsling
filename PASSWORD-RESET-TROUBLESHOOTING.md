# Password Reset Email Troubleshooting Guide

## Issue: Not Receiving Password Reset Emails

### ✅ What We've Verified

1. **Firebase Configuration** - Correct ✅
   - API Key: Present
   - Auth Domain: skillsling-254.firebaseapp.com
   - Project ID: skillsling-254

2. **Code Implementation** - Correct ✅
   - Using `sendPasswordResetEmail()` from Firebase Auth
   - Proper error handling
   - Email validation

3. **Enhanced Logging** - Added ✅
   - Console logs for debugging
   - Detailed error messages
   - Network error detection

---

## 🔍 Troubleshooting Steps

### Step 1: Verify Firebase Console Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **skillsling-254**
3. Go to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Verify it's **ENABLED**
6. Check if there are any domain restrictions

### Step 2: Check Email Templates

1. In Firebase Console → **Authentication**
2. Click on **Templates** tab
3. Find **Password reset** template
4. Click **Edit** (pencil icon)
5. Verify:
   - Template is enabled
   - "From" email is correct
   - Template looks good
6. You can customize the template here

### Step 3: Test with Known Email

Try these steps in order:

1. **Use the exact email you registered with**
   - Check for typos
   - Check for extra spaces
   - Email is case-sensitive in some systems

2. **Check ALL email folders:**
   - Inbox
   - Spam/Junk
   - Promotions (Gmail)
   - Updates (Gmail)
   - Social (Gmail)

3. **Wait 5-10 minutes**
   - Sometimes emails are delayed
   - Firebase may queue emails

4. **Try a different email provider**
   - If using Gmail, try Yahoo or Outlook
   - Some providers have stricter spam filters

### Step 4: Check Firebase Logs

1. Go to Firebase Console
2. Click on **Authentication** → **Users**
3. Find your user account
4. Check if the email is verified
5. Go to **Firestore Database** → **users** collection
6. Find your user document
7. Verify the email matches exactly

### Step 5: Test the Enhanced Error Logging

1. Open your app
2. Go to **Login** → **Forgot Password?**
3. Enter your email
4. Tap **Send Reset Link**
5. Check the console/terminal for logs:
   ```
   Attempting to send password reset email to: [email]
   Password reset email sent successfully
   ```
   OR
   ```
   Password reset error: [error details]
   Error code: [error code]
   Error message: [error message]
   ```

### Step 6: Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `auth/user-not-found` | Email not registered | Register first or check email spelling |
| `auth/invalid-email` | Email format invalid | Check email format |
| `auth/too-many-requests` | Too many attempts | Wait 15-30 minutes |
| `auth/network-request-failed` | No internet | Check connection |
| `auth/unauthorized-domain` | Domain not authorized | Add domain in Firebase Console |

---

## 🔧 Quick Fixes

### Fix 1: Authorize Your Domain

If you get `auth/unauthorized-domain`:

1. Firebase Console → **Authentication** → **Settings**
2. Scroll to **Authorized domains**
3. Add these domains:
   - `localhost`
   - `skillsling-254.firebaseapp.com`
   - Your custom domain (if any)

### Fix 2: Check Firebase Billing

1. Go to Firebase Console → **Settings** → **Usage and billing**
2. Verify you're on **Blaze (Pay as you go)** plan
3. Email sending may be limited on free plan
4. Check if you've hit any quotas

### Fix 3: Verify Email Provider Settings

Some email providers (especially corporate/school emails) block automated emails:

- **Gmail:** Usually works fine
- **Yahoo:** May delay emails
- **Outlook/Hotmail:** May block automated emails
- **Corporate/School:** Often blocks automated emails

**Solution:** Try with a personal Gmail account first.

---

## 🧪 Testing Procedure

### Test 1: Basic Email Reset

1. Open app
2. Tap **Login**
3. Tap **Forgot Password?**
4. Enter email: `[your-test-email]@gmail.com`
5. Tap **Send Reset Link**
6. Check console for logs
7. Wait 2-5 minutes
8. Check email (all folders)

### Test 2: Error Handling

1. Try with invalid email: `notanemail`
   - Should show: "Please enter a valid email address"

2. Try with non-existent email: `doesnotexist@gmail.com`
   - Should show: "No account found with this email address"

3. Try multiple times rapidly
   - Should eventually show: "Too many attempts"

### Test 3: Full Reset Flow

1. Send reset email
2. Receive email (check spam)
3. Click link in email
4. Should open Firebase password reset page
5. Enter new password
6. Confirm new password
7. Submit
8. Return to app
9. Login with new password

---

## 📧 What the Email Should Look Like

**Subject:** Reset your password for SkillSling

**From:** noreply@skillsling-254.firebaseapp.com

**Content:**
```
Hello,

Follow this link to reset your SkillSling password for your [email] account.

[Reset Password Button/Link]

If you didn't ask to reset your password, you can ignore this email.

Thanks,
Your SkillSling team
```

---

## 🚨 If Still Not Working

### Option 1: Check Firebase Status

1. Go to [Firebase Status Dashboard](https://status.firebase.google.com/)
2. Check if there are any ongoing issues with Authentication

### Option 2: Try Firebase Support

1. Go to Firebase Console
2. Click **?** (Help) icon
3. Select **Contact Support**
4. Describe the issue

### Option 3: Alternative Reset Method

For now, you can manually reset passwords:

1. Go to Firebase Console
2. **Authentication** → **Users**
3. Find the user
4. Click **⋮** (three dots)
5. Select **Reset password**
6. Firebase will send the email directly

### Option 4: Implement Phone/SMS Reset

If email continues to fail, consider implementing SMS reset:
- See `WHATSAPP-RESET-SETUP-GUIDE.md`
- Requires Twilio account
- Costs ~$0.01 per SMS

---

## 📊 Debug Checklist

Use this checklist to systematically debug:

- [ ] Firebase Authentication is enabled
- [ ] Email/Password sign-in method is enabled
- [ ] Email template is enabled and configured
- [ ] Domain is authorized in Firebase Console
- [ ] User account exists with correct email
- [ ] Email address has no typos or extra spaces
- [ ] Checked all email folders (inbox, spam, etc.)
- [ ] Waited at least 5-10 minutes
- [ ] Tried with different email provider
- [ ] Checked console logs for errors
- [ ] Verified internet connection
- [ ] Not hitting rate limits (too many requests)
- [ ] Firebase project has no billing issues
- [ ] Firebase Status Dashboard shows no issues

---

## 💡 Pro Tips

1. **Always check spam folder first** - Most common issue
2. **Wait 5-10 minutes** - Emails can be delayed
3. **Use Gmail for testing** - Most reliable
4. **Check console logs** - They tell you exactly what's wrong
5. **Try incognito/private browser** - For the reset link
6. **Clear browser cache** - If reset page doesn't load

---

## 📱 Testing on Device

If testing on physical device:

1. Make sure device has internet
2. Check device email app settings
3. Try opening email in browser instead
4. Some email apps block external links

---

## ✅ Success Indicators

You'll know it's working when:

1. Console shows: "Password reset email sent successfully"
2. Alert shows: "Success - Password reset email sent!"
3. Email arrives within 2-5 minutes
4. Email contains working reset link
5. Reset link opens Firebase password reset page
6. New password works for login

---

## 🔄 Next Steps

After fixing email reset:

1. Test with multiple email providers
2. Test the full reset flow end-to-end
3. Document any issues for users
4. Consider adding SMS/WhatsApp backup method
5. Add email verification on registration

---

## 📞 Need More Help?

If you've tried everything and it still doesn't work:

1. Share the console logs (from Step 5)
2. Share the exact error message
3. Confirm which email provider you're using
4. Confirm if the email exists in Firebase Users
5. Share screenshot of Firebase Auth settings

I can help debug further with this information!

---

**Last Updated:** February 9, 2026
**Status:** Enhanced logging added, ready for testing
