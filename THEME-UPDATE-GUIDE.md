# Theme Update Guide - Apply to All Screens

## ✅ Screens Already Themed:
1. ProfileScreen ✅
2. ChatAssistantScreen ✅

## 🔄 Screens Needing Theme:
1. HomeScreen
2. SearchScreen
3. ServiceDetailScreen
4. PaymentScreen
5. WelcomeScreen
6. LoginScreen
7. RegisterScreen

## 📝 How to Apply Theme to Each Screen:

### Step 1: Add Imports
```javascript
import { useTheme } from '../config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
```

### Step 2: Get Theme in Component
```javascript
export default function ScreenName() {
    const { theme } = useTheme();
    // ... rest of code
}
```

### Step 3: Apply Theme to Styles
Replace static colors with theme colors:

**Background:**
```javascript
// Before:
<View style={styles.container}>

// After:
<View style={[styles.container, { backgroundColor: theme.background }]}>
```

**Text:**
```javascript
// Before:
<Text style={styles.text}>Hello</Text>

// After:
<Text style={[styles.text, { color: theme.text }]}>Hello</Text>
```

**Cards/Surfaces:**
```javascript
// Before:
<View style={styles.card}>

// After:
<View style={[styles.card, { backgroundColor: theme.surface }]}>
```

**Borders:**
```javascript
// Before:
borderColor: '#ddd'

// After:
{ borderColor: theme.border }
```

**Primary Color (Buttons, etc):**
```javascript
// Before:
backgroundColor: '#FF6B35'

// After:
{ backgroundColor: theme.primary }
```

## 🎨 Theme Colors Available:

```javascript
theme.background      // Main background
theme.surface         // Cards, modals
theme.primary         // #FF6B35 (orange)
theme.secondary       // #4ECDC4 (teal)
theme.text            // Main text color
theme.textSecondary   // Secondary text
theme.border          // Border colors
theme.card            // Card backgrounds
theme.error           // Error messages
theme.success         // Success messages
```

## 📋 Quick Reference for Each Screen:

### HomeScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function HomeScreen() {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>Browse Categories</Text>
            <TouchableOpacity style={[styles.categoryCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.categoryName, { color: theme.text }]}>Category</Text>
            </TouchableOpacity>
        </View>
    );
}
```

### SearchScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function SearchScreen() {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TextInput
                style={[styles.searchInput, { 
                    backgroundColor: theme.surface,
                    color: theme.text,
                    borderColor: theme.border
                }]}
                placeholderTextColor={theme.textSecondary}
            />
        </View>
    );
}
```

### ServiceDetailScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function ServiceDetailScreen() {
    const { theme } = useTheme();
    
    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <Text style={[styles.title, { color: theme.text }]}>Service Name</Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
                    <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
```

### PaymentScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function PaymentScreen() {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Complete Payment</Text>
            <TextInput
                style={[styles.input, { 
                    borderColor: theme.border,
                    color: theme.text
                }]}
                placeholderTextColor={theme.textSecondary}
            />
        </View>
    );
}
```

### WelcomeScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function WelcomeScreen() {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome to SkillSling</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}
```

### LoginScreen:
```javascript
import { useTheme } from '../config/ThemeContext';

export default function LoginScreen() {
    const { theme } = useTheme();
    
    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
            <TextInput
                style={[styles.input, { 
                    borderColor: theme.border,
                    color: theme.text
                }]}
                placeholderTextColor={theme.textSecondary}
            />
        </View>
    );
}
```

### RegisterScreen:
Already has theme structure, just needs to apply it to all elements.

## 🚀 Testing Themes:

1. Open app
2. Go to Profile
3. Tap "Change Theme"
4. Select different themes
5. Navigate to each screen
6. Verify colors change

## ✨ Pro Tips:

1. **Always use theme colors** instead of hardcoded colors
2. **Test in all 4 themes** (Light, Dark, Blue, Green)
3. **Check text readability** in dark mode
4. **Use theme.textSecondary** for less important text
5. **Keep white text on buttons** (doesn't need theme)

---

**Once all screens are themed, the entire app will adapt to user's theme choice!**
