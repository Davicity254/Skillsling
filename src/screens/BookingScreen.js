import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function BookingScreen({ route, navigation }) {
    const { providerId, providerName } = route.params;
    const { theme } = useTheme();
    const [serviceDescription, setServiceDescription] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const submitRequest = async () => {
        if (!serviceDescription.trim()) {
            Alert.alert('Error', 'Please describe the service you need');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'requests'), {
                customerId: auth.currentUser.uid,
                providerId: providerId,
                providerName: providerName,
                serviceDescription: serviceDescription.trim(),
                preferredDate: preferredDate.trim(),
                preferredTime: preferredTime.trim(),
                additionalNotes: additionalNotes.trim(),
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            Alert.alert(
                'Request Sent!',
                'Your service request has been sent to the provider. They will respond soon.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            console.log('Error submitting request:', error);
            Alert.alert('Error', 'Failed to send request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
                <Ionicons name="briefcase" size={48} color={theme.primary} />
                <Text style={[styles.headerTitle, { color: theme.text }]}>Request Service</Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                    from {providerName}
                </Text>
            </View>

            <View style={styles.form}>
                {/* Service Description */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>Service Description *</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder="Describe the service you need..."
                        placeholderTextColor={theme.textSecondary}
                        value={serviceDescription}
                        onChangeText={setServiceDescription}
                        multiline
                        numberOfLines={4}
                        maxLength={500}
                    />
                    <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                        {serviceDescription.length}/500
                    </Text>
                </View>

                {/* Preferred Date */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>Preferred Date (Optional)</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="DD/MM/YYYY"
                            placeholderTextColor={theme.textSecondary}
                            value={preferredDate}
                            onChangeText={setPreferredDate}
                        />
                    </View>
                </View>

                {/* Preferred Time */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>Preferred Time (Optional)</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="time-outline" size={20} color={theme.textSecondary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="e.g., Morning, 2:00 PM"
                            placeholderTextColor={theme.textSecondary}
                            value={preferredTime}
                            onChangeText={setPreferredTime}
                        />
                    </View>
                </View>

                {/* Additional Notes */}
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.text }]}>Additional Notes (Optional)</Text>
                    <TextInput
                        style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                        placeholder="Any additional information..."
                        placeholderTextColor={theme.textSecondary}
                        value={additionalNotes}
                        onChangeText={setAdditionalNotes}
                        multiline
                        numberOfLines={3}
                        maxLength={300}
                    />
                </View>

                {/* Info Box */}
                <View style={[styles.infoBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <Ionicons name="information-circle" size={20} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        The provider will review your request and respond within 24 hours.
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.primary }]}
                    onPress={submitRequest}
                    disabled={loading}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Sending...' : 'Send Request'}
                    </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.border }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        alignItems: 'center',
        padding: 30,
        paddingTop: 50,
    },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 15 },
    headerSubtitle: { fontSize: 16, marginTop: 5 },
    form: { padding: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        gap: 10,
    },
    input: { flex: 1, fontSize: 16 },
    textArea: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    charCount: { fontSize: 12, marginTop: 5, textAlign: 'right' },
    infoBox: {
        flexDirection: 'row',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        gap: 10,
        marginBottom: 20,
    },
    infoText: { flex: 1, fontSize: 14, lineHeight: 20 },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        gap: 8,
        marginBottom: 10,
    },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cancelButton: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelButtonText: { fontSize: 16, fontWeight: '600' },
});
