# Legal Documents Guide - What to Do Next

## ✅ Documents Created

I've created two comprehensive legal documents for SkillSling:

1. **PRIVACY-POLICY.md** - 14 sections covering all aspects of data collection and privacy
2. **TERMS-OF-SERVICE.md** - 18 sections covering user agreements and legal protections

---

## 📋 What These Documents Contain

### Privacy Policy Covers:
✅ What information you collect (account, profile, location, messages, etc.)
✅ How you use the information (provide service, improve app, communicate)
✅ How you share information (publicly visible data, service providers, legal requirements)
✅ Data storage and security (Firebase, encryption, retention)
✅ User rights (access, update, delete, data portability)
✅ Children's privacy (age requirements: 13+ customers, 18+ providers)
✅ Third-party services (Firebase, Expo)
✅ International data transfers
✅ Contact information
✅ Regional compliance (Kenya, EU/GDPR, California/CCPA)
✅ Data breach notification
✅ Cookies and tracking

### Terms of Service Covers:
✅ Eligibility and age requirements
✅ Account registration and security
✅ User types (Customer vs Provider modes)
✅ Prohibited services (drugs, weapons, prostitution, etc.)
✅ User conduct and responsibilities
✅ Platform role (you're a marketplace, not a service provider)
✅ Content and intellectual property
✅ Reviews and ratings guidelines
✅ Privacy and data protection
✅ Disclaimers and limitations of liability
✅ Indemnification (user responsibility)
✅ Dispute resolution and arbitration
✅ Termination policies
✅ Changes to terms
✅ Contact information

---

## 🔧 What You Need to Customize

Before using these documents, you MUST update the following placeholders:

### In Both Documents:

1. **[Your Company Name]** - Replace with your actual company/business name
   - Example: "SkillSling Ltd" or "John Doe Trading As SkillSling"

2. **[your-email@example.com]** - Replace with your actual contact email
   - Example: "support@skillsling.com" or "contact@skillsling.app"

3. **[Your Business Address]** - Replace with your actual business address
   - Example: "123 Main Street, Nairobi, Kenya"

4. **[Your Phone Number]** - Replace with your actual phone number
   - Example: "+254 712 345 678"

5. **[Your Location]** - For arbitration/legal venue (in Terms of Service)
   - Example: "Nairobi, Kenya" or "Kenya"

6. **[Your Country/State]** - For governing law (in Terms of Service)
   - Example: "Kenya" or "Republic of Kenya"

7. **[Arbitration Rules]** - If you want to specify arbitration rules
   - Example: "Nairobi Centre for International Arbitration (NCIA) Rules"

### Optional Customizations:

- Add your website URL if you have one
- Add social media links
- Adjust retention periods if needed
- Add specific regional provisions for your target markets
- Modify age requirements if needed (currently 13+ customers, 18+ providers)

---

## 📱 How to Use These Documents

### Option 1: Host on a Website (Recommended)

**Best for:** Professional appearance, easy updates, Google Play compliance

**Steps:**
1. Create a simple website (use Wix, WordPress, or GitHub Pages - free options)
2. Create two pages: "Privacy Policy" and "Terms of Service"
3. Copy the content from the .md files
4. Convert markdown to HTML (use pandoc or online converters)
5. Publish the pages
6. Get the URLs (e.g., https://skillsling.com/privacy and https://skillsling.com/terms)
7. Add these URLs to your app.json and Play Store listing

**Pros:**
- Professional appearance
- Easy to update without app updates
- Google Play prefers hosted policies
- Can be linked from anywhere

**Cons:**
- Requires a website (but free options available)
- Need to maintain the website

---

### Option 2: Include in the App

**Best for:** Quick launch, no website needed

**Steps:**
1. Create two new screens in your app:
   - `PrivacyPolicyScreen.js`
   - `TermsOfServiceScreen.js`
2. Display the content in a ScrollView
3. Link to these screens from:
   - Registration screen (checkbox: "I agree to Terms and Privacy Policy")
   - Settings screen
   - Login screen (small link at bottom)

**Pros:**
- No website needed
- Always available offline
- Complete control

**Cons:**
- Updates require app updates
- Takes up app space
- Less professional appearance

---

### Option 3: Hybrid Approach (Best of Both)

**Best for:** Maximum compliance and flexibility

**Steps:**
1. Host on website (primary)
2. Also include in app (backup)
3. App can load from website with fallback to local copy

**Pros:**
- Best of both worlds
- Complies with all requirements
- Always accessible

**Cons:**
- More work to set up
- Need to maintain both

---

## 🎯 Recommended Approach for SkillSling

### For Quick Launch (This Week):

**Use Option 2 (In-App) for now:**

1. Create two simple screens to display the policies
2. Add links from registration and settings
3. Add checkboxes on registration: "I agree to Terms and Privacy Policy"
4. This gets you compliant for Play Store submission

**Later (After Launch):**

1. Create a simple website (free GitHub Pages or Wix)
2. Host the policies there
3. Update app to link to website versions
4. Keep in-app versions as backup

---

## 📝 Implementation Steps

### Step 1: Customize the Documents (30 minutes)

1. Open PRIVACY-POLICY.md
2. Find and replace all placeholders:
   - [Your Company Name]
   - [your-email@example.com]
   - [Your Business Address]
   - [Your Phone Number]
3. Save the file
4. Repeat for TERMS-OF-SERVICE.md

### Step 2: Create In-App Screens (1-2 hours)

I can help you create:
- `PrivacyPolicyScreen.js` - Display privacy policy
- `TermsOfServiceScreen.js` - Display terms of service
- Update `RegisterScreen.js` - Add agreement checkboxes
- Update `SettingsScreen.js` - Add links to policies

### Step 3: Add to Play Store Listing (5 minutes)

When creating your Play Store listing:
1. In the "Privacy Policy" field, enter:
   - Website URL (if hosted)
   - Or: "Privacy policy available in app under Settings"
2. Google Play requires a privacy policy URL for apps that collect personal data

---

## ⚖️ Legal Disclaimer

**IMPORTANT:** These documents are templates based on common practices and requirements. They are NOT a substitute for legal advice.

**You should:**
- ✅ Have a lawyer review these documents
- ✅ Ensure compliance with your local laws
- ✅ Customize for your specific business needs
- ✅ Update as your app evolves

**Especially important if:**
- You're collecting sensitive data
- You're targeting specific regions (EU, California, etc.)
- You're processing payments
- You're dealing with minors
- You have specific business requirements

**Cost of legal review:** $200-1000 (varies by location and lawyer)

---

## 🌍 Regional Compliance Notes

### Kenya (Your Primary Market)
✅ Complies with Kenya Data Protection Act, 2019
✅ Includes data protection commissioner reference
✅ Covers user rights under Kenyan law

### European Union (GDPR)
✅ Includes GDPR-specific provisions
✅ Covers all required user rights
✅ Explains legal basis for processing
✅ Includes data portability

### California (CCPA)
✅ Includes CCPA-specific provisions
✅ Clarifies no selling of data
✅ Covers California user rights

### Other Regions
✅ General provisions cover most jurisdictions
✅ May need specific additions for:
   - China (if targeting Chinese users)
   - Brazil (LGPD)
   - Australia (Privacy Act)
   - Canada (PIPEDA)

---

## ✅ Checklist

Before submitting to Play Store:

- [ ] Customize all placeholders in Privacy Policy
- [ ] Customize all placeholders in Terms of Service
- [ ] Decide on hosting method (website vs in-app)
- [ ] Create in-app screens (if using Option 2 or 3)
- [ ] Add agreement checkboxes to registration
- [ ] Add links to policies in settings
- [ ] Test that policies are accessible
- [ ] Have a lawyer review (recommended)
- [ ] Add privacy policy URL to Play Store listing
- [ ] Keep copies of all versions (for records)

---

## 🚀 Next Steps

**Today:**
1. Customize the placeholders in both documents
2. Decide on hosting method
3. Let me know if you want me to create the in-app screens

**Tomorrow:**
1. Implement the chosen method
2. Test that everything works
3. Move on to screenshots and app description

---

## 📞 Need Help?

Let me know if you want me to:
- Create the in-app policy screens
- Help set up a free website for hosting
- Adjust any sections of the policies
- Add specific provisions for your region
- Create the agreement checkboxes for registration

---

**You're making great progress! Legal documents ✅**

**Next up:** Screenshots and app description 📸
