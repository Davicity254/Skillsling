import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';
import {
    requestCameraPermission,
    requestMediaLibraryPermission,
    checkCameraPermission,
    checkMediaLibraryPermission,
} from '../config/permissions';
import { logoutAllUsers } from '../utils/logoutAllUsers';
import { auth } from '../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

export default function SettingsScreen({ navigation }) {
    const { theme } = useTheme();
    const [permissions, setPermissions] = useState({
        camera: false,
        mediaLibrary: false,
    });

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        const camera = await checkCameraPermission();
        const mediaLibrary = await checkMediaLibraryPermission();
        setPermissions({ camera, mediaLibrary });
    };

    const handleCameraPermission = async () => {
        const granted = await requestCameraPermission();
        if (granted) {
            setPermissions({ ...permissions, camera: true });
            Alert.alert('Success', 'Camera permission granted!');
        }
    };

    const handleMediaLibraryPermission = async () => {
        const granted = await requestMediaLibraryPermission();
        if (granted) {
            setPermissions({ ...permissions, mediaLibrary: true });
            Alert.alert('Success', 'Media library permission granted!');
        }
    };

    const handleChangePassword = () => {
        Alert.prompt(
            'Change Password',
            'Enter your current password:',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Next',
                    onPress: (currentPassword) => {
                        if (!currentPassword || currentPassword.length < 6) {
                            Alert.alert('Error', 'Please enter your current password (at least 6 characters)');
                            return;
                        }

                        Alert.prompt(
                            'Change Password',
                            'Enter your new password:',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                },
                                {
                                    text: 'Change',
                                    onPress: async (newPassword) => {
                                        if (!newPassword || newPassword.length < 6) {
                                            Alert.alert('Error', 'New password must be at least 6 characters');
                                            return;
                                        }

                                        try {
                                            const user = auth.currentUser;
                                            if (!user || !user.email) {
                                                Alert.alert('Error', 'No user logged in');
                                                return;
                                            }

                                            // Re-authenticate user
                                            const credential = EmailAuthProvider.credential(
                                                user.email,
                                                currentPassword
                                            );
                                            await reauthenticateWithCredential(user, credential);

                                            // Update password
                                            await updatePassword(user, newPassword);

                                            Alert.alert(
                                                'Success',
                                                'Your password has been changed successfully!'
                                            );
                                        } catch (error) {
                                            console.log('Change password error:', error);
                                            let errorMessage = 'Failed to change password';

                                            if (error.code === 'auth/wrong-password') {
                                                errorMessage = 'Current password is incorrect';
                                            } else if (error.code === 'auth/weak-password') {
                                                errorMessage = 'New password is too weak';
                                            } else if (error.code === 'auth/requires-recent-login') {
                                                errorMessage = 'Please log out and log in again, then try changing your password';
                                            }

                                            Alert.alert('Error', errorMessage);
                                        }
                                    },
                                },
                            ],
                            'secure-text'
                        );
                    },
                },
            ],
            'secure-text'
        );
    };

    const handleLogoutAllUsers = () => {
        Alert.alert(
            'Logout All Users',
            'This will log out all users and clear all saved data. This action is irreversible. Continue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout All',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await logoutAllUsers();
                        if (result.success) {
                            Alert.alert(
                                'Success',
                                'All users have been logged out. Please close and restart the app.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // The app will automatically redirect to Welcome screen
                                        },
                                    },
                                ]
                            );
                        } else {
                            Alert.alert('Error', result.message);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Settings & Permissions</Text>
            </View>

            {/* Permissions Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>App Permissions</Text>
                <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Manage app permissions to enhance your experience
                </Text>

                {/* Camera Permission */}
                <TouchableOpacity
                    style={[styles.permissionCard, { backgroundColor: theme.surface }]}
                    onPress={handleCameraPermission}
                >
                    <View style={styles.permissionIcon}>
                        <Ionicons
                            name="camera"
                            size={32}
                            color={permissions.camera ? theme.success : theme.textSecondary}
                        />
                    </View>
                    <View style={styles.permissionInfo}>
                        <Text style={[styles.permissionTitle, { color: theme.text }]}>Camera</Text>
                        <Text style={[styles.permissionDescription, { color: theme.textSecondary }]}>
                            Take photos and videos for your profile
                        </Text>
                    </View>
                    <View style={styles.permissionStatus}>
                        {permissions.camera ? (
                            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
                        ) : (
                            <Ionicons name="close-circle" size={24} color={theme.error} />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Media Library Permission */}
                <TouchableOpacity
                    style={[styles.permissionCard, { backgroundColor: theme.surface }]}
                    onPress={handleMediaLibraryPermission}
                >
                    <View style={styles.permissionIcon}>
                        <Ionicons
                            name="images"
                            size={32}
                            color={permissions.mediaLibrary ? theme.success : theme.textSecondary}
                        />
                    </View>
                    <View style={styles.permissionInfo}>
                        <Text style={[styles.permissionTitle, { color: theme.text }]}>Photos & Videos</Text>
                        <Text style={[styles.permissionDescription, { color: theme.textSecondary }]}>
                            Upload images and videos from your gallery
                        </Text>
                    </View>
                    <View style={styles.permissionStatus}>
                        {permissions.mediaLibrary ? (
                            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
                        ) : (
                            <Ionicons name="close-circle" size={24} color={theme.error} />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Internet Access Info */}
                <View style={[styles.permissionCard, { backgroundColor: theme.surface }]}>
                    <View style={styles.permissionIcon}>
                        <Ionicons name="globe" size={32} color={theme.success} />
                    </View>
                    <View style={styles.permissionInfo}>
                        <Text style={[styles.permissionTitle, { color: theme.text }]}>Internet Access</Text>
                        <Text style={[styles.permissionDescription, { color: theme.textSecondary }]}>
                            Required for app functionality (Always enabled)
                        </Text>
                    </View>
                    <View style={styles.permissionStatus}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.success} />
                    </View>
                </View>
            </View>

            {/* Info Section */}
            <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
                <Ionicons name="information-circle" size={24} color={theme.primary} />
                <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Permissions help SkillSling provide you with the best experience. You can change these
                    settings anytime in your device settings.
                </Text>
            </View>

            {/* Account Security Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Security</Text>
                <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Manage your account security settings
                </Text>

                <TouchableOpacity
                    style={[styles.securityCard, { backgroundColor: theme.surface }]}
                    onPress={handleChangePassword}
                >
                    <Ionicons name="key" size={24} color={theme.primary} />
                    <View style={styles.legalInfo}>
                        <Text style={[styles.legalTitle, { color: theme.text }]}>Change Password</Text>
                        <Text style={[styles.legalDescription, { color: theme.textSecondary }]}>
                            Update your account password
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>

                <View style={[styles.infoCard, { backgroundColor: theme.surface, marginTop: 10 }]}>
                    <Ionicons name="information-circle" size={20} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Change your password anytime without needing email verification. You'll need your current password to confirm.
                    </Text>
                </View>
            </View>

            {/* Legal Documents Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal & Privacy</Text>

                <TouchableOpacity
                    style={[styles.legalCard, { backgroundColor: theme.surface }]}
                    onPress={() => navigation.navigate('PrivacyPolicy')}
                >
                    <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
                    <View style={styles.legalInfo}>
                        <Text style={[styles.legalTitle, { color: theme.text }]}>Privacy Policy</Text>
                        <Text style={[styles.legalDescription, { color: theme.textSecondary }]}>
                            Learn how we protect your data
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.legalCard, { backgroundColor: theme.surface }]}
                    onPress={() => navigation.navigate('TermsOfService')}
                >
                    <Ionicons name="document-text" size={24} color={theme.primary} />
                    <View style={styles.legalInfo}>
                        <Text style={[styles.legalTitle, { color: theme.text }]}>Terms of Service</Text>
                        <Text style={[styles.legalDescription, { color: theme.textSecondary }]}>
                            Read our terms and conditions
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {/* Refresh Button */}
            <TouchableOpacity
                style={[styles.refreshButton, { backgroundColor: theme.primary }]}
                onPress={loadPermissions}
            >
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh Permissions</Text>
            </TouchableOpacity>

            {/* Admin/Debug Section */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Admin Actions</Text>
                <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
                    Use these actions for testing and maintenance
                </Text>

                <TouchableOpacity
                    style={[styles.dangerButton, { backgroundColor: theme.error }]}
                    onPress={handleLogoutAllUsers}
                >
                    <Ionicons name="log-out" size={20} color="#fff" />
                    <Text style={styles.dangerButtonText}>Logout All Users</Text>
                </TouchableOpacity>

                <View style={[styles.warningBox, { backgroundColor: theme.surface, borderColor: theme.error }]}>
                    <Ionicons name="warning" size={20} color={theme.error} />
                    <Text style={[styles.warningText, { color: theme.textSecondary }]}>
                        This will log out all users and clear all saved data. Use this after making major changes to ensure everyone starts fresh.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    section: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 14,
        marginBottom: 20,
    },
    permissionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    permissionIcon: {
        marginRight: 15,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    permissionDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    permissionStatus: {
        marginLeft: 10,
    },
    infoCard: {
        flexDirection: 'row',
        padding: 15,
        margin: 15,
        borderRadius: 10,
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    legalCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap: 12,
    },
    legalInfo: {
        flex: 1,
    },
    legalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 3,
    },
    legalDescription: {
        fontSize: 13,
    },
    securityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        gap: 12,
    },
    dangerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        gap: 10,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    dangerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    warningBox: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        gap: 10,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 20,
    },
});
