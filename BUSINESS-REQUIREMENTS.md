# SkillSling Business Requirements & Implementation Plan

## 1. Age Restrictions ✅
### Requirements:
- **Service Providers**: Must be 18+ years old
- **Service Seekers**: No age restriction (13+ for account creation)

### Implementation:
- ✅ Already validates age in RegisterScreen (13+ minimum)
- ⚠️ Need to add: 18+ validation for service providers specifically
- Add age verification check when user switches to provider mode

## 2. Ethical Services Policy ✅
### Prohibited Services:
- ❌ Prostitution
- ❌ Illegal activities
- ❌ Adult entertainment services
- ❌ Drug-related services
- ❌ Weapons sales
- ❌ Any unethical/illegal services

### Implementation:
- Add service validation during registration
- Add content moderation for custom services
- Add reporting system for inappropriate services
- Terms of Service agreement required

## 3. Business Viability Assessment 📊
### Current Features:
✅ User registration (customer/provider)
✅ Service marketplace
✅ Location-based discovery
✅ Multiple service categories (75+ services)
✅ Profile management
✅ Theme customization
✅ AI chat assistant
✅ Payment screen (demo)

### Missing for Business Launch:
⚠️ Real payment integration (Stripe/PayPal)
⚠️ In-app messaging system
⚠️ Review/rating system
⚠️ Booking system
⚠️ Service provider verification
⚠️ Dispute resolution
⚠️ Commission/monetization model

**Assessment**: App has good foundation but needs core features before business launch.

## 4. Review System 🌟
### App Reviews:
- Users can review the SkillSling app itself
- Rating: 1-5 stars
- Written feedback
- Suggestions for improvement
- Payment method feedback

### Service Reviews:
- Customers review service providers after service completion
- Rating: 1-5 stars
- Written review
- Photos (optional)
- Response from provider

### Where to See Suggestions:
- Admin dashboard (to be built)
- Firebase Firestore collection: `appReviews`
- Email notifications to admin
- In-app feedback section

## 5. In-App Messaging 💬
### Requirements:
- Direct messaging between customer and service provider
- Real-time chat
- Send text, images, location
- Message history
- Notification system
- Block/report users

### Implementation:
- Use Firebase Firestore for real-time messaging
- Create ChatScreen for 1-on-1 conversations
- Add messaging button on ServiceDetailScreen
- Store messages in: `chats/{chatId}/messages`

## 6. Location System 📍
### Current:
- Basic location permission
- Shows distance to services

### Enhanced Requirements:
#### Country Selection:
- User selects country during registration
- Shows counties/states for that country
- Dynamic location data based on country

#### Precise Location:
- **Option 1**: Use phone GPS (preferred)
  - Request location permission
  - Get lat/long coordinates
  - Reverse geocode to address
  
- **Option 2**: Manual entry
  - Country dropdown
  - State/County dropdown (dynamic based on country)
  - City input
  - Street address
  - ZIP/Postal code

### Location Data Structure:
```javascript
location: {
  country: "Kenya",
  state: "Nairobi County",
  city: "Nairobi",
  street: "Kenyatta Avenue",
  zipCode: "00100",
  coordinates: {
    latitude: -1.286389,
    longitude: 36.817223
  }
}
```

## Implementation Priority:

### Phase 1 (Immediate - Critical for Launch):
1. ✅ Age restriction (18+ for providers)
2. ✅ Ethical services validation
3. ✅ Enhanced location system
4. ✅ Review system (app + services)
5. ✅ In-app messaging

### Phase 2 (Before Business Launch):
6. Real payment integration
7. Booking/scheduling system
8. Service provider verification
9. Admin dashboard
10. Terms of Service & Privacy Policy

### Phase 3 (Post-Launch):
11. Push notifications
12. Advanced search/filters
13. Favorites/bookmarks
14. Service packages/deals
15. Referral system

## Monetization Model:
- Commission on completed services (10-20%)
- Premium provider subscriptions
- Featured listings
- Promoted services
- Booking fees

---
**Next Steps**: Implement Phase 1 features
