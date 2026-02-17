# React Native + Expo Beginner's Toolkit
**Moringa School GenAI Capstone Project**

---

## 1. Project Overview

**Technology:** React Native with Expo  
**Demo Project:** [Skillsling](https://github.com/Davicity254/Skillsling) - A service marketplace mobile app  
**Goal:** Learn mobile development by building and running a real app with authentication, database, and real-time chat

**Why React Native + Expo?**
- Write once in JavaScript, run on both iOS and Android
- No need for Xcode or Android Studio during development
- See changes instantly on your phone via Expo Go app
- Perfect for beginners - from zero to running app in 15 minutes

**Why Skillsling?**
This project demonstrates real-world features: user authentication, photo/video uploads, GPS location, real-time chat, and database queries - all the things you'd build in a production app.

---

## 2. What is React Native?

React Native is a framework by Meta (Facebook) that lets you build native mobile apps using JavaScript and React. Unlike web-based hybrid apps, React Native compiles to actual native iOS and Android components.

**Used by:** Facebook, Instagram, Shopify, Discord, Microsoft Teams

**Expo** sits on top of React Native and provides:
- Pre-configured development environment
- Expo Go app for instant phone preview
- Built-in modules for camera, location, notifications
- No native code configuration needed

**Firebase** provides the backend:
- Authentication (login/signup)
- Firestore database (stores app data)
- Storage (stores images/videos)

---

## 3. System Requirements

| What You Need | Version |
|--------------|---------|
| Node.js | 18+ |
| Phone | Android 6+ or iOS 13+ |
| Editor | VS Code recommended |
| Internet | Wi-Fi (same network for phone & laptop) |

**You do NOT need:** Android Studio, Xcode, or any mobile development tools

---

## 4. Setup Instructions

### Step 1: Install Node.js
Download from https://nodejs.org (LTS version)

Verify:
```bash
node --version  # Should show v18 or higher
```

### Step 2: Clone the Project
```bash
git clone https://github.com/Davicity254/Skillsling.git
cd Skillsling
npm install
```

### Step 3: Set Up Firebase (Critical!)

1. Go to https://console.firebase.google.com
2. Create new project → name it `skillsling-dev`
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database** → Start in test mode
5. Enable **Storage** → Test mode
6. Get config: Project Settings → Your apps → Web app → Copy config

7. **Paste config into your project:**
   - Open `src/config/firebase.js`
   - Replace the `firebaseConfig` object with your values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_KEY_HERE",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

### Step 4: Install Expo Go on Your Phone
- Android: Google Play Store → "Expo Go"
- iOS: App Store → "Expo Go"

### Step 5: Run the App
```bash
npx expo start
```

**On your phone:**
- Android: Open Expo Go → Scan QR code from terminal
- iOS: Open Camera → Scan QR code → Tap notification

First load takes ~30 seconds. After that, any code change auto-refreshes on your phone.

---

## 5. What the App Does

**Skillsling** is a two-sided marketplace:
- **Customers** browse local services (salons, repair shops, etc.)
- **Providers** create profiles, upload photos/videos, set prices
- Both can chat in real-time, leave reviews, and switch roles

**Test it:**
1. Register as Customer → Browse (empty at first)
2. Log out → Register as Provider → Add a service
3. Log back in as Customer → See the service → Chat with provider

---

## 6. AI Prompts Used

**Platform:** ai.moringaschool.com  
**Conversation Link:** [INSERT YOUR LINK HERE]

### Prompt 1: Understanding the Tech
**Prompt:** *"Explain React Native to a web developer who's never built a mobile app. What is it and why use Expo?"*

**Key Insight:** React Native is like React for mobile - same JSX syntax, but outputs native iOS/Android components instead of HTML. Expo removes all the painful native setup.

**Impact:** This analogy made everything click. I understood I was writing JavaScript that becomes real native UI, not a web view.

---

### Prompt 2: Reading the Codebase
**Prompt:** *"Explain the structure of a React Native app with Firebase and React Navigation in one App.js file"*

**Key Insight:** The AI explained that screens are just functions returning JSX, wrapped in a NavigationContainer that handles routing. Firebase initializes at the top, then screens use hooks like `useState` and `useEffect` to load data.

**Impact:** Gave me a mental map before diving into 3000+ lines of code. Made the file feel organized instead of overwhelming.

---

### Prompt 3: Firebase Setup
**Prompt:** *"Step-by-step: connect React Native Expo app to Firebase. What code initializes Firebase?"*

**Key Insight:** The AI walked through creating the Firebase project, enabling services, and explained the `initializeApp(firebaseConfig)` call. It warned about calling it twice (common error).

**Impact:** Saved me from the double-initialization error. The warning was gold.

---

### Prompt 4: Real-time Data
**Prompt:** *"How does Firestore work in React Native? Explain onSnapshot vs getDocs"*

**Key Insight:** `getDocs` = one-time fetch (like REST API). `onSnapshot` = live listener that fires on every data change. That's why the app updates in real-time.

**Impact:** This was a genuine "aha!" moment. Understanding the difference between one-time reads and live listeners is crucial for Firebase apps.

---

### Prompt 5: Debugging
**Prompt:** *"Error: FirebaseError: auth/invalid-api-key - what does this mean?"*

**Key Insight:** Config keys are wrong or still placeholders. Check: (1) exact match with Firebase console, (2) using web SDK not admin SDK, (3) Authentication is enabled.

**Impact:** Fixed in 5 minutes instead of 20 minutes on Stack Overflow. AI as first responder = huge productivity boost.

---

### Prompt 6: Expo Go vs Build
**Prompt:** *"Difference between Expo Go and development build? When to use each?"*

**Key Insight:** Expo Go works for standard Expo SDK packages. Development build needed for custom native code. For learning and testing, Expo Go is perfect.

**Impact:** Answered a question I didn't know to ask. Now I know when Expo Go stops being enough.

---

## 7. Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `auth/invalid-api-key` | Wrong Firebase config | Copy exact values from Firebase console to `src/config/firebase.js` |
| `Unable to resolve module` | Failed npm install | Delete `node_modules` → `npm install` |
| QR code won't scan | Different Wi-Fi networks | Connect both to same network, or use `npx expo start --tunnel` |
| "Something went wrong" | Syntax error in code | Check terminal output for actual error message |
| Location not working | Permission denied | Settings → App Permissions → Location → Allow |
| Firestore permission error | Security rules blocking | Firebase Console → Firestore → Rules → Set to test mode |

**Pro tip:** The terminal shows the real error. The phone just says "something went wrong" - always check your terminal first.

---

## 8. Testing & Iteration

**Tested with:** [Peer Name] on [Date]  
**Devices:** Android 12 (Samsung) and iOS 16 (iPhone)

**Issues Found:**
1. Firebase config had placeholders → Fixed by copying actual keys
2. QR code wouldn't scan on school Wi-Fi → Used tunnel mode
3. Services not loading → Added Firestore test mode rules

**Performance:**
- App loads in ~3 seconds after initial bundle
- Smooth scrolling, no lag
- Real-time chat updates instantly
- Camera/image picker work perfectly

**Iteration Process:**
1. First run: Crash → Fixed Firebase config
2. Second run: Empty data → Added test mode rules
3. Third run: Location failed → Granted permissions
4. Final: All features working ✅

---

## 9. Key Learnings

**What I learned:**
- Mobile development isn't as hard as I thought with the right tools
- Firebase makes backend setup trivial (no server code needed)
- Real-time listeners (`onSnapshot`) are powerful for live updates
- Expo Go is a game-changer for rapid testing
- AI prompts accelerate learning when used strategically

**Skills gained:**
- React Native component structure
- Firebase authentication & database queries
- Mobile navigation patterns
- Debugging mobile apps
- Reading and understanding large codebases

---

## 10. References

**Essential Docs:**
- React Native: https://reactnative.dev/docs/getting-started
- Expo: https://docs.expo.dev
- Firebase: https://firebase.google.com/docs/web/setup

**Helpful Videos:**
- React Native Crash Course: https://www.youtube.com/watch?v=0-S5a0eXPoc
- Expo + Firebase Tutorial: https://www.youtube.com/watch?v=ql4J6SpLXZA

**Community:**
- Expo Forums: https://forums.expo.dev
- Stack Overflow: [react-native] and [expo] tags

**Project Repo:**
- https://github.com/Davicity254/Skillsling

---

## Quick Reference: Key Concepts

| Term | Meaning |
|------|---------|
| JSX | HTML-like syntax for describing UI in React |
| Component | Reusable piece of UI (screen, button, card) |
| useState | React hook for storing changeable data |
| useEffect | React hook that runs code when component loads |
| FlatList | Efficient scrollable list in React Native |
| onSnapshot | Firestore real-time listener |
| Expo Go | Phone app for previewing your code instantly |
| Fast Refresh | Auto-reload when you save code changes |

---

**Project by:** [Your Name]  
**Technologies:** React Native, Expo, Firebase  
**Repository:** https://github.com/Davicity254/Skillsling  
**Submitted:** [Date]
