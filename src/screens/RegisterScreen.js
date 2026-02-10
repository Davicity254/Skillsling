import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform, Modal } from 'react-native';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { COUNTRIES } from '../config/countries';
import { SERVICES_LIST, SERVICE_CATEGORIES } from '../config/services';
import { validateServiceName, ETHICAL_GUIDELINES } from '../config/prohibitedServices';
import { getStatesForCountry, hasStateData } from '../config/locations';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../config/ThemeContext';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }) {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneCode, setPhoneCode] = useState('+254'); // Default Kenya
    const [nationality, setNationality] = useState('KE');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [userType, setUserType] = useState('customer');
    const [selectedServices, setSelectedServices] = useState([]);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [customService, setCustomService] = useState('');
    const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);
    const [availableStates, setAvailableStates] = useState([]);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

    // Update available states when country changes
    useEffect(() => {
        const states = getStatesForCountry(nationality);
        setAvailableStates(states);
        setState(''); // Reset state when country changes

        // Update phone code when country changes
        const country = COUNTRIES.find(c => c.value === nationality);
        if (country && country.phoneCode) {
            setPhoneCode(country.phoneCode);
        }
    }, [nationality]);

    // Google Sign-In configuration (optional - requires Android Client ID setup)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '68712017057-ANDROID_CLIENT_ID_HERE.apps.googleusercontent.com',
        iosClientId: '68712017057-IOS_CLIENT_ID_HERE.apps.googleusercontent.com',
        webClientId: '68712017057-rqinr7eha8vs5l4f02m51qmevvia893c.apps.googleusercontent.com',
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    // Create user profile in Firestore
                    await setDoc(doc(db, 'users', user.uid), {
                        fullName: user.displayName || '',
                        email: user.email,
                        phone: '',
                        nationality: 'KE',
                        dateOfBirth: '',
                        userType: 'customer',
                        createdAt: new Date().toISOString(),
                    });
                    Alert.alert('Success', 'Account created with Google!');
                })
                .catch((error) => {
                    Alert.alert('Error', error.message);
                });
        }
    }, [response]);

    const formatDateOfBirth = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        if (cleaned.length >= 4) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
        }
        setDateOfBirth(formatted);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateAge = (dob, isProvider = false) => {
        const parts = dob.split('/');
        if (parts.length !== 3) return false;
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) {
            return false;
        }
        const birthDate = new Date(year, month - 1, day);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        let calculatedAge = age;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge = age - 1;
        }

        // Service providers must be 18+, customers must be 13+
        const minimumAge = isProvider ? 18 : 13;
        return calculatedAge >= minimumAge;
    };

    const handleRegister = async () => {
        if (!email || !password || !fullName || !phone || !dateOfBirth || !city) {
            Alert.alert('Error', 'Please fill all required fields (Name, Email, Phone, Date of Birth, City)');
            return;
        }
        if (!agreedToTerms || !agreedToPrivacy) {
            Alert.alert('Agreement Required', 'Please agree to the Terms of Service and Privacy Policy to continue');
            return;
        }
        if (userType === 'provider' && selectedServices.length === 0) {
            Alert.alert('Error', 'Please select at least one service you offer');
            return;
        }
        if (hasStateData(nationality) && !state) {
            Alert.alert('Error', 'Please select your state/county');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (!validateAge(dateOfBirth, userType === 'provider')) {
            const minAge = userType === 'provider' ? 18 : 13;
            Alert.alert('Age Requirement', `You must be at least ${minAge} years old to ${userType === 'provider' ? 'offer services' : 'register'}`);
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get country name from COUNTRIES array
            const countryObj = COUNTRIES.find(c => c.value === nationality);
            const countryName = countryObj ? countryObj.label : nationality;

            // Get state name from availableStates array
            const stateObj = availableStates.find(s => s.value === state);
            const stateName = stateObj ? stateObj.label : state;

            await setDoc(doc(db, 'users', user.uid), {
                fullName,
                email,
                phone: phoneCode + phone, // Store full phone number with country code
                phoneCode: phoneCode, // Store phone code separately for reference
                nationality,
                dateOfBirth,
                userType,
                services: selectedServices,
                location: {
                    country: countryName,
                    countryCode: nationality,
                    state: stateName,
                    stateCode: state,
                    city: city,
                    street: street || '',
                    zipCode: zipCode || '',
                    coordinates: null, // Will be added when GPS location is implemented
                },
                profilePicture: '',
                gallery: [],
                ratings: [],
                averageRating: 0,
                totalReviews: 0,
                createdAt: new Date().toISOString(),
            });
            Alert.alert('Success', 'Account created successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const toggleService = (service) => {
        if (selectedServices.find(s => s.id === service.id)) {
            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
        } else {
            setSelectedServices([...selectedServices, service]);
        }
    };

    const addCustomService = () => {
        if (!customService.trim()) {
            Alert.alert('Error', 'Please enter a service name');
            return;
        }

        // Validate against prohibited services
        const validation = validateServiceName(customService);
        if (!validation.isValid) {
            Alert.alert('Service Not Allowed', validation.reason + '\n\nPlease review our ethical guidelines.');
            return;
        }

        const newService = {
            id: `custom_${Date.now()}`,
            name: customService,
            category: 'CUSTOM',
            isCustom: true
        };
        setSelectedServices([...selectedServices, newService]);
        setCustomService('');
        setShowCustomServiceInput(false);
        Alert.alert('Success', 'Custom service added!');
    };

    const removeService = (serviceId) => {
        setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
    };

    const handleGoogleSignUp = () => {
        promptAsync();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.label, { color: theme.textSecondary }]}>I want to:</Text>
            <View style={styles.typeContainer}>
                <TouchableOpacity
                    style={[styles.typeButton, { borderColor: theme.border }, userType === 'customer' && { borderColor: theme.primary, backgroundColor: theme.primary }]}
                    onPress={() => setUserType('customer')}
                >
                    <Text style={[styles.typeText, { color: theme.textSecondary }, userType === 'customer' && styles.typeTextActive]}>
                        Find Services
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.typeButton, { borderColor: theme.border }, userType === 'provider' && { borderColor: theme.primary, backgroundColor: theme.primary }]}
                    onPress={() => setUserType('provider')}
                >
                    <Text style={[styles.typeText, { color: theme.textSecondary }, userType === 'provider' && styles.typeTextActive]}>
                        Offer Services
                    </Text>
                </TouchableOpacity>
            </View>

            {userType === 'provider' && (
                <View style={styles.servicesSection}>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Services You Offer *</Text>
                    <TouchableOpacity
                        style={[styles.selectServicesButton, { borderColor: theme.border, backgroundColor: theme.card }]}
                        onPress={() => setShowServiceModal(true)}
                    >
                        <Ionicons name="briefcase" size={20} color={theme.primary} />
                        <Text style={[styles.selectServicesText, { color: theme.text }]}>
                            {selectedServices.length > 0
                                ? `${selectedServices.length} service(s) selected`
                                : 'Select Services'}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                    {selectedServices.length > 0 && (
                        <View style={styles.selectedServicesContainer}>
                            {selectedServices.map((service) => (
                                <View key={service.id} style={[styles.serviceChip, { backgroundColor: theme.surface }]}>
                                    <Text style={[styles.serviceChipText, { color: theme.primary }]}>{service.name}</Text>
                                    <TouchableOpacity onPress={() => removeService(service.id)}>
                                        <Ionicons name="close-circle" size={20} color={theme.primary} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}

            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="Full Name (e.g., John Doe) *"
                placeholderTextColor={theme.textSecondary}
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="Email (e.g., john@example.com) *"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
            />

            {/* Phone Number with Country Code */}
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Phone Number *</Text>
            <View style={[styles.phoneInputContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <View style={[styles.phoneCodeBox, { borderRightColor: theme.border }]}>
                    <Text style={[styles.phoneCodeText, { color: theme.text }]}>{phoneCode}</Text>
                </View>
                <TextInput
                    style={[styles.phoneInput, { color: theme.text }]}
                    placeholder="712345678"
                    placeholderTextColor={theme.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
            </View>

            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Date of Birth (DD/MM/YYYY) *</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.textSecondary}
                value={dateOfBirth}
                onChangeText={formatDateOfBirth}
                keyboardType="numeric"
                maxLength={10}
            />
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Nationality *</Text>
            <View style={[styles.pickerContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
                <Picker
                    selectedValue={nationality}
                    onValueChange={(itemValue) => setNationality(itemValue)}
                    style={styles.picker}
                >
                    {COUNTRIES.map((country) => (
                        <Picker.Item key={country.value} label={country.label} value={country.value} />
                    ))}
                </Picker>
            </View>

            {/* State/County Dropdown - Dynamic based on selected country */}
            {availableStates.length > 0 && (
                <>
                    <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                        {hasStateData(nationality) ? 'State/County *' : 'Region'}
                    </Text>
                    <View style={[styles.pickerContainer, { borderColor: theme.border, backgroundColor: theme.card }]}>
                        <Picker
                            selectedValue={state}
                            onValueChange={(itemValue) => setState(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select..." value="" />
                            {availableStates.map((stateItem) => (
                                <Picker.Item key={stateItem.value} label={stateItem.label} value={stateItem.value} />
                            ))}
                        </Picker>
                    </View>
                </>
            )}

            {/* City */}
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>City *</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="e.g., Nairobi, New York, London"
                placeholderTextColor={theme.textSecondary}
                value={city}
                onChangeText={setCity}
            />

            {/* Street Address (Optional) */}
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Street Address (Optional)</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="e.g., 123 Main Street"
                placeholderTextColor={theme.textSecondary}
                value={street}
                onChangeText={setStreet}
            />

            {/* ZIP/Postal Code (Optional) */}
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>ZIP/Postal Code (Optional)</Text>
            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="e.g., 00100, 10001, SW1A 1AA"
                placeholderTextColor={theme.textSecondary}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="default"
            />

            <TextInput
                style={[styles.input, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                placeholder="Password *"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Agreement Checkboxes */}
            <View style={styles.agreementContainer}>
                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreedToTerms(!agreedToTerms)}
                >
                    <View style={[styles.checkbox, { borderColor: theme.border }]}>
                        {agreedToTerms && (
                            <Ionicons name="checkmark" size={18} color={theme.primary} />
                        )}
                    </View>
                    <Text style={[styles.checkboxText, { color: theme.text }]}>
                        I agree to the{' '}
                        <Text
                            style={[styles.linkText, { color: theme.primary }]}
                            onPress={() => navigation.navigate('TermsOfService')}
                        >
                            Terms of Service
                        </Text>
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.checkboxRow}
                    onPress={() => setAgreedToPrivacy(!agreedToPrivacy)}
                >
                    <View style={[styles.checkbox, { borderColor: theme.border }]}>
                        {agreedToPrivacy && (
                            <Ionicons name="checkmark" size={18} color={theme.primary} />
                        )}
                    </View>
                    <Text style={[styles.checkboxText, { color: theme.text }]}>
                        I agree to the{' '}
                        <Text
                            style={[styles.linkText, { color: theme.primary }]}
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                        >
                            Privacy Policy
                        </Text>
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.loginLinkText, { color: theme.textSecondary }]}>
                    Already have an account? <Text style={[styles.loginLinkBold, { color: theme.primary }]}>Sign in</Text>
                </Text>
            </TouchableOpacity>

            <Modal visible={showServiceModal} animationType="slide" onRequestClose={() => setShowServiceModal(false)}>
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Services</Text>
                        <TouchableOpacity onPress={() => setShowServiceModal(false)}>
                            <Ionicons name="close" size={28} color={theme.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalContent}>
                        {Object.entries(SERVICE_CATEGORIES).map(([key, category]) => {
                            const categoryServices = SERVICES_LIST.filter(s => s.category === key);
                            return (
                                <View key={key} style={styles.categorySection}>
                                    <Text style={[styles.categoryTitle, { color: theme.text }]}>{category}</Text>
                                    {categoryServices.map((service) => {
                                        const isSelected = selectedServices.find(s => s.id === service.id);
                                        return (
                                            <TouchableOpacity
                                                key={service.id}
                                                style={[styles.serviceOption, { borderColor: theme.border, backgroundColor: theme.card }, isSelected && { borderColor: theme.primary, backgroundColor: theme.surface }]}
                                                onPress={() => toggleService(service)}
                                            >
                                                <Text style={[styles.serviceOptionText, { color: theme.text }, isSelected && { color: theme.primary, fontWeight: '600' }]}>
                                                    {service.name}
                                                </Text>
                                                {isSelected && <Ionicons name="checkmark-circle" size={24} color={theme.primary} />}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}
                        <View style={styles.customServiceSection}>
                            <Text style={[styles.categoryTitle, { color: theme.text }]}>Can't find your service?</Text>
                            {!showCustomServiceInput ? (
                                <TouchableOpacity style={[styles.addCustomButton, { borderColor: theme.primary }]} onPress={() => setShowCustomServiceInput(true)}>
                                    <Ionicons name="add-circle" size={24} color={theme.primary} />
                                    <Text style={[styles.addCustomText, { color: theme.primary }]}>Add Custom Service</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.customInputContainer}>
                                    <TextInput
                                        style={[styles.customInput, { borderColor: theme.border, backgroundColor: theme.card, color: theme.text }]}
                                        placeholder="Enter service name"
                                        placeholderTextColor={theme.textSecondary}
                                        value={customService}
                                        onChangeText={setCustomService}
                                    />
                                    <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.primary }]} onPress={addCustomService}>
                                        <Text style={styles.addButtonText}>Add</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, { backgroundColor: theme.surface }]}
                                        onPress={() => {
                                            setShowCustomServiceInput(false);
                                            setCustomService('');
                                        }}
                                    >
                                        <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={[styles.doneButton, { backgroundColor: theme.primary }]} onPress={() => setShowServiceModal(false)}>
                        <Text style={styles.doneButtonText}>Done ({selectedServices.length} selected)</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
    label: { fontSize: 16, marginBottom: 10 },
    inputLabel: { fontSize: 14, marginBottom: 5, fontWeight: '500' },
    typeContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
    typeButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 2, alignItems: 'center' },
    typeText: { fontSize: 16 },
    typeTextActive: { color: '#fff', fontWeight: 'bold' },
    input: { borderWidth: 1, padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    pickerContainer: { borderWidth: 1, borderRadius: 10, marginBottom: 15, overflow: 'hidden' },
    picker: { height: Platform.OS === 'ios' ? 180 : 50 },
    button: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10, marginBottom: 20 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    loginLink: { marginBottom: 30, alignItems: 'center' },
    loginLinkText: { fontSize: 14 },
    loginLinkBold: { fontWeight: 'bold' },
    servicesSection: { marginBottom: 15 },
    selectServicesButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 15, borderRadius: 10, gap: 10 },
    selectServicesText: { flex: 1, fontSize: 16 },
    selectedServicesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
    serviceChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
    serviceChipText: { fontSize: 14, fontWeight: '600' },
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 50, borderBottomWidth: 1 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    modalContent: { flex: 1, padding: 15 },
    categorySection: { marginBottom: 20 },
    categoryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    serviceOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderWidth: 1, borderRadius: 10, marginBottom: 8 },
    serviceOptionText: { fontSize: 16 },
    customServiceSection: { marginTop: 10, marginBottom: 20 },
    addCustomButton: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderRadius: 10, borderStyle: 'dashed', gap: 10 },
    addCustomText: { fontSize: 16, fontWeight: '600' },
    customInputContainer: { flexDirection: 'row', gap: 10 },
    customInput: { flex: 1, borderWidth: 1, padding: 12, borderRadius: 10, fontSize: 16 },
    addButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, justifyContent: 'center' },
    addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cancelButton: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, justifyContent: 'center' },
    cancelButtonText: { fontSize: 16 },
    doneButton: { padding: 15, margin: 15, borderRadius: 10, alignItems: 'center' },
    doneButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    agreementContainer: { marginVertical: 15, gap: 12 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    checkbox: { width: 24, height: 24, borderWidth: 2, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
    checkboxText: { flex: 1, fontSize: 14, lineHeight: 20 },
    linkText: { fontWeight: '600', textDecorationLine: 'underline' },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    phoneCodeBox: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRightWidth: 1,
        justifyContent: 'center',
        minWidth: 80,
    },
    phoneCodeText: {
        fontSize: 16,
        fontWeight: '600',
    },
    phoneInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 15,
        fontSize: 16,
    },
});
