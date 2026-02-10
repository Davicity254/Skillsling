# SkillSling - Service Marketplace App

Find local services or offer your skills to customers nearby.

## Features

✅ User registration (Customer or Service Provider)
✅ Switch between customer/provider modes anytime
✅ Browse services by category (Salons, Barbers, Shops, etc.)
✅ Location-based service discovery
✅ Upload photos, videos, resume
✅ Add external portfolio links
✅ Chat assistant to find services quickly
✅ Service pricing and distance display

## Tech Stack

- **React Native (Expo)** - Cross-platform mobile framework
- **JavaScript** - Programming language
- **Firebase** - Backend (Auth, Firestore, Storage)
- **Expo Location** - GPS for nearby services
- **Expo Image Picker** - Media uploads

## Setup Instructions

1. Install Node.js from nodejs.org
2. Install Expo CLI:
   ```
   npm install -g expo-cli
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Setup Firebase:
   - Go to firebase.google.com
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Copy your config to App.js

5. Run the app:
   ```
   npm start
   ```
   Then scan QR code with Expo Go app on your phone

## How to Make Money

### 1. Commission Model (15-20%)
Take a percentage from each transaction between customer and provider

### 2. Subscription Plans
- **Free**: Basic listing
- **Pro ($9.99/month)**: Featured listings, unlimited photos
- **Business ($29.99/month)**: Priority placement, analytics

### 3. Featured Listings
Charge providers $5-20 to appear at top of search results

### 4. Advertising
Show ads to free users, remove ads for premium subscribers

### 5. Booking Fees
Charge $1-3 per booking made through the app

### 6. Lead Generation
Charge providers per customer inquiry/contact

### 7. Premium Features
- Verified badges ($10/month)
- Video uploads ($5/month)
- Advanced analytics ($15/month)

## Recommended Pricing Strategy

Start with:
- Free for customers (always)
- Free basic listing for providers
- 10% commission on transactions
- $14.99/month for premium provider features

## Next Steps

1. Get Firebase credentials
2. Test on your phone
3. Add payment integration (Stripe/PayPal)
4. Deploy to App Store & Google Play
5. Market to local service providers

Good luck! 🚀
