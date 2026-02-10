import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

/**
 * Logs out all users by:
 * 1. Signing out from Firebase
 * 2. Clearing all AsyncStorage data
 * 3. Forcing app restart
 */
export const logoutAllUsers = async () => {
    try {
        console.log('Starting logout process...');

        // 1. Sign out from Firebase
        if (auth.currentUser) {
            await signOut(auth);
            console.log('Signed out from Firebase');
        }

        // 2. Clear all AsyncStorage data
        await AsyncStorage.clear();
        console.log('Cleared AsyncStorage');

        // 3. Remove specific keys (redundant but ensures cleanup)
        const keysToRemove = [
            'savedEmail',
            'savedPassword',
            'rememberMe',
            'rememberMeExpiry',
            'selectedTheme',
            'userProfile',
            'lastSync',
        ];

        await AsyncStorage.multiRemove(keysToRemove);
        console.log('Removed specific keys');

        console.log('✅ All users logged out successfully!');
        console.log('Please restart the app to see changes.');

        return {
            success: true,
            message: 'All users logged out successfully. Please restart the app.',
        };
    } catch (error) {
        console.error('Error logging out all users:', error);
        return {
            success: false,
            message: 'Failed to logout all users',
            error: error.message,
        };
    }
};

/**
 * Check if user session is expired
 */
export const checkSessionExpiry = async () => {
    try {
        const rememberMe = await AsyncStorage.getItem('rememberMe');
        const expiryDate = await AsyncStorage.getItem('rememberMeExpiry');

        if (rememberMe === 'true' && expiryDate) {
            const expiry = new Date(expiryDate);
            const now = new Date();

            if (now > expiry) {
                // Session expired, clear credentials
                await AsyncStorage.multiRemove([
                    'savedEmail',
                    'savedPassword',
                    'rememberMe',
                    'rememberMeExpiry',
                ]);
                console.log('Session expired, credentials cleared');
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error checking session expiry:', error);
        return false;
    }
};
