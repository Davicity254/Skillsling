# Icon Setup Guide for SkillSling

## Current Issue
- Icon is not displaying clearly
- SVG format may not work well for all platforms
- Need PNG files in specific sizes

## Required Icon Sizes

### For Expo/React Native Apps:

1. **icon.png** - 1024x1024px (Main app icon)
2. **adaptive-icon.png** - 1024x1024px (Android adaptive icon)
3. **splash.png** - 1284x2778px (Splash screen)
4. **favicon.png** - 48x48px (Web favicon)

## Option 1: Use Online Icon Generator

### Step 1: Go to Icon Generator
Visit: https://www.appicon.co/ or https://easyappicon.com/

### Step 2: Upload Your Icon
- Upload your icon.svg or a high-quality PNG (at least 1024x1024px)
- Make sure it's square and has transparent background if needed

### Step 3: Generate Icons
- Select "iOS" and "Android"
- Download the generated icons

### Step 4: Place Icons in Assets Folder
```
assets/
  ├── icon.png (1024x1024)
  ├── adaptive-icon.png (1024x1024)
  ├── splash.png (1284x2778)
  └── favicon.png (48x48)
```

## Option 2: Use Expo's Icon Generator

### Step 1: Install Sharp (if not installed)
```bash
npm install -g sharp-cli
```

### Step 2: Convert SVG to PNG
```bash
# Convert to 1024x1024
npx sharp -i assets/icon.svg -o assets/icon.png resize 1024 1024

# Create adaptive icon
npx sharp -i assets/icon.svg -o assets/adaptive-icon.png resize 1024 1024
```

### Step 3: Create Splash Screen
You can use Figma, Canva, or Photoshop to create a splash screen:
- Size: 1284x2778px
- Background: #FF6B35 (SkillSling orange)
- Center your logo
- Export as PNG

## Option 3: Manual Creation

### Using Figma (Free):
1. Go to figma.com
2. Create new file
3. Create frame: 1024x1024px
4. Import your icon
5. Export as PNG at 1x, 2x, 3x

### Using Canva (Free):
1. Go to canva.com
2. Create custom size: 1024x1024px
3. Upload your icon
4. Download as PNG

## Quick Fix (Temporary)

If you want to quickly test without proper icons:

1. Create a simple colored square as placeholder:
   - Use any image editor
   - Create 1024x1024px image
   - Fill with #FF6B35 (orange)
   - Add white text "SS" in center
   - Save as icon.png

2. Copy it for other sizes:
   ```bash
   copy assets\icon.png assets\adaptive-icon.png
   copy assets\icon.png assets\splash.png
   ```

## After Creating Icons

Update app.json:
```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#FF6B35"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FF6B35"
      }
    }
  }
}
```

## Icon Design Tips

### For Best Results:
1. **Simple Design** - Icons should be recognizable at small sizes
2. **High Contrast** - Use contrasting colors
3. **No Text** - Avoid small text (hard to read)
4. **Square Format** - Design for square canvas
5. **Safe Area** - Keep important elements in center 80%
6. **Transparent Background** - For adaptive icons

### SkillSling Icon Suggestions:
- Use the "S" letter in a creative way
- Incorporate a tool/wrench symbol
- Use the orange (#FF6B35) as primary color
- Keep it simple and memorable

## Testing Your Icons

After adding icons:
1. Restart Expo server: `npx expo start --clear`
2. Reload app in Expo Go
3. Check if icon appears correctly
4. Test on both light and dark backgrounds

## Need Help?

If you have a design but need help converting it:
1. Share your icon design (PNG, JPG, or SVG)
2. I can help create the proper sizes
3. Or use the online tools mentioned above

## Current Status

Your app currently uses:
- ✅ icon.svg (exists)
- ❌ icon.png (missing - causing clarity issues)
- ❌ adaptive-icon.png (missing)
- ❌ splash.png (missing)

**Action Required**: Create PNG versions of your icon in the sizes listed above.
