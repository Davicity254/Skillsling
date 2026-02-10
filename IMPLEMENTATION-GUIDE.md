# SkillSling - Implementation Guide for Remaining Features

## 📁 File Structure for New Features

```
src/
├── screens/
│   ├── PublicProfileScreen.js       (NEW - View other users)
│   ├── ChatListScreen.js            (NEW - List of conversations)
│   ├── ChatScreen.js                (NEW - Individual chat)
│   ├── BookingScreen.js             (NEW - Request service)
│   ├── RequestsScreen.js            (NEW - Manage requests)
│   ├── NotificationsScreen.js       (NEW - Notifications list)
│   └── SearchScreen.js              (UPDATE - Add functionality)
├── components/
│   ├── ServiceCard.js               (NEW - Display service in search)
│   ├── ProviderCard.js              (NEW - Display provider in search)
│   ├── ChatBubble.js                (NEW - Message bubble)
│   ├── RequestCard.js               (NEW - Display request)
│   └── NotificationItem.js          (NEW - Notification item)
├── utils/
│   ├── storage.js                   (NEW - Firebase Storage helpers)
│   ├── notifications.js             (NEW - Notification helpers)
│   └── distance.js                  (NEW - Calculate distances)
└── config/
    └── firebase.js                  (UPDATE - Add storage)
```

---

## 1. SEARCH FUNCTIONALITY

### Update SearchScreen.js

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function SearchScreen({ navigation }) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const searchProviders = async () => {
        if (!searchQuery && !selectedService && !selectedLocation) {
            return;
        }

        setLoading(true);
        try {
            let q = query(
                collection(db, 'users'),
                where('userType', '==', 'provider')
            );

            // Add service filter
            if (selectedService) {
                q = query(q, where('services', 'array-contains', selectedService));
            }

            // Add location filter
            if (selectedLocation) {
                q = query(q, where('location.city', '==', selectedLocation));
            }

            const querySnapshot = await getDocs(q);
            const providers = [];
            querySnapshot.forEach((doc) => {
                providers.push({ id: doc.id, ...doc.data() });
            });

            setResults(providers);
        } catch (error) {
            console.log('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderProvider = ({ item }) => (
        <TouchableOpacity
            style={[styles.providerCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
        >
            <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/80' }}
                style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
                <Text style={[styles.providerName, { color: theme.text }]}>
                    {item.fullName}
                </Text>
                <Text style={[styles.providerLocation, { color: theme.textSecondary }]}>
                    {item.location?.city}, {item.location?.country}
                </Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={[styles.rating, { color: theme.text }]}>
                        {item.averageRating || '0.0'} ({item.totalReviews || 0} reviews)
                    </Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Search Input */}
            <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                <Ionicons name="search" size={20} color={theme.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search services or providers..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchProviders}
                />
            </View>

            {/* Filters */}
            {/* Add service and location filters here */}

            {/* Search Button */}
            <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: theme.primary }]}
                onPress={searchProviders}
            >
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>

            {/* Results */}
            <FlatList
                data={results}
                renderItem={renderProvider}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search-outline" size={64} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            {loading ? 'Searching...' : 'No results found'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    searchInput: { flex: 1, fontSize: 16 },
    searchButton: {
        margin: 15,
        marginTop: 0,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    searchButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    resultsList: { padding: 15 },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        gap: 15,
    },
    providerImage: { width: 60, height: 60, borderRadius: 30 },
    providerInfo: { flex: 1 },
    providerName: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    providerLocation: { fontSize: 14, marginBottom: 4 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    rating: { fontSize: 14 },
    emptyState: { alignItems: 'center', padding: 40 },
    emptyText: { fontSize: 16, marginTop: 10 },
});
```

---

## 2. PUBLIC PROFILE VIEW

### Create PublicProfileScreen.js

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function PublicProfileScreen({ route, navigation }) {
    const { userId } = route.params;
    const { theme } = useTheme();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, [userId]);

    const loadUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserData({ id: userDoc.id, ...userDoc.data() });
            }
        } catch (error) {
            console.log('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCall = () => {
        if (userData?.phone) {
            Linking.openURL(`tel:${userData.phone}`);
        }
    };

    const handleMessage = () => {
        navigation.navigate('Chat', { userId: userData.id, userName: userData.fullName });
    };

    const handleRequestService = () => {
        navigation.navigate('Booking', { providerId: userData.id });
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Banner */}
            <Image
                source={{ uri: userData?.bannerImage || 'https://via.placeholder.com/800x300' }}
                style={styles.banner}
            />

            {/* Profile Info */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/120' }}
                    style={styles.avatar}
                />
                <Text style={[styles.name, { color: theme.text }]}>{userData?.fullName}</Text>
                <Text style={[styles.location, { color: theme.textSecondary }]}>
                    {userData?.location?.city}, {userData?.location?.country}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {userData?.gallery?.length || 0}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Posts</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {userData?.totalReviews || 0}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                </View>
                <View style={styles.statBox}>
                    <Ionicons name="star" size={18} color="#FFD700" />
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {userData?.averageRating || '0.0'}
                    </Text>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={handleRequestService}
                >
                    <Ionicons name="briefcase" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Request Service</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
                    onPress={handleMessage}
                >
                    <Ionicons name="chatbubble" size={20} color={theme.primary} />
                    <Text style={[styles.actionButtonText, { color: theme.primary }]}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
                    onPress={handleCall}
                >
                    <Ionicons name="call" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {/* Services */}
            {userData?.services && userData.services.length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Services</Text>
                    <View style={styles.servicesContainer}>
                        {userData.services.map((service) => (
                            <View
                                key={service.id}
                                style={[styles.serviceChip, { backgroundColor: theme.card }]}
                            >
                                <Text style={[styles.serviceText, { color: theme.text }]}>
                                    {service.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Gallery */}
            {/* Add gallery grid here similar to ProfileScreen */}

            {/* Reviews */}
            {/* Add reviews list here similar to ProfileScreen */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    banner: { width: '100%', height: 200 },
    profileSection: { alignItems: 'center', marginTop: -60, marginBottom: 20 },
    avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#fff' },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    location: { fontSize: 16, marginTop: 5 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 13, marginTop: 2 },
    actionButtons: { flexDirection: 'row', padding: 15, gap: 10 },
    actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, gap: 8 },
    iconButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
    actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    section: { margin: 15, padding: 20, borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    servicesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    serviceChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
    serviceText: { fontSize: 14 },
});
```

---

## 3. MESSAGING SYSTEM

### Create ChatListScreen.js

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function ChatListScreen({ navigation }) {
    const { theme } = useTheme();
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', auth.currentUser.uid),
            orderBy('lastMessageTime', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = [];
            snapshot.forEach((doc) => {
                chatList.push({ id: doc.id, ...doc.data() });
            });
            setChats(chatList);
        });

        return () => unsubscribe();
    }, []);

    const renderChat = ({ item }) => (
        <TouchableOpacity
            style={[styles.chatItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Chat', {
                chatId: item.id,
                userId: item.otherUserId,
                userName: item.otherUserName
            })}
        >
            <Image
                source={{ uri: item.otherUserPhoto || 'https://via.placeholder.com/50' }}
                style={styles.avatar}
            />
            <View style={styles.chatInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{item.otherUserName}</Text>
                <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            <View style={styles.chatMeta}>
                <Text style={[styles.time, { color: theme.textSecondary }]}>
                    {formatTime(item.lastMessageTime)}
                </Text>
                {item.unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.badgeText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={chats}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={64} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No messages yet
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const formatTime = (timestamp) => {
    // Format timestamp to readable time
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatItem: { flexDirection: 'row', padding: 15, gap: 12 },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    chatInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    lastMessage: { fontSize: 14 },
    chatMeta: { alignItems: 'flex-end' },
    time: { fontSize: 12, marginBottom: 4 },
    badge: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', padding: 40, marginTop: 100 },
    emptyText: { fontSize: 16, marginTop: 10 },
});
```

---

## 4. FIREBASE STORAGE SETUP

### Update src/config/firebase.js

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // ADD THIS

const firebaseConfig = {
    apiKey: "AIzaSyBxxx",
    authDomain: "skillsling-254.firebaseapp.com",
    projectId: "skillsling-254",
    storageBucket: "skillsling-254.appspot.com",
    messagingSenderId: "68712017057",
    appId: "1:68712017057:web:xxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ADD THIS
```

### Create src/utils/storage.js

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImage = async (uri, path) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export const uploadProfilePicture = async (uri, userId) => {
    const path = `profiles/${userId}/profile.jpg`;
    return await uploadImage(uri, path);
};

export const uploadBannerImage = async (uri, userId) => {
    const path = `profiles/${userId}/banner.jpg`;
    return await uploadImage(uri, path);
};

export const uploadGalleryImage = async (uri, userId, timestamp) => {
    const path = `gallery/${userId}/${timestamp}.jpg`;
    return await uploadImage(uri, path);
};
```

---

## 5. NAVIGATION SETUP

### Update App.js to add new screens

```javascript
// Add imports
import PublicProfileScreen from './src/screens/PublicProfileScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';
import BookingScreen from './src/screens/BookingScreen';
import RequestsScreen from './src/screens/RequestsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

// Add to Stack.Navigator
<Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
<Stack.Screen name="ChatList" component={ChatListScreen} />
<Stack.Screen name="Chat" component={ChatScreen} />
<Stack.Screen name="Booking" component={BookingScreen} />
<Stack.Screen name="Requests" component={RequestsScreen} />
<Stack.Screen name="Notifications" component={NotificationsScreen} />
```

---

## 6. FIRESTORE COLLECTIONS STRUCTURE

### Users Collection (existing)
```
users/{userId}
  - fullName
  - email
  - phone
  - profilePicture (URL)
  - bannerImage (URL)
  - services[]
  - location{}
  - gallery[]
  - averageRating
  - totalReviews
```

### Chats Collection (new)
```
chats/{chatId}
  - participants[] (array of user IDs)
  - lastMessage
  - lastMessageTime
  - createdAt
```

### Messages Collection (new)
```
messages/{messageId}
  - chatId
  - senderId
  - text
  - timestamp
  - read
```

### Requests Collection (new)
```
requests/{requestId}
  - customerId
  - providerId
  - serviceId
  - status (pending, accepted, rejected, completed)
  - message
  - createdAt
  - updatedAt
```

### Notifications Collection (new)
```
notifications/{notificationId}
  - userId
  - type (message, request, review, etc.)
  - title
  - body
  - read
  - createdAt
  - data{}
```

---

## 7. FIREBASE SECURITY RULES

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chats
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Requests
    match /requests/{requestId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.customerId || 
         request.auth.uid == resource.data.providerId);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.providerId;
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 8. TESTING CHECKLIST

- [ ] Test search with different filters
- [ ] Test viewing public profiles
- [ ] Test sending messages
- [ ] Test receiving messages
- [ ] Test service requests
- [ ] Test accepting/rejecting requests
- [ ] Test image uploads
- [ ] Test on multiple devices
- [ ] Test offline behavior
- [ ] Test error handling

---

## 9. DEPLOYMENT COMMANDS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure
eas build:configure

# Build for Android (Production)
eas build --platform android --profile production

# Build for Android (Preview/Testing)
eas build --platform android --profile preview

# Submit to Play Store
eas submit --platform android
```

---

## 10. USEFUL RESOURCES

- Expo Docs: https://docs.expo.dev
- Firebase Docs: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org
- Firestore Queries: https://firebase.google.com/docs/firestore/query-data/queries
- Firebase Storage: https://firebase.google.com/docs/storage

---

Good luck with implementation! 🚀
