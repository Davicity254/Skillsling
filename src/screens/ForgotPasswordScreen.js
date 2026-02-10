import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { sendPasswordResetEmail, updatePassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function ForgotPasswordScreen({ navigation }) {
    const { theme } = useTheme();
    const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'phone'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState(''); // Store generated code
    const [userEmail, setUserEmail] = useState(''); // Store user email for phone reset

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        // Remove spaces and dashes
        const cleaned = phone.replace(/[\s-]/g, '');
        // Check if it's a valid phone number (10-15 digits, optionally starting with +)
        const phoneRegex = /^\+?[1-9]\d{9,14}$/;
        return phoneRegex.test(cleaned);
    };

    const generateVerificationCode = () => {
        // Generate 6-digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const handleEmailReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            console.log('Attempting to send password reset email to:', email);
            await sendPasswordResetEmail(auth, email);
            console.log('Password reset email sent successfully');
            Alert.alert(
                'Password Reset Email Sent! ✅',
                '📧 Check your inbox\n' +
                '🗑️ Check spam/junk folder (emails often go here)\n' +
                '⏱️ May take 2-5 minutes to arrive\n\n' +
                'Tip: Mark the email as "Not Spam" to receive future emails in your inbox.\n\n' +
                'Didn\'t receive it? Wait a few minutes and try again.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        } catch (error) {
            console.log('Password reset error:', error);
            console.log('Error code:', error.code);
            console.log('Error message:', error.message);

            let errorMessage = 'Failed to send reset email. Please try again.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email address. Please check the email and try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address format.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many attempts. Please try again later.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your internet connection.';
            } else {
                errorMessage = `Error: ${error.message}`;
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneReset = async () => {
        if (!phone) {
            Alert.alert('Error', 'Please enter your phone number');
            return;
        }

        if (!validatePhone(phone)) {
            Alert.alert('Error', 'Please enter a valid phone number (e.g., +254712345678)');
            return;
        }

        setLoading(true);

        try {
            // Find user by phone number
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('phone', '==', phone));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                Alert.alert('Error', 'No account found with this phone number');
                setLoading(false);
                return;
            }

            // Get user email
            const userData = querySnapshot.docs[0].data();
            setUserEmail(userData.email);

            // Generate verification code
            const code = generateVerificationCode();
            setGeneratedCode(code);

            // In production, you would send this via Twilio/WhatsApp API
            // For now, we'll show it in an alert (DEMO MODE)
            Alert.alert(
                'Verification Code',
                `Your verification code is: ${code}\n\n` +
                `In production, this would be sent to your WhatsApp: ${phone}\n\n` +
                `DEMO MODE: Use this code to reset your password.`,
                [{ text: 'OK' }]
            );

            setCodeSent(true);
            setLoading(false);

            // TODO: In production, replace this with actual Twilio/WhatsApp API call:
            // await sendWhatsAppCode(phone, code);

        } catch (error) {
            console.log('Phone reset error:', error);
            Alert.alert('Error', 'Failed to send verification code. Please try again.');
            setLoading(false);
        }
    };

    const handleVerifyCodeAndReset = async () => {
        if (!verificationCode) {
            Alert.alert('Error', 'Please enter the verification code');
            return;
        }

        if (verificationCode !== generatedCode) {
            Alert.alert('Error', 'Invalid verification code. Please try again.');
            return;
        }

        if (!newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please enter and confirm your new password');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // In a real implementation, you would:
            // 1. Verify the code with your backend
            // 2. Use Firebase Admin SDK to update the password
            // 
            // For demo purposes, we'll show a success message
            Alert.alert(
                'Success',
                'Password reset successful!\n\n' +
                'In production, your password would be updated in Firebase.\n\n' +
                'For now, please use the email reset method or contact support.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );

            // TODO: In production, implement backend password update:
            // await updatePasswordViaBackend(userEmail, newPassword);

        } catch (error) {
            console.log('Password update error:', error);
            Alert.alert('Error', 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendCode = () => {
        if (resetMethod === 'email') {
            handleEmailReset();
        } else {
            if (!codeSent) {
                handlePhoneReset();
            } else {
                handleVerifyCodeAndReset();
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: theme.surface }]}>
                    <Ionicons name="lock-closed" size={60} color={theme.primary} />
                </View>

                {/* Title */}
                <Text style={[styles.title, { color: theme.text }]}>Forgot Password?</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Choose how you'd like to reset your password
                </Text>

                {/* Reset Method Selection */}
                <View style={styles.methodContainer}>
                    <TouchableOpacity
                        style={[
                            styles.methodButton,
                            {
                                backgroundColor: resetMethod === 'email' ? theme.primary : theme.surface,
                                borderColor: theme.border
                            }
                        ]}
                        onPress={() => {
                            setResetMethod('email');
                            setCodeSent(false);
                        }}
                    >
                        <Ionicons
                            name="mail"
                            size={24}
                            color={resetMethod === 'email' ? '#fff' : theme.text}
                        />
                        <Text style={[
                            styles.methodText,
                            { color: resetMethod === 'email' ? '#fff' : theme.text }
                        ]}>
                            Email
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.methodButton,
                            {
                                backgroundColor: resetMethod === 'phone' ? theme.primary : theme.surface,
                                borderColor: theme.border
                            }
                        ]}
                        onPress={() => {
                            setResetMethod('phone');
                            setCodeSent(false);
                        }}
                    >
                        <Ionicons
                            name="logo-whatsapp"
                            size={24}
                            color={resetMethod === 'phone' ? '#fff' : theme.text}
                        />
                        <Text style={[
                            styles.methodText,
                            { color: resetMethod === 'phone' ? '#fff' : theme.text }
                        ]}>
                            WhatsApp
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Email Reset Form */}
                {resetMethod === 'email' && (
                    <View style={styles.formContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Email Address</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="mail" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={theme.textSecondary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="information-circle" size={20} color={theme.primary} />
                            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                                We'll send you an email with a link to reset your password. The link expires in 1 hour.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Phone Reset Form */}
                {resetMethod === 'phone' && !codeSent && (
                    <View style={styles.formContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="call" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="+254712345678"
                                placeholderTextColor={theme.textSecondary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={[styles.infoBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                                We'll send a 6-digit verification code to your WhatsApp. Enter the code to reset your password.
                            </Text>
                        </View>

                        <View style={[styles.demoBox, { backgroundColor: '#FFF3CD', borderColor: '#FFC107' }]}>
                            <Ionicons name="warning" size={20} color="#856404" />
                            <Text style={[styles.demoText, { color: '#856404' }]}>
                                DEMO MODE: The code will be shown in an alert. In production, it will be sent to WhatsApp.
                            </Text>
                        </View>
                    </View>
                )}

                {/* Code Verification Form */}
                {resetMethod === 'phone' && codeSent && (
                    <View style={styles.formContainer}>
                        <Text style={[styles.label, { color: theme.text }]}>Verification Code</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="keypad" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor={theme.textSecondary}
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <Text style={[styles.label, { color: theme.text, marginTop: 15 }]}>New Password</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="lock-closed" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Enter new password"
                                placeholderTextColor={theme.textSecondary}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry
                            />
                        </View>

                        <Text style={[styles.label, { color: theme.text, marginTop: 15 }]}>Confirm Password</Text>
                        <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="lock-closed" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Confirm new password"
                                placeholderTextColor={theme.textSecondary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.resendLink}
                            onPress={() => {
                                setCodeSent(false);
                                setVerificationCode('');
                            }}
                        >
                            <Text style={[styles.resendText, { color: theme.primary }]}>
                                Didn't receive code? Send again
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Button */}
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={handleSendCode}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <>
                            <Ionicons
                                name={resetMethod === 'email' ? 'send' : (codeSent ? 'checkmark-circle' : 'logo-whatsapp')}
                                size={20}
                                color="#fff"
                            />
                            <Text style={styles.actionButtonText}>
                                {resetMethod === 'email'
                                    ? 'Send Reset Link'
                                    : (codeSent ? 'Reset Password' : 'Send Code')}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                {/* Back to Login */}
                <TouchableOpacity
                    style={styles.backToLogin}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back-circle" size={20} color={theme.primary} />
                    <Text style={[styles.backToLoginText, { color: theme.primary }]}>
                        Back to Login
                    </Text>
                </TouchableOpacity>

                {/* Help Section */}
                <View style={styles.helpSection}>
                    <Text style={[styles.helpTitle, { color: theme.text }]}>Need help?</Text>
                    <View style={styles.helpList}>
                        <Text style={[styles.helpItem, { color: theme.textSecondary }]}>
                            • Make sure you entered the correct {resetMethod === 'email' ? 'email' : 'phone number'}
                        </Text>
                        <Text style={[styles.helpItem, { color: theme.textSecondary }]}>
                            • Check your spam folder (email) or WhatsApp messages
                        </Text>
                        <Text style={[styles.helpItem, { color: theme.textSecondary }]}>
                            • Try again in a few minutes if it doesn't arrive
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 34,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    methodContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    methodButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
    methodText: {
        fontSize: 16,
        fontWeight: '600',
    },
    formContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
        marginBottom: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
    },
    demoBox: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
    },
    demoText: {
        flex: 1,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '500',
    },
    resendLink: {
        alignItems: 'center',
        marginTop: 10,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '600',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
        gap: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    backToLogin: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        gap: 8,
    },
    backToLoginText: {
        fontSize: 15,
        fontWeight: '600',
    },
    helpSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    helpTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 10,
    },
    helpList: {
        marginLeft: 5,
    },
    helpItem: {
        fontSize: 13,
        lineHeight: 22,
    },
});
