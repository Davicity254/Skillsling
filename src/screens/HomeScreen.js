import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import * as Location from 'expo-location';
import { useTheme } from '../config/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
    { id: 'salon', name: 'Salons', icon: 'cut' },
    { id: 'barber', name: 'Barbers', icon: 'man' },
    { id: 'shop', name: 'Shops', icon: 'storefront' },
    { id: 'plumber', name: 'Plumbers', icon: 'construct' },
    { id: 'electrician', name: 'Electricians', icon: 'flash' },
    { id: 'cleaner', name: 'Cleaners', icon: 'sparkles' },
    { id: 'other', name: 'Other', icon: 'apps' },
];

export default function HomeScreen({ navigation }) {
    const [services, setServices] = useState([]);
    const [location, setLocation] = useState(null);
    const { theme } = useTheme();

    useEffect(() => {
        getLocation();
        loadNearbyServices();
    }, []);

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({});
            setLocation(loc.coords);
        }
    };

    const loadNearbyServices = async () => {
        const db = getFirestore();
        const q = query(collection(db, 'services'));
        const snapshot = await getDocs(q);
        const servicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesData);
    };

    const renderCategory = ({ item }) => (
        <TouchableOpacity
            style={[styles.categoryCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('Search', { category: item.id })}
        >
            <Ionicons name={item.icon} size={30} color={theme.primary} style={{ marginBottom: 5 }} />
            <Text style={[styles.categoryName, { color: theme.textSecondary }]}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderService = ({ item }) => (
        <TouchableOpacity
            style={[styles.serviceCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate('ServiceDetail', { service: item })}
        >
            <Image source={{ uri: item.photos?.[0] }} style={[styles.serviceImage, { backgroundColor: theme.surface }]} />
            <View style={styles.serviceInfo}>
                <Text style={[styles.serviceName, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.serviceCategory, { color: theme.textSecondary }]}>{item.category}</Text>
                <Text style={[styles.servicePrice, { color: theme.primary }]}>${item.price}</Text>
                <Text style={[styles.serviceDistance, { color: theme.textSecondary }]}>📍 {item.distance || '2.5'} km away</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.header, { color: theme.text }]}>Browse Categories</Text>
            <FlatList
                data={CATEGORIES}
                renderItem={renderCategory}
                keyExtractor={item => item.id}
                numColumns={3}
                style={styles.categoryList}
            />

            <Text style={[styles.header, { color: theme.text }]}>Nearby Services</Text>
            <FlatList
                data={services}
                renderItem={renderService}
                keyExtractor={item => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 15,
    },
    categoryList: {
        marginBottom: 20,
    },
    categoryCard: {
        flex: 1,
        margin: 5,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    categoryIcon: {
        fontSize: 30,
        marginBottom: 5,
    },
    categoryName: {
        fontSize: 14,
    },
    serviceCard: {
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
    },
    serviceImage: {
        width: '100%',
        height: 150,
    },
    serviceInfo: {
        padding: 15,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    serviceCategory: {
        fontSize: 14,
        marginTop: 5,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
    serviceDistance: {
        fontSize: 14,
        marginTop: 5,
    },
});
