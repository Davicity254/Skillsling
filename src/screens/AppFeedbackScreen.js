import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AppFeedbackScreen({ navigation }) {
    const { theme } = useTheme();
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [category, setCategory] = useState('general');
    const [submitting, setSubmitting] = useState(false);

    const categories = [
        { id: 'general', label: 'General Feedback', icon: 'chatbubbles' },
        { id: 'bug', label: 'Report a Bug', icon: 'bug' },
        { id: 'feature', label: 'Feature Request', icon: 'bulb' },
        { id: 'payment', label: 'Payment Issues', icon: 'card' },
        { id: 'ui', label: 'UI/UX Feedback', icon: 'color-palette' },
    ];

    const handleSubmitFeedback = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please rate the app');
            return;
        }

        if (!feedbackText.trim()) {
            Alert.alert('Error', 'Please write your feedback');
            return;
        }

        setSubmitting(true);

        try {
            const feedbackData = {
                userId: auth.currentUser.uid,
                userName: auth.currentUser.displayName || 'Anonymous',
                userEmail: auth.currentUser.email,
                rating,
                category,
                feedbackText: feedbackText.trim(),
                timestamp: new Date().toISOString(),
                status: 'pending',
                resolved: false
            };

            await addDoc(collection(db, 'appReviews'), feedbackData);

            Alert.alert(
                'Thank You!',
                'Your feedback has been submitted. We appreciate your input!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit feedback. Please try again.');
            console.error('Feedback submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="heart-circle" size={60} color={theme.primary} />
                    <Text style={[styles.title, { color: theme.text }]}>
                        We Value Your Feedback
                    </Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Help us improve SkillSling
                    </Text>
                </View>

                {/* Star Rating */}
                <View style={styles.ratingContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Rate Your Experience
                    </Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                style={styles.starButton}
                            >
                                <Ionicons
                                    name={star <= rating ? 'star' : 'star-outline'}
                                    size={40}
                                    color={star <= rating ? '#FFD700' : theme.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    {rating > 0 && (
                        <Text style={[styles.ratingText, { color: theme.primary }]}>
                            {rating} out of 5 stars
                        </Text>
                    )}
                </View>

                {/* Category Selection */}
                <View style={styles.categoryContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Feedback Category
                    </Text>
                    <View style={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.categoryButton,
                                    {
                                        backgroundColor: category === cat.id ? theme.primary : theme.surface,
                                        borderColor: theme.border
                                    }
                                ]}
                                onPress={() => setCategory(cat.id)}
                            >
                                <Ionicons
                                    name={cat.icon}
                                    size={24}
                                    color={category === cat.id ? '#fff' : theme.textSecondary}
                                />
                                <Text
                                    style={[
                                        styles.categoryText,
                                        { color: category === cat.id ? '#fff' : theme.text }
                                    ]}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Feedback Text */}
                <View style={styles.feedbackContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Your Feedback
                    </Text>
                    <TextInput
                        style={[styles.textInput, {
                            backgroundColor: theme.card,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        placeholder="Tell us what you think, report issues, or suggest improvements..."
                        placeholderTextColor={theme.textSecondary}
                        value={feedbackText}
                        onChangeText={setFeedbackText}
                        multiline
                        numberOfLines={8}
                        textAlignVertical="top"
                    />
                    <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                        {feedbackText.length} / 1000 characters
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.primary }]}
                    onPress={handleSubmitFeedback}
                    disabled={submitting}
                >
                    <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.submitButtonText}>
                        {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </Text>
                </TouchableOpacity>

                {/* Info Box */}
                <View style={[styles.infoBox, { backgroundColor: theme.surface }]}>
                    <Ionicons name="information-circle" size={24} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        Your feedback helps us improve SkillSling for everyone. We read every submission!
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
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
    },
    ratingContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
    },
    starButton: {
        padding: 5,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    categoryContainer: {
        marginBottom: 30,
    },
    categoriesGrid: {
        gap: 10,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        gap: 10,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    feedbackContainer: {
        marginBottom: 30,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        minHeight: 180,
        maxHeight: 250,
    },
    charCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 5,
    },
    submitButton: {
        flexDirection: 'row',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    infoBox: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        gap: 10,
        alignItems: 'center',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});
