import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../config/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Google Sign-In configuration (optional - requires Android Client ID setup)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '68712017057-ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
        iosClientId: '68712017057-IOS_CLIENT_ID_HERE.apps.googleusercontent.com',
        webClientId: '68712017057-rqinr7eha8vs5l4f02m51qmevvia893c.apps.googleusercontent.com',
    });

    useEffect(() => {
        loadSavedCredentials();
    }, []);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    Alert.alert('Success', 'Signed in with Google!');
                })
                .catch((error) => {
                    Alert.alert('Error', error.message);
                });
        }
    }, [response]);

    const loadSavedCredentials = async () => {
        try {
            const savedEmail = await AsyncStorage.getItem('savedEmail');
            const savedPassword = await AsyncStorage.getItem('savedPassword');
            const savedRememberMe = await AsyncStorage.getItem('rememberMe');

            if (savedRememberMe === 'true' && savedEmail && savedPassword) {
                setEmail(savedEmail);
                setPassword(savedPassword);
                setRememberMe(true);
            }
        } catch (error) {
            console.log('Error loading credentials:', error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);

            // Save credentials if remember me is checked
            if (rememberMe) {
                await AsyncStorage.setItem('savedEmail', email);
                await AsyncStorage.setItem('savedPassword', password);
                await AsyncStorage.setItem('rememberMe', 'true');

                // Set expiry date (30 days from now)
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                await AsyncStorage.setItem('rememberMeExpiry', expiryDate.toISOString());
            } else {
                await AsyncStorage.removeItem('savedEmail');
                await AsyncStorage.removeItem('savedPassword');
                await AsyncStorage.removeItem('rememberMe');
                await AsyncStorage.removeItem('rememberMeExpiry');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const handleGoogleSignIn = () => {
        promptAsync();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>

            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.rememberMeContainer}
                onPress={() => setRememberMe(!rememberMe)}
            >
                <View style={[styles.checkbox, { borderColor: theme.border }, rememberMe && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.rememberMeText, { color: theme.textSecondary }]}>Remember me for 30 days</Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => navigation.navigate('ForgotPassword')}
            >
                <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            {/* Google Sign-In - Commented out until Android Client ID is configured
            <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
                <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            <TouchableOpacity
                style={[styles.googleButton, { backgroundColor: theme.card, borderColor: theme.border }]}
                onPress={handleGoogleSignIn}
                disabled={!request}
            >
                <Text style={[styles.googleButtonText, { color: theme.text }]}>🔍 Sign in with Google</Text>
            </TouchableOpacity>
            */}

            <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={[styles.registerLinkText, { color: theme.textSecondary }]}>
                    Don't have an account? <Text style={[styles.registerLinkBold, { color: theme.primary }]}>Sign up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    rememberMeText: {
        fontSize: 14,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14,
    },
    googleButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    registerLinkText: {
        fontSize: 14,
    },
    registerLinkBold: {
        fontWeight: 'bold',
    },
    forgotPasswordLink: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
