import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export const requestCameraPermission = async () => {
    try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Camera Permission Required',
                'SkillSling needs camera access to take photos and videos. Please enable it in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
            return false;
        }
        return true;
    } catch (error) {
        console.log('Error requesting camera permission:', error);
        return false;
    }
};

export const requestMediaLibraryPermission = async () => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Media Library Permission Required',
                'SkillSling needs access to your photos and videos. Please enable it in your device settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() }
                ]
            );
            return false;
        }
        return true;
    } catch (error) {
        console.log('Error requesting media library permission:', error);
        return false;
    }
};

export const checkCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status === 'granted';
};

export const checkMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status === 'granted';
};
