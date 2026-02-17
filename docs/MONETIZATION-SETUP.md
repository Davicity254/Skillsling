# How to Make Money - Complete Setup

## Revenue Streams Built Into Your App

### 1. Commission on Transactions (10-15%)

**How it works:**
- Customer pays $100 for service
- You keep $10-15
- Provider gets $85-90

**Setup:**
```javascript
// In PaymentScreen.js
const COMMISSION_RATE = 0.10; // 10%
const commission = amount * COMMISSION_RATE;
const providerAmount = amount - commission;
```

### 2. Subscription Plans

**Pricing Structure:**

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 service listing, 3 photos |
| Pro | $14.99/mo | Unlimited listings, videos, featured badge |
| Business | $29.99/mo | Priority placement, analytics, no commission |

**Implementation:**
Use Stripe Subscriptions or RevenueCat (easier)

```bash
npm install react-native-purchases
```

**Create subscription products in Stripe:**
1. Go to Stripe Dashboard → Products
2. Create "Pro Plan" - $14.99/month
3. Create "Business Plan" - $29.99/month
4. Copy price IDs

### 3. Featured Listings ($10-20 each)

Providers pay to appear at top of search results for 7 days.

**Add to Firestore:**
```javascript
{
  serviceId: "abc123",
  featured: true,
  featuredUntil: "2024-02-15",
  featuredPrice: 15
}
```

**In SearchScreen.js:**
```javascript
// Sort featured first
services.sort((a, b) => {
  if (a.featured && !b.featured) return -1;
  if (!a.featured && b.featured) return 1;
  return 0;
});
```

### 4. Booking Fees ($2 per booking)

Add $2 to each transaction as platform fee.

```javascript
const bookingFee = 2.00;
const totalAmount = servicePrice + bookingFee;
```

### 5. Advertising Revenue

**Google AdMob Integration:**
```bash
npm install react-native-google-mobile-ads
```

Show ads to free users:
- Banner ads: $0.50-2 per 1000 views
- Interstitial ads: $3-5 per 1000 views

Remove ads for premium subscribers.

---

## Revenue Calculator

### Conservative Estimate (Year 1):

**Users:**
- 500 service providers
- 2,000 customers

**Monthly Revenue:**
- 100 Pro subscriptions × $14.99 = $1,499
- 20 Business subscriptions × $29.99 = $600
- 50 featured listings × $15 = $750
- 200 transactions × $100 × 10% commission = $2,000
- 200 booking fees × $2 = $400
- Ad revenue = $300

**Total: $5,549/month = $66,588/year**

### Optimistic Estimate (Year 2):

**Users:**
- 2,000 providers
- 10,000 customers

**Monthly Revenue:**
- 500 Pro × $14.99 = $7,495
- 100 Business × $29.99 = $2,999
- 200 featured × $15 = $3,000
- 1,000 transactions × $100 × 10% = $10,000
- 1,000 bookings × $2 = $2,000
- Ads = $1,500

**Total: $26,994/month = $323,928/year**

---

## Implementation Steps

### Week 1: Basic Payments
1. Setup Stripe account
2. Add payment screen
3. Test transactions
4. Add commission logic

### Week 2: Subscriptions
1. Create subscription plans in Stripe
2. Add subscription screen
3. Implement feature restrictions
4. Test upgrade/downgrade

### Week 3: Additional Features
1. Add featured listings
2. Implement booking fees
3. Add AdMob
4. Create admin dashboard

### Week 4: Testing & Launch
1. Test all payment flows
2. Verify commission calculations
3. Launch marketing campaign
4. Monitor revenue

---

## Stripe Setup (Detailed)

### 1. Create Account
- Go to https://stripe.com
- Sign up (free)
- Verify email and business info

### 2. Get API Keys
- Dashboard → Developers → API Keys
- Copy "Publishable key" (starts with pk_)
- Copy "Secret key" (starts with sk_)
- Use test keys first (pk_test_, sk_test_)

### 3. Create Products
- Dashboard → Products → Add Product
- Name: "Pro Subscription"
- Price: $14.99/month recurring
- Copy Price ID

### 4. Add to App
In `App.js`:
```javascript
<StripeProvider publishableKey="pk_test_YOUR_KEY">
```

### 5. Create Backend
You need a server to create payment intents. Use Firebase Functions:

```bash
firebase init functions
cd functions
npm install stripe
```

`functions/index.js`:
```javascript
const functions = require('firebase-functions');
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

exports.createPaymentIntent = functions.https.onCall(async (data) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount * 100, // Convert to cents
    currency: 'usd',
    metadata: {
      serviceId: data.serviceId,
      userId: data.userId
    }
  });
  return { clientSecret: paymentIntent.client_secret };
});

exports.createSubscription = functions.https.onCall(async (data) => {
  const subscription = await stripe.subscriptions.create({
    customer: data.customerId,
    items: [{ price: data.priceId }],
  });
  return { subscriptionId: subscription.id };
});
```

Deploy:
```bash
firebase deploy --only functions
```

---

## Legal Requirements

### 1. Terms of Service
Include:
- Commission rates
- Refund policy
- User responsibilities
- Dispute resolution

### 2. Privacy Policy
Required for app stores. Use generator:
- https://www.privacypolicies.com
- https://app-privacy-policy-generator.firebaseapp.com

### 3. Payment Processing Agreement
Stripe handles most compliance, but you need:
- Business registration
- Tax ID (EIN in US)
- Bank account for payouts

### 4. Taxes
- Collect sales tax where required
- Issue 1099 forms to providers (US)
- Consult accountant for your country

---

## Marketing to Maximize Revenue

### 1. Launch Strategy
- Offer first month free for early providers
- Give $10 credit to first 100 customers
- Partner with 10 local businesses

### 2. Growth Tactics
- Referral program: $5 for referrer + referee
- Social media contests
- Local SEO optimization
- Google/Facebook ads ($500/month budget)

### 3. Retention
- Email marketing (Mailchimp)
- Push notifications for deals
- Loyalty rewards
- Monthly provider spotlights

---

## Tracking Revenue

### Create Admin Dashboard

Add to Firebase:
```javascript
// Track all transactions
{
  transactionId: "tx123",
  amount: 100,
  commission: 10,
  providerId: "user123",
  customerId: "user456",
  date: "2024-02-06",
  status: "completed"
}
```

**Simple Analytics:**
- Total revenue
- Revenue by type (commission, subscriptions, etc.)
- Top providers
- Growth rate

Use Firebase Analytics or create custom dashboard.

---

## Next Steps

1. ✅ Setup Stripe account TODAY
2. ✅ Add payment screen to app
3. ✅ Test with Stripe test cards
4. ✅ Create subscription plans
5. ✅ Launch with basic payments
6. ✅ Add advanced features later

**Start simple, scale up!**

Test card for Stripe:
- Card: 4242 4242 4242 4242
- Expiry: Any future date
- CVC: Any 3 digits

Good luck! 💰
