import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../config/ThemeContext';

export default function WelcomeScreen({ navigation }) {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
                <Text style={styles.logoEmoji}>🎯</Text>
            </View>
            <Text style={[styles.title, { color: theme.primary }]}>SkillSling</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Find Services. Offer Services.</Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={[styles.linkText, { color: theme.primary }]}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 60,
        borderRadius: 25,
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        marginTop: 10,
    },
    linkText: {
        fontSize: 16,
    },
});
