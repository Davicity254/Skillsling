import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB_kjmt4CAn9tXEYK-aVkXuMVKFiZzWaeo",
    authDomain: "skillsling-254.firebaseapp.com",
    projectId: "skillsling-254",
    storageBucket: "skillsling-254.firebasestorage.app",
    messagingSenderId: "68712017057",
    appId: "1:68712017057:web:ebd47a4e794d4b851290a6"
};

// Initialize Firebase
let app;
let auth;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

// Initialize and export services
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
