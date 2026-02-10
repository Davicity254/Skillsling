# SkillSling Icon Setup Instructions

## Your Slingshot Icon
You have a great blue slingshot with orange ball icon that needs to be added to the app.

## Quick Setup Steps:

### Step 1: Save the Icon Image
1. Right-click on the slingshot icon image you have
2. Save it to your computer as `slingshot-icon.png`

### Step 2: Prepare Icon Files
You need to create these files in the `assets` folder:

#### Required Files:
- **icon.png** (1024x1024px) - Main app icon
- **adaptive-icon.png** (1024x1024px) - Android adaptive icon
- **splash.png** (1284x2778px) - Splash screen

### Step 3: Use Online Tool (Easiest Method)
1. Go to: https://www.appicon.co/ or https://easyappicon.com/
2. Upload your slingshot icon image
3. Download the generated icon pack
4. Extract and copy these files to your `assets` folder:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`

### Step 4: Manual Method (If you prefer)
Use any image editor (Photoshop, GIMP, Canva, etc.):

1. **For icon.png and adaptive-icon.png:**
   - Create a 1024x1024px canvas
   - Place your slingshot icon centered
   - Make sure the icon doesn't touch the edges (leave ~10% padding)
   - Save as PNG with transparency

2. **For splash.png:**
   - Create a 1284x2778px canvas
   - Fill background with orange (#FF6B35)
   - Place slingshot icon in the center
   - Save as PNG

### Step 5: Place Files
Copy all three files to: `C:\Users\ADMIN\Desktop\Skillsling\assets\`

### Step 6: Restart Expo
After adding the files, restart your Expo server:
```
Press Ctrl+C in the terminal
Run: npm start
```

## Current Configuration
Your app.json is already configured to use these icons:
- ✅ Main icon: ./assets/icon.png
- ✅ Adaptive icon: ./assets/adaptive-icon.png
- ✅ Splash screen: ./assets/splash.png

## Need Help?
If you need me to create a simple SVG version or help with anything else, just let me know!

---
**Note**: The slingshot icon (blue with orange ball) perfectly represents SkillSling - great choice!
