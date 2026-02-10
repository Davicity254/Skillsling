import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '../config/ThemeContext';

export default function ServiceDetailScreen({ route, navigation }) {
    const { service } = route.params;
    const { theme } = useTheme();

    const handleLeaveReview = () => {
        navigation.navigate('Review', {
            providerId: service.providerId || 'demo',
            providerName: service.providerName || 'Service Provider',
            serviceId: service.id
        });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Image source={{ uri: service.photos?.[0] }} style={[styles.mainImage, { backgroundColor: theme.surface }]} />

            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>{service.title}</Text>
                <Text style={[styles.category, { color: theme.textSecondary }]}>{service.category}</Text>
                <Text style={[styles.price, { color: theme.primary }]}>${service.price}</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>{service.description}</Text>

                {service.externalLinks && (
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Portfolio Links</Text>
                        {service.externalLinks.map((link, index) => (
                            <TouchableOpacity key={index} onPress={() => Linking.openURL(link)}>
                                <Text style={[styles.link, { color: theme.primary }]}>🔗 {link}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.primary }]}>
                    <Text style={styles.contactText}>Contact Provider</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.reviewButton, { backgroundColor: theme.surface, borderColor: theme.primary }]}
                    onPress={handleLeaveReview}
                >
                    <Text style={[styles.reviewButtonText, { color: theme.primary }]}>Leave a Review</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    mainImage: { width: '100%', height: 300 },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold' },
    category: { fontSize: 16, marginTop: 5 },
    price: { fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    description: { fontSize: 16, marginTop: 15, lineHeight: 24 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    link: { fontSize: 16, marginBottom: 5 },
    contactButton: { padding: 15, borderRadius: 10, marginTop: 30, alignItems: 'center' },
    contactText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    reviewButton: { padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center', borderWidth: 2 },
    reviewButtonText: { fontSize: 18, fontWeight: 'bold' },
});
