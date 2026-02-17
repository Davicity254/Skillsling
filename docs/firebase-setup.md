# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to https://firebase.google.com
2. Click "Get Started" or "Go to Console"
3. Click "Add Project"
4. Name it "SkillSling"
5. Disable Google Analytics (optional)
6. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get Started"
3. Click "Email/Password"
4. Enable it and Save

## Step 3: Create Firestore Database

1. Click "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select your region
5. Click "Enable"

## Step 4: Enable Storage

1. Click "Storage"
2. Click "Get Started"
3. Use default security rules
4. Click "Done"

## Step 5: Get Your Config

1. Click the gear icon ⚙️ > Project Settings
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app name: "SkillSling"
5. Copy the firebaseConfig object
6. Paste it into App.js replacing the placeholder

## Step 6: Firestore Structure

Create these collections:

### users
```
{
  uid: "user123",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  nationality: "USA",
  userType: "provider", // or "customer"
  profilePhoto: "url",
  createdAt: "2024-01-01"
}
```

### services
```
{
  id: "service123",
  providerId: "user123",
  title: "Professional Haircut",
  description: "Expert barber with 10 years experience",
  category: "barber",
  price: 25,
  photos: ["url1", "url2"],
  videos: ["url1"],
  externalLinks: ["instagram.com/mywork"],
  resumeUrl: "url",
  location: {
    lat: 40.7128,
    lng: -74.0060
  },
  createdAt: "2024-01-01"
}
```

Done! Your backend is ready.
