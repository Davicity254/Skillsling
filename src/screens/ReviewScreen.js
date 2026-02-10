import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';
import { db, auth } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ReviewScreen({ route, navigation }) {
    const { providerId, providerName, serviceId } = route.params || {};
    const { theme } = useTheme();
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert('Error', 'Please select a rating');
            return;
        }

        if (!reviewText.trim()) {
            Alert.alert('Error', 'Please write a review');
            return;
        }

        setSubmitting(true);

        try {
            const reviewData = {
                providerId,
                providerName,
                serviceId: serviceId || null,
                reviewerId: auth.currentUser.uid,
                reviewerName: auth.currentUser.displayName || 'Anonymous',
                rating,
                reviewText: reviewText.trim(),
                timestamp: new Date().toISOString(),
                helpful: 0,
                reported: false
            };

            await addDoc(collection(db, 'serviceReviews'), reviewData);

            Alert.alert(
                'Success',
                'Your review has been submitted!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to submit review. Please try again.');
            console.error('Review submission error:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>
                    Rate {providerName || 'Service Provider'}
                </Text>

                {/* Star Rating */}
                <View style={styles.ratingContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Your Rating
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
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </Text>
                    )}
                </View>

                {/* Review Text */}
                <View style={styles.reviewContainer}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        Write Your Review
                    </Text>
                    <TextInput
                        style={[styles.textInput, {
                            backgroundColor: theme.card,
                            color: theme.text,
                            borderColor: theme.border
                        }]}
                        placeholder="Share your experience with this service provider..."
                        placeholderTextColor={theme.textSecondary}
                        value={reviewText}
                        onChangeText={setReviewText}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />
                    <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                        {reviewText.length} / 500 characters
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.primary }]}
                    onPress={handleSubmitReview}
                    disabled={submitting}
                >
                    <Text style={styles.submitButtonText}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </Text>
                </TouchableOpacity>

                {/* Guidelines */}
                <View style={[styles.guidelines, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.guidelinesTitle, { color: theme.text }]}>
                        Review Guidelines
                    </Text>
                    <Text style={[styles.guidelinesText, { color: theme.textSecondary }]}>
                        • Be honest and constructive{'\n'}
                        • Focus on your experience{'\n'}
                        • Avoid offensive language{'\n'}
                        • Don't include personal information{'\n'}
                        • Reviews are public and permanent
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    reviewContainer: {
        marginBottom: 30,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        minHeight: 150,
        maxHeight: 200,
    },
    charCount: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 5,
    },
    submitButton: {
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    guidelines: {
        padding: 15,
        borderRadius: 10,
    },
    guidelinesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    guidelinesText: {
        fontSize: 14,
        lineHeight: 22,
    },
});
