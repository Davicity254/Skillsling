import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';
import { SERVICES_LIST, SERVICE_CATEGORIES } from '../config/services';
import { COUNTRIES } from '../config/countries';
import { getStatesForCountry } from '../config/locations';

export default function SearchScreen({ navigation }) {
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showServiceFilter, setShowServiceFilter] = useState(false);
    const [showLocationFilter, setShowLocationFilter] = useState(false);
    const [showStateFilter, setShowStateFilter] = useState(false);
    const [availableStates, setAvailableStates] = useState([]);

    const searchProviders = async () => {
        setLoading(true);
        try {
            const usersRef = collection(db, 'users');
            let q = query(usersRef, where('userType', '==', 'provider'));

            const querySnapshot = await getDocs(q);
            let providers = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                providers.push({ id: doc.id, ...data });
            });

            // Client-side filtering
            if (searchQuery) {
                providers = providers.filter(p =>
                    p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.services?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            }

            if (selectedService) {
                providers = providers.filter(p =>
                    p.services?.some(s => s.id === selectedService)
                );
            }

            if (selectedCountry) {
                providers = providers.filter(p =>
                    p.location?.countryCode === selectedCountry
                );
            }

            if (selectedState) {
                providers = providers.filter(p =>
                    p.location?.stateCode === selectedState
                );
            }

            if (selectedCity) {
                providers = providers.filter(p =>
                    p.location?.city?.toLowerCase() === selectedCity.toLowerCase()
                );
            }

            // Sort by rating
            providers.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

            setResults(providers);
        } catch (error) {
            console.log('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedService('');
        setSelectedCountry('');
        setSelectedState('');
        setSelectedCity('');
        setResults([]);
        setAvailableStates([]);
    };

    const renderProvider = ({ item }) => (
        <TouchableOpacity
            style={[styles.providerCard, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('PublicProfile', { userId: item.id })}
        >
            <Image
                source={{ uri: item.profilePicture || 'https://via.placeholder.com/80' }}
                style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
                <Text style={[styles.providerName, { color: theme.text }]}>
                    {item.fullName}
                </Text>
                {item.mainService && (
                    <Text style={[styles.providerService, { color: theme.primary }]}>
                        {item.mainService.name}
                    </Text>
                )}
                <Text style={[styles.providerLocation, { color: theme.textSecondary }]}>
                    {item.location?.city}, {item.location?.country}
                </Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={[styles.rating, { color: theme.text }]}>
                        {item.averageRating?.toFixed(1) || '0.0'} ({item.totalReviews || 0})
                    </Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Search Input */}
            <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                <Ionicons name="search" size={18} color={theme.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: theme.text }]}
                    placeholder="Search services or providers..."
                    placeholderTextColor={theme.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchProviders}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Buttons - Vertical Layout */}
            <View style={styles.filtersContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: selectedService ? theme.primary : theme.surface, borderColor: theme.border }]}
                    onPress={() => setShowServiceFilter(!showServiceFilter)}
                >
                    <Ionicons name="briefcase" size={16} color={selectedService ? '#fff' : theme.text} />
                    <Text style={[styles.filterButtonText, { color: selectedService ? '#fff' : theme.text }]}>
                        {selectedService ? SERVICES_LIST.find(s => s.id === selectedService)?.name : 'Filter by Service'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={selectedService ? '#fff' : theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: selectedCountry ? theme.primary : theme.surface, borderColor: theme.border }]}
                    onPress={() => setShowLocationFilter(!showLocationFilter)}
                >
                    <Ionicons name="location" size={16} color={selectedCountry ? '#fff' : theme.text} />
                    <Text style={[styles.filterButtonText, { color: selectedCountry ? '#fff' : theme.text }]}>
                        {selectedCountry ? COUNTRIES.find(c => c.value === selectedCountry)?.label : 'Filter by Location'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={selectedCountry ? '#fff' : theme.textSecondary} />
                </TouchableOpacity>

                {selectedCountry && availableStates.length > 0 && (
                    <TouchableOpacity
                        style={[styles.filterButton, { backgroundColor: selectedState ? theme.primary : theme.surface, borderColor: theme.border }]}
                        onPress={() => setShowStateFilter(!showStateFilter)}
                    >
                        <Ionicons name="map" size={16} color={selectedState ? '#fff' : theme.text} />
                        <Text style={[styles.filterButtonText, { color: selectedState ? '#fff' : theme.text }]}>
                            {selectedState ? availableStates.find(s => s.value === selectedState)?.label : 'Filter by State/County'}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color={selectedState ? '#fff' : theme.textSecondary} />
                    </TouchableOpacity>
                )}

                {(selectedService || selectedCountry || selectedState || selectedCity) && (
                    <TouchableOpacity
                        style={[styles.clearButton, { borderColor: theme.error }]}
                        onPress={clearFilters}
                    >
                        <Ionicons name="close-circle" size={16} color={theme.error} />
                        <Text style={[styles.clearButtonText, { color: theme.error }]}>Clear Filters</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Service Filter Modal */}
            {showServiceFilter && (
                <View style={[styles.filterModal, { backgroundColor: theme.surface }]}>
                    <ScrollView style={styles.filterList}>
                        {SERVICES_LIST.map((service) => (
                            <TouchableOpacity
                                key={service.id}
                                style={[styles.filterItem, { borderBottomColor: theme.border }]}
                                onPress={() => {
                                    setSelectedService(service.id);
                                    setShowServiceFilter(false);
                                }}
                            >
                                <Text style={[styles.filterItemText, { color: theme.text }]}>
                                    {service.name}
                                </Text>
                                {selectedService === service.id && (
                                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Location Filter Modal */}
            {showLocationFilter && (
                <View style={[styles.filterModal, { backgroundColor: theme.surface }]}>
                    <ScrollView style={styles.filterList}>
                        {COUNTRIES.map((country) => (
                            <TouchableOpacity
                                key={country.value}
                                style={[styles.filterItem, { borderBottomColor: theme.border }]}
                                onPress={() => {
                                    setSelectedCountry(country.value);
                                    setSelectedState(''); // Reset state when country changes
                                    setShowLocationFilter(false);
                                    // Load states for selected country
                                    const states = getStatesForCountry(country.value);
                                    setAvailableStates(states);
                                }}
                            >
                                <Text style={[styles.filterItemText, { color: theme.text }]}>
                                    {country.label}
                                </Text>
                                {selectedCountry === country.value && (
                                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* State/County Filter Modal */}
            {showStateFilter && (
                <View style={[styles.filterModal, { backgroundColor: theme.surface }]}>
                    <ScrollView style={styles.filterList}>
                        {availableStates.map((state) => (
                            <TouchableOpacity
                                key={state.value}
                                style={[styles.filterItem, { borderBottomColor: theme.border }]}
                                onPress={() => {
                                    setSelectedState(state.value);
                                    setShowStateFilter(false);
                                }}
                            >
                                <Text style={[styles.filterItemText, { color: theme.text }]}>
                                    {state.label}
                                </Text>
                                {selectedState === state.value && (
                                    <Ionicons name="checkmark" size={20} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Search Button */}
            <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: theme.primary }]}
                onPress={searchProviders}
                disabled={loading}
            >
                <Ionicons name="search" size={18} color="#fff" />
                <Text style={styles.searchButtonText}>
                    {loading ? 'Searching...' : 'Search'}
                </Text>
            </TouchableOpacity>

            {/* Results */}
            <FlatList
                data={results}
                renderItem={renderProvider}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.resultsList}
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={64} color={theme.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                {results.length === 0 && (searchQuery || selectedService || selectedCountry)
                                    ? 'No providers found'
                                    : 'Search for services or providers'}
                            </Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        marginTop: 15,
        padding: 12,
        borderRadius: 10,
        gap: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchInput: { flex: 1, fontSize: 15 },
    filtersContainer: {
        paddingHorizontal: 10,
        marginBottom: 8,
        gap: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
    },
    filterButtonText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500'
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    clearButtonText: {
        fontSize: 13,
        fontWeight: '600'
    },
    filterModal: {
        position: 'absolute',
        top: 180,
        left: 10,
        right: 10,
        maxHeight: 300,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
    },
    filterList: { padding: 8 },
    filterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
    },
    filterItemText: { fontSize: 15 },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
        marginBottom: 8,
        padding: 12,
        borderRadius: 10,
        gap: 6,
    },
    searchButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
    resultsList: { padding: 10 },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        gap: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    providerImage: { width: 55, height: 55, borderRadius: 27.5 },
    providerInfo: { flex: 1 },
    providerName: { fontSize: 15, fontWeight: 'bold', marginBottom: 2 },
    providerService: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
    providerLocation: { fontSize: 13, marginBottom: 3 },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rating: { fontSize: 13 },
    emptyState: { alignItems: 'center', padding: 40, marginTop: 50 },
    emptyText: { fontSize: 15, marginTop: 10, textAlign: 'center' },
});
