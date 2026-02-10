import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useTheme } from '../config/ThemeContext';

export default function PaymentScreen({ route, navigation }) {
    const { amount, serviceId } = route.params || { amount: 0, serviceId: null };
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const { theme } = useTheme();

    const handlePayment = async () => {
        if (!cardNumber || !expiryDate || !cvv) {
            Alert.alert('Error', 'Please fill in all card details');
            return;
        }

        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Payment Successful!',
                `Your payment of $${amount} has been processed.`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        }, 2000);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Complete Payment</Text>
            <Text style={[styles.amount, { color: theme.primary }]}>${amount}</Text>

            <View style={styles.form}>
                <Text style={[styles.label, { color: theme.text }]}>Card Number</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="numeric"
                    maxLength={19}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: theme.text }]}>Expiry Date</Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                            placeholder="MM/YY"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            maxLength={5}
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                        />
                    </View>

                    <View style={styles.halfInput}>
                        <Text style={[styles.label, { color: theme.text }]}>CVV</Text>
                        <TextInput
                            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                            placeholder="123"
                            placeholderTextColor={theme.textSecondary}
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                            value={cvv}
                            onChangeText={setCvv}
                        />
                    </View>
                </View>
            </View>

            <View style={[styles.notice, { backgroundColor: theme.surface }]}>
                <Text style={[styles.noticeText, { color: theme.primary }]}>
                    💡 This is a demo payment screen. Stripe integration can be added later.
                </Text>
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary }, loading && styles.buttonDisabled]}
                onPress={handlePayment}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Processing...' : 'Pay Now'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    amount: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    notice: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
    },
    noticeText: {
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 15,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
    },
});
