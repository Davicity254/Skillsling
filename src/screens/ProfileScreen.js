import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, FlatList, Modal, TextInput, Dimensions } from 'react-native';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';
import { SERVICES_LIST, SERVICE_CATEGORIES } from '../config/services';
import { COUNTRIES } from '../config/countries';
import { getStatesForCountry } from '../config/locations';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 6) / 3; // 3 columns with 2px gaps

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userType, setUserType] = useState('customer');
    const [gallery, setGallery] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [customService, setCustomService] = useState('');
    const [showCustomServiceInput, setShowCustomServiceInput] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPostIndex, setSelectedPostIndex] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [showFullScreenViewer, setShowFullScreenViewer] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState('grid'); // grid, reels, reviews
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [bannerImage, setBannerImage] = useState(null);
    const [mainService, setMainService] = useState(null);
    const [showMainServiceModal, setShowMainServiceModal] = useState(false);
    const [servicesExpanded, setServicesExpanded] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        fullName: '',
        phone: '',
        nationality: '',
        dateOfBirth: '',
        state: '',
        street: '',
        zipCode: '',
    });
    const [availableStates, setAvailableStates] = useState([]);
    const { theme, currentTheme, changeTheme } = useTheme();

    // Video player for full-screen viewer
    const currentItem = gallery[currentImageIndex];
    const videoPlayer = useVideoPlayer(
        currentItem?.type === 'video' ? currentItem.uri : '',
        (player) => {
            if (currentItem?.type === 'video') {
                player.loop = false;
                player.play();
            }
        }
    );

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setUserData(data);
                setUserType(data.userType || 'customer');
                setGallery(data.gallery || []);
                setSelectedServices(data.services || []);
                setBannerImage(data.bannerImage || null);
                setMainService(data.mainService || null);

                // Set edited profile data
                setEditedProfile({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    nationality: data.nationality || '',
                    dateOfBirth: data.dateOfBirth || '',
                    state: data.state || '',
                    street: data.street || '',
                    zipCode: data.zipCode || '',
                });

                // Load available states for current country
                const states = getStatesForCountry(data.nationality || '');
                setAvailableStates(states);

                // Load reviews for this provider
                if (data.userType === 'provider') {
                    await loadReviews();
                }
            }
        } catch (error) {
            console.log('Error loading user data:', error);
        }
    };

    const loadReviews = async () => {
        try {
            const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
            const reviewsQuery = query(
                collection(db, 'serviceReviews'),
                where('providerId', '==', auth.currentUser.uid),
                orderBy('timestamp', 'desc')
            );
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewsData = reviewsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);

            // Calculate average rating
            if (reviewsData.length > 0) {
                const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                setAverageRating((totalRating / reviewsData.length).toFixed(1));
            }
        } catch (error) {
            console.log('Error loading reviews:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: () => auth.signOut() }
            ]
        );
    };

    const switchMode = async () => {
        const newType = userType === 'customer' ? 'provider' : 'customer';
        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), { userType: newType }, { merge: true });
            setUserType(newType);
            Alert.alert('Success', `Switched to ${newType} mode`);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const pickProfilePicture = async () => {
        const options = [
            {
                text: 'View Profile Picture',
                onPress: () => viewProfilePicture()
            },
            {
                text: 'Take Photo',
                onPress: () => takeProfilePhoto()
            },
            {
                text: 'Choose from Gallery',
                onPress: () => chooseProfileFromGallery()
            },
            {
                text: 'Cancel',
                style: 'cancel'
            }
        ];

        Alert.alert('Profile Picture', 'Choose an option', options);
    };

    const viewProfilePicture = () => {
        if (userData?.profilePicture) {
            setSelectedImage({ uri: userData.profilePicture });
        } else {
            Alert.alert('No Profile Picture', 'You haven\'t set a profile picture yet.');
        }
    };

    const pickBannerImage = async () => {
        Alert.alert(
            'Banner Image',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => takeBannerPhoto()
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => chooseBannerFromGallery()
                },
                {
                    text: 'Remove Banner',
                    onPress: () => removeBanner(),
                    style: 'destructive'
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const takeBannerPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    bannerImage: result.assets[0].uri
                }, { merge: true });
                setBannerImage(result.assets[0].uri);
                Alert.alert('Success', 'Banner updated!');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const chooseBannerFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant gallery permissions');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    bannerImage: result.assets[0].uri
                }, { merge: true });
                setBannerImage(result.assets[0].uri);
                Alert.alert('Success', 'Banner updated!');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const removeBanner = async () => {
        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                bannerImage: null
            }, { merge: true });
            setBannerImage(null);
            Alert.alert('Success', 'Banner removed!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const takeProfilePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    profilePicture: result.assets[0].uri
                }, { merge: true });
                setUserData({ ...userData, profilePicture: result.assets[0].uri });
                Alert.alert('Success', 'Profile picture updated!');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const chooseProfileFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant gallery permissions');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            try {
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    profilePicture: result.assets[0].uri
                }, { merge: true });
                setUserData({ ...userData, profilePicture: result.assets[0].uri });
                Alert.alert('Success', 'Profile picture updated!');
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        }
    };

    const pickGalleryImages = async () => {
        Alert.alert(
            'Add Photos/Videos',
            'Choose an option',
            [
                {
                    text: 'Take Photo/Video',
                    onPress: () => takeGalleryPhoto()
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => chooseFromGallery()
                },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ]
        );
    };

    const takeGalleryPhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera permissions');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled) {
            try {
                const newItems = result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.type || 'image',
                    width: asset.width,
                    height: asset.height,
                    duration: asset.duration || null,
                    timestamp: new Date().toISOString(),
                    likes: [],
                    likesCount: 0,
                    comments: [],
                    commentsCount: 0
                }));

                const updatedGallery = [...gallery, ...newItems];
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    gallery: updatedGallery
                }, { merge: true });

                setGallery(updatedGallery);
                Alert.alert('Success', `${newItems.length} item(s) added to gallery!`);
            } catch (error) {
                Alert.alert('Error', error.message);
                console.error('Gallery upload error:', error);
            }
        }
    };

    const chooseFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant gallery permissions');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 0.8,
            videoMaxDuration: 60,
        });

        if (!result.canceled) {
            try {
                const newItems = result.assets.map(asset => ({
                    uri: asset.uri,
                    type: asset.type || 'image',
                    width: asset.width,
                    height: asset.height,
                    duration: asset.duration || null,
                    timestamp: new Date().toISOString(),
                    likes: [],
                    likesCount: 0,
                    comments: [],
                    commentsCount: 0
                }));

                const updatedGallery = [...gallery, ...newItems];
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    gallery: updatedGallery
                }, { merge: true });

                setGallery(updatedGallery);
                Alert.alert('Success', `${newItems.length} item(s) added to gallery!`);
            } catch (error) {
                Alert.alert('Error', error.message);
                console.error('Gallery upload error:', error);
            }
        }
    };

    const deleteGalleryItem = async (index) => {
        Alert.alert(
            'Delete Image',
            'Are you sure you want to delete this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const updatedGallery = gallery.filter((_, i) => i !== index);
                        await setDoc(doc(db, 'users', auth.currentUser.uid), {
                            gallery: updatedGallery
                        }, { merge: true });
                        setGallery(updatedGallery);
                    }
                }
            ]
        );
    };

    const handleLike = async (index) => {
        try {
            const updatedGallery = [...gallery];
            const post = updatedGallery[index];

            if (!post.likes) post.likes = [];

            const userId = auth.currentUser.uid;
            const hasLiked = post.likes.includes(userId);

            if (hasLiked) {
                post.likes = post.likes.filter(id => id !== userId);
            } else {
                post.likes.push(userId);
            }

            post.likesCount = post.likes.length;

            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                gallery: updatedGallery
            }, { merge: true });

            setGallery(updatedGallery);
        } catch (error) {
            Alert.alert('Error', 'Failed to update like');
        }
    };

    const handleComment = (index) => {
        setSelectedPostIndex(index);
        setShowCommentsModal(true);
    };

    const submitComment = async () => {
        if (!commentText.trim()) {
            Alert.alert('Error', 'Please enter a comment');
            return;
        }

        try {
            const updatedGallery = [...gallery];
            const post = updatedGallery[selectedPostIndex];

            if (!post.comments) post.comments = [];

            const newComment = {
                userId: auth.currentUser.uid,
                userName: userData?.fullName || 'Anonymous',
                text: commentText,
                timestamp: new Date().toISOString()
            };

            post.comments.push(newComment);
            post.commentsCount = post.comments.length;

            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                gallery: updatedGallery
            }, { merge: true });

            setGallery(updatedGallery);
            setCommentText('');
            Alert.alert('Success', 'Comment added!');
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
        }
    };

    const handleShare = (index) => {
        Alert.alert(
            'Share Post',
            'Share this post with others',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Copy Link', onPress: () => Alert.alert('Link Copied', 'Post link copied!') },
                { text: 'Share', onPress: () => Alert.alert('Share', 'Sharing coming soon!') }
            ]
        );
    };

    const openFullScreenViewer = (index) => {
        setCurrentImageIndex(index);
        setShowFullScreenViewer(true);
    };

    const handleSwipe = (direction) => {
        if (direction === 'up' && currentImageIndex < gallery.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else if (direction === 'down' && currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const themeOptions = [
        { name: 'light', label: 'Light', icon: 'sunny' },
        { name: 'dark', label: 'Dark', icon: 'moon' },
        { name: 'blue', label: 'Ocean Blue', icon: 'water' },
        { name: 'green', label: 'Nature Green', icon: 'leaf' },
        { name: 'purple', label: 'Purple Dream', icon: 'flower' },
        { name: 'orange', label: 'Sunset Orange', icon: 'sunny-outline' },
        { name: 'pink', label: 'Pink Blossom', icon: 'heart' },
        { name: 'teal', label: 'Teal Wave', icon: 'water-outline' },
        { name: 'indigo', label: 'Indigo Night', icon: 'moon-outline' },
        { name: 'red', label: 'Ruby Red', icon: 'flame' },
        { name: 'midnight', label: 'Midnight Blue', icon: 'moon-sharp' },
        { name: 'sunset', label: 'Golden Sunset', icon: 'partly-sunny' },
    ];

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

    const saveServices = async () => {
        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                services: selectedServices
            }, { merge: true });
            setShowServiceModal(false);
            Alert.alert('Success', 'Services updated!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const selectMainService = async (service) => {
        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                mainService: service
            }, { merge: true });
            setMainService(service);
            setShowMainServiceModal(false);
            Alert.alert('Success', `${service.name} set as your main service!`);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const openMainServiceSelector = () => {
        if (selectedServices.length === 0) {
            Alert.alert('No Services', 'Please add services first before selecting a main service.');
            return;
        }
        setShowMainServiceModal(true);
    };

    const openEditProfile = () => {
        console.log('Opening edit profile...');
        console.log('Total countries available:', COUNTRIES.length);
        console.log('First 3 countries:', COUNTRIES.slice(0, 3));

        setEditedProfile({
            fullName: userData?.fullName || '',
            phone: userData?.phone || '',
            nationality: userData?.nationality || '',
            dateOfBirth: userData?.dateOfBirth || '',
            state: userData?.state || '',
            street: userData?.street || '',
            zipCode: userData?.zipCode || '',
        });

        // Load available states for current country
        const states = getStatesForCountry(userData?.nationality || '');
        console.log('Available states for country:', states.length);
        setAvailableStates(states);

        setShowEditProfileModal(true);
    };

    const handleCountryChange = (countryCode) => {
        setEditedProfile({ ...editedProfile, nationality: countryCode, state: '' });
        const states = getStatesForCountry(countryCode);
        setAvailableStates(states);
    };

    const saveProfile = async () => {
        if (!editedProfile.fullName.trim()) {
            Alert.alert('Error', 'Full name is required');
            return;
        }
        if (!editedProfile.phone.trim()) {
            Alert.alert('Error', 'Phone number is required');
            return;
        }
        if (!editedProfile.nationality.trim()) {
            Alert.alert('Error', 'Please select a country');
            return;
        }

        try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
                fullName: editedProfile.fullName.trim(),
                phone: editedProfile.phone.trim(),
                nationality: editedProfile.nationality.trim(),
                dateOfBirth: editedProfile.dateOfBirth.trim(),
                state: editedProfile.state.trim(),
                street: editedProfile.street.trim(),
                zipCode: editedProfile.zipCode.trim(),
            }, { merge: true });

            setUserData({
                ...userData,
                fullName: editedProfile.fullName.trim(),
                phone: editedProfile.phone.trim(),
                nationality: editedProfile.nationality.trim(),
                dateOfBirth: editedProfile.dateOfBirth.trim(),
                state: editedProfile.state.trim(),
                street: editedProfile.street.trim(),
                zipCode: editedProfile.zipCode.trim(),
            });

            setShowEditProfileModal(false);
            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const formatDateOfBirthEdit = (text) => {
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        if (cleaned.length >= 2) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        if (cleaned.length >= 4) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
        }
        setEditedProfile({ ...editedProfile, dateOfBirth: formatted });
    };


    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'Not set';
        try {
            const today = new Date();
            let birthDate;

            // Handle DD/MM/YYYY format
            if (dateOfBirth.includes('/')) {
                const parts = dateOfBirth.split('/');
                if (parts.length === 3) {
                    const day = parseInt(parts[0]);
                    const month = parseInt(parts[1]);
                    const year = parseInt(parts[2]);
                    birthDate = new Date(year, month - 1, day);
                }
            } else {
                // Fallback: try parsing as-is
                birthDate = new Date(dateOfBirth);
            }

            // Check if date is valid
            if (!birthDate || isNaN(birthDate.getTime())) {
                return 'Not set';
            }

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            // Return age if it's reasonable (between 0 and 150)
            if (age >= 0 && age <= 150) {
                return age.toString();
            }
            return 'Not set';
        } catch (error) {
            console.log('Error calculating age:', error);
            return 'Not set';
        }
    };

    const getLocationString = () => {
        const parts = [];

        // Get state/county name from the state value
        if (userData?.state) {
            // Find the state label from availableStates or just use the value
            const stateLabel = userData.state;
            parts.push(stateLabel);
        }

        // Get country name from the country code
        if (userData?.nationality) {
            const country = COUNTRIES.find(c => c.value === userData.nationality);
            if (country) {
                parts.push(country.label);
            }
        }

        return parts.length > 0 ? parts.join(', ') : 'Not set';
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header with Banner */}
            <View style={styles.headerContainer}>
                {/* Banner Image with Profile Info Inside */}
                <View style={styles.bannerWrapper}>
                    <TouchableOpacity onPress={pickBannerImage} activeOpacity={0.9} style={styles.bannerTouchable}>
                        <Image
                            source={{
                                uri: bannerImage || 'https://via.placeholder.com/800x300/FF6B35/FFFFFF?text=Tap+to+add+banner'
                            }}
                            style={styles.bannerImage}
                        />
                        {/* Dark overlay for better text readability */}
                        <View style={styles.bannerOverlay} />

                        {/* Camera badge on banner */}
                        <View style={[styles.bannerEditBadge, { backgroundColor: theme.primary }]}>
                            <Ionicons name="camera" size={16} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Profile Info on Banner */}
                    <View style={styles.profileInfoOnBanner}>
                        <TouchableOpacity onPress={pickProfilePicture} style={styles.avatarContainer}>
                            <Image
                                source={{ uri: userData?.profilePicture || 'https://via.placeholder.com/120' }}
                                style={styles.avatar}
                            />
                            <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="camera" size={16} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.nameOnBanner}>{userData?.fullName}</Text>
                        <Text style={styles.emailOnBanner}>{userData?.email}</Text>

                        {/* Service Badge for Providers */}
                        {userType === 'provider' && (
                            <TouchableOpacity
                                style={styles.badgeOnBanner}
                                onPress={openMainServiceSelector}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.badgeTextOnBanner}>
                                    {mainService ? `🔧 ${mainService.name}` : '🔧 Tap to select main service'}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {/* Customer Badge */}
                        {userType === 'customer' && (
                            <View style={styles.badgeOnBanner}>
                                <Text style={styles.badgeTextOnBanner}>👤 Customer</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Theme Selector */}
            <TouchableOpacity
                style={[styles.themeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => setShowThemeModal(true)}
            >
                <Ionicons name="color-palette" size={24} color={theme.primary} />
                <Text style={[styles.themeButtonText, { color: theme.text }]}>Change Theme</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>

            {/* Switch Mode Button */}
            <TouchableOpacity
                style={[styles.switchButton, { backgroundColor: theme.primary }]}
                onPress={switchMode}
            >
                <Ionicons name="swap-horizontal" size={20} color="#fff" />
                <Text style={styles.switchButtonText}>
                    Switch to {userType === 'customer' ? 'Provider' : 'Customer'} Mode
                </Text>
            </TouchableOpacity>

            {/* Provider Section */}
            {userType === 'provider' && (
                <View style={{ backgroundColor: theme.background }}>
                    {/* Stats Row */}
                    <View style={[styles.statsRow, { backgroundColor: theme.background }]}>
                        <View style={styles.statBox}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>{gallery.length}</Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Posts</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statNumber, { color: theme.text }]}>
                                {reviews.length}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                        </View>
                        <View style={styles.statBox}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                                <Ionicons name="star" size={18} color="#FFD700" />
                                <Text style={[styles.statNumber, { color: theme.text }]}>
                                    {averageRating || '0.0'}
                                </Text>
                            </View>
                            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => setShowServiceModal(true)}
                        >
                            <Text style={[styles.actionButtonText, { color: theme.text }]}>Manage Services</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={pickGalleryImages}
                        >
                            <Ionicons name="add" size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Services Dropdown */}
                    {selectedServices.length > 0 && (
                        <View style={[styles.servicesDropdownContainer, { backgroundColor: theme.surface }]}>
                            <TouchableOpacity
                                style={styles.servicesDropdownHeader}
                                onPress={() => setServicesExpanded(!servicesExpanded)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.servicesDropdownLeft}>
                                    <Ionicons name="briefcase" size={20} color={theme.primary} />
                                    <Text style={[styles.servicesDropdownTitle, { color: theme.text }]}>
                                        Services ({selectedServices.length})
                                    </Text>
                                </View>
                                <Ionicons
                                    name={servicesExpanded ? "chevron-up" : "chevron-down"}
                                    size={20}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>

                            {servicesExpanded && (
                                <View style={styles.servicesDropdownContent}>
                                    {selectedServices.map((service, index) => (
                                        <View
                                            key={service.id}
                                            style={[
                                                styles.serviceDropdownItem,
                                                { borderBottomColor: theme.border },
                                                index === selectedServices.length - 1 && { borderBottomWidth: 0 }
                                            ]}
                                        >
                                            <View style={styles.serviceDropdownLeft}>
                                                <View style={[styles.serviceBullet, { backgroundColor: theme.primary }]} />
                                                <Text style={[styles.serviceDropdownText, { color: theme.text }]}>
                                                    {service.name}
                                                </Text>
                                            </View>
                                            {mainService?.id === service.id && (
                                                <View style={[styles.mainServiceBadge, { backgroundColor: theme.primary }]}>
                                                    <Text style={styles.mainServiceBadgeText}>Main</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))}

                                    {/* Quick Actions */}
                                    <View style={styles.servicesDropdownActions}>
                                        <TouchableOpacity
                                            style={[styles.dropdownActionButton, { borderColor: theme.border }]}
                                            onPress={() => setShowServiceModal(true)}
                                        >
                                            <Ionicons name="create-outline" size={18} color={theme.primary} />
                                            <Text style={[styles.dropdownActionText, { color: theme.primary }]}>
                                                Edit Services
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.dropdownActionButton, { borderColor: theme.border }]}
                                            onPress={openMainServiceSelector}
                                        >
                                            <Ionicons name="star-outline" size={18} color={theme.primary} />
                                            <Text style={[styles.dropdownActionText, { color: theme.primary }]}>
                                                Set Main
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Story Highlights */}
                    {selectedServices.length > 0 && (
                        <View style={styles.highlightsContainer}>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {selectedServices.slice(0, 6).map((service, index) => (
                                    <View key={service.id} style={styles.highlightItem}>
                                        <View style={[styles.highlightCircle, { borderColor: theme.primary }]}>
                                            <Ionicons name="briefcase" size={32} color={theme.primary} />
                                        </View>
                                        <Text style={[styles.highlightLabel, { color: theme.text }]} numberOfLines={1}>
                                            {service.name.length > 10 ? service.name.substring(0, 10) + '...' : service.name}
                                        </Text>
                                    </View>
                                ))}
                                {selectedServices.length > 6 && (
                                    <TouchableOpacity
                                        style={styles.highlightItem}
                                        onPress={() => setShowServiceModal(true)}
                                    >
                                        <View style={[styles.highlightCircle, { borderColor: theme.border }]}>
                                            <Ionicons name="ellipsis-horizontal" size={32} color={theme.textSecondary} />
                                        </View>
                                        <Text style={[styles.highlightLabel, { color: theme.textSecondary }]}>More</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    {/* Tab Navigation */}
                    <View style={[styles.tabBar, { borderBottomColor: theme.border }]}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'grid' && { borderBottomColor: theme.text }]}
                            onPress={() => setActiveTab('grid')}
                        >
                            <Ionicons
                                name="grid"
                                size={24}
                                color={activeTab === 'grid' ? theme.text : theme.textSecondary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'reels' && { borderBottomColor: theme.text }]}
                            onPress={() => setActiveTab('reels')}
                        >
                            <Ionicons
                                name="play-circle"
                                size={24}
                                color={activeTab === 'reels' ? theme.text : theme.textSecondary}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'reviews' && { borderBottomColor: theme.text }]}
                            onPress={() => setActiveTab('reviews')}
                        >
                            <Ionicons
                                name="star"
                                size={24}
                                color={activeTab === 'reviews' ? theme.text : theme.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Gallery Grid - 3 Columns */}
                    {activeTab === 'grid' && (
                        <View style={styles.instagramGrid}>
                            {gallery.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.gridItem}
                                    onPress={() => openFullScreenViewer(index)}
                                >
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={styles.gridImage}
                                        resizeMode="cover"
                                    />
                                    {item.type === 'video' && (
                                        <View style={styles.videoIcon}>
                                            <Ionicons name="play" size={20} color="#fff" />
                                        </View>
                                    )}
                                    {(item.likesCount > 0 || item.commentsCount > 0) && (
                                        <View style={styles.gridOverlay}>
                                            <View style={styles.gridStats}>
                                                {item.likesCount > 0 && (
                                                    <View style={styles.gridStat}>
                                                        <Ionicons name="heart" size={18} color="#fff" />
                                                        <Text style={styles.gridStatText}>{item.likesCount}</Text>
                                                    </View>
                                                )}
                                                {item.commentsCount > 0 && (
                                                    <View style={styles.gridStat}>
                                                        <Ionicons name="chatbubble" size={18} color="#fff" />
                                                        <Text style={styles.gridStatText}>{item.commentsCount}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Reels Tab */}
                    {activeTab === 'reels' && (
                        <View style={styles.instagramGrid}>
                            {gallery.filter(item => item.type === 'video').map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.gridItem}
                                    onPress={() => openFullScreenViewer(gallery.indexOf(item))}
                                >
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={styles.gridImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.reelIcon}>
                                        <Ionicons name="play" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.reelViews}>
                                        <Ionicons name="play" size={14} color="#fff" />
                                        <Text style={styles.reelViewsText}>
                                            {item.likesCount || 0}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {gallery.filter(item => item.type === 'video').length === 0 && (
                                <View style={styles.emptyState}>
                                    <Ionicons name="play-circle-outline" size={64} color={theme.textSecondary} />
                                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                        No videos yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <View style={styles.reviewsContainer}>
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.surface }]}>
                                        <View style={styles.reviewHeader}>
                                            <View style={styles.reviewUserInfo}>
                                                <Ionicons name="person-circle" size={40} color={theme.primary} />
                                                <View style={styles.reviewUserDetails}>
                                                    <Text style={[styles.reviewUserName, { color: theme.text }]}>
                                                        {review.userName || 'Anonymous'}
                                                    </Text>
                                                    <Text style={[styles.reviewDate, { color: theme.textSecondary }]}>
                                                        {new Date(review.timestamp).toLocaleDateString()}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.reviewRating}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Ionicons
                                                        key={star}
                                                        name={star <= review.rating ? "star" : "star-outline"}
                                                        size={16}
                                                        color="#FFD700"
                                                    />
                                                ))}
                                            </View>
                                        </View>
                                        {review.review && (
                                            <Text style={[styles.reviewText, { color: theme.text }]}>
                                                {review.review}
                                            </Text>
                                        )}
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyState}>
                                    <Ionicons name="star-outline" size={64} color={theme.textSecondary} />
                                    <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                        No reviews yet
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                </View>
            )}

            {/* Account Info */}
            <View style={[styles.section, { backgroundColor: theme.surface }]}>
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Information</Text>
                    <TouchableOpacity
                        style={[styles.editProfileButton, { borderColor: theme.primary }]}
                        onPress={openEditProfile}
                    >
                        <Ionicons name="create-outline" size={18} color={theme.primary} />
                        <Text style={[styles.editProfileText, { color: theme.primary }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="person" size={20} color={theme.textSecondary} />
                    <Text style={[styles.info, { color: theme.textSecondary }]}>{userData?.fullName || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="call" size={20} color={theme.textSecondary} />
                    <Text style={[styles.info, { color: theme.textSecondary }]}>{userData?.phone || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="location" size={20} color={theme.textSecondary} />
                    <Text style={[styles.info, { color: theme.textSecondary }]}>{getLocationString()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="flag" size={20} color={theme.textSecondary} />
                    <Text style={[styles.info, { color: theme.textSecondary }]}>{userData?.nationality || 'Not set'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="calendar" size={20} color={theme.textSecondary} />
                    <Text style={[styles.info, { color: theme.textSecondary }]}>
                        Age: {calculateAge(userData?.dateOfBirth)}
                    </Text>
                </View>

                {/* Services List for Providers */}
                {userType === 'provider' && selectedServices.length > 0 && (
                    <View style={styles.servicesInfoSection}>
                        <View style={styles.infoRow}>
                            <Ionicons name="briefcase" size={20} color={theme.textSecondary} />
                            <Text style={[styles.info, { color: theme.textSecondary, fontWeight: '600' }]}>
                                Services Offered:
                            </Text>
                        </View>
                        <View style={styles.servicesListContainer}>
                            {selectedServices.map((service, index) => (
                                <View
                                    key={service.id}
                                    style={[
                                        styles.serviceInfoChip,
                                        { backgroundColor: theme.card, borderColor: theme.border },
                                        mainService?.id === service.id && {
                                            backgroundColor: theme.primary + '20',
                                            borderColor: theme.primary
                                        }
                                    ]}
                                >
                                    <Text style={[
                                        styles.serviceInfoText,
                                        { color: theme.text },
                                        mainService?.id === service.id && {
                                            color: theme.primary,
                                            fontWeight: '600'
                                        }
                                    ]}>
                                        {service.name}
                                        {mainService?.id === service.id && ' ⭐'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* App Feedback Button */}
            <TouchableOpacity
                style={[styles.feedbackButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AppFeedback')}
            >
                <Ionicons name="star" size={20} color="#fff" />
                <Text style={styles.feedbackText}>Rate SkillSling App</Text>
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity
                style={[styles.settingsButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => navigation.navigate('Settings')}
            >
                <Ionicons name="settings" size={20} color={theme.text} />
                <Text style={[styles.settingsText, { color: theme.text }]}>Settings & Permissions</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            {/* Theme Modal */}
            <Modal
                visible={showThemeModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowThemeModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Choose Theme</Text>
                        {themeOptions.map((option) => (
                            <TouchableOpacity
                                key={option.name}
                                style={[
                                    styles.themeOption,
                                    { borderColor: theme.border },
                                    currentTheme === option.name && { backgroundColor: theme.primary + '20' }
                                ]}
                                onPress={() => {
                                    changeTheme(option.name);
                                    setShowThemeModal(false);
                                }}
                            >
                                <Ionicons name={option.icon} size={24} color={theme.primary} />
                                <Text style={[styles.themeOptionText, { color: theme.text }]}>
                                    {option.label}
                                </Text>
                                {currentTheme === option.name && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: theme.primary }]}
                            onPress={() => setShowThemeModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            {/* Service Management Modal */}
            < Modal
                visible={showServiceModal}
                animationType="slide"
                onRequestClose={() => setShowServiceModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Manage Services</Text>
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
                                                style={[
                                                    styles.serviceOption,
                                                    { borderColor: theme.border, backgroundColor: theme.surface },
                                                    isSelected && { borderColor: theme.primary, backgroundColor: theme.primary + '20' }
                                                ]}
                                                onPress={() => toggleService(service)}
                                            >
                                                <Text style={[
                                                    styles.serviceOptionText,
                                                    { color: theme.text },
                                                    isSelected && { color: theme.primary, fontWeight: '600' }
                                                ]}>
                                                    {service.name}
                                                </Text>
                                                {isSelected && (
                                                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            );
                        })}

                        {/* Custom Service Input */}
                        <View style={styles.customServiceSection}>
                            <Text style={[styles.categoryTitle, { color: theme.text }]}>Can't find your service?</Text>
                            {!showCustomServiceInput ? (
                                <TouchableOpacity
                                    style={[styles.addCustomButton, { borderColor: theme.primary }]}
                                    onPress={() => setShowCustomServiceInput(true)}
                                >
                                    <Ionicons name="add-circle" size={24} color={theme.primary} />
                                    <Text style={[styles.addCustomText, { color: theme.primary }]}>Add Custom Service</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.customInputContainer}>
                                    <TextInput
                                        style={[styles.customInput, { borderColor: theme.border, color: theme.text }]}
                                        placeholder="Enter service name"
                                        placeholderTextColor={theme.textSecondary}
                                        value={customService}
                                        onChangeText={setCustomService}
                                    />
                                    <TouchableOpacity
                                        style={[styles.addButton, { backgroundColor: theme.primary }]}
                                        onPress={addCustomService}
                                    >
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

                    <TouchableOpacity
                        style={[styles.doneButton, { backgroundColor: theme.primary }]}
                        onPress={saveServices}
                    >
                        <Text style={styles.doneButtonText}>
                            Save ({selectedServices.length} selected)
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal >

            {/* Image Viewer Modal */}
            < Modal
                visible={selectedImage !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedImage(null)}
            >
                <View style={styles.imageViewerOverlay}>
                    <TouchableOpacity
                        style={styles.closeImageButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Ionicons name="close-circle" size={40} color="#fff" />
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal >

            {/* Comments Modal */}
            < Modal
                visible={showCommentsModal}
                animationType="slide"
                onRequestClose={() => setShowCommentsModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Comments</Text>
                        <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                            <Ionicons name="close" size={28} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.commentsContainer}>
                        {selectedPostIndex !== null && gallery[selectedPostIndex]?.comments?.length > 0 ? (
                            gallery[selectedPostIndex].comments.map((comment, index) => (
                                <View key={index} style={[styles.commentItem, { backgroundColor: theme.surface }]}>
                                    <View style={styles.commentHeader}>
                                        <Ionicons name="person-circle" size={32} color={theme.primary} />
                                        <View style={styles.commentContent}>
                                            <Text style={[styles.commentUser, { color: theme.text }]}>
                                                {comment.userName}
                                            </Text>
                                            <Text style={[styles.commentText, { color: theme.textSecondary }]}>
                                                {comment.text}
                                            </Text>
                                            <Text style={[styles.commentTime, { color: theme.textSecondary }]}>
                                                {new Date(comment.timestamp).toLocaleDateString()}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.noComments}>
                                <Ionicons name="chatbubbles-outline" size={48} color={theme.textSecondary} />
                                <Text style={[styles.noCommentsText, { color: theme.textSecondary }]}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    <View style={[styles.commentInputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                        <TextInput
                            style={[styles.commentInput, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                            placeholder="Write a comment..."
                            placeholderTextColor={theme.textSecondary}
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, { backgroundColor: theme.primary }]}
                            onPress={submitComment}
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            {/* Full Screen Viewer Modal */}
            < Modal
                visible={showFullScreenViewer}
                animationType="fade"
                onRequestClose={() => setShowFullScreenViewer(false)}
            >
                <View style={[styles.fullScreenContainer, { backgroundColor: '#000' }]}>
                    {/* Header */}
                    <View style={styles.fullScreenHeader}>
                        <TouchableOpacity
                            style={styles.fullScreenCloseButton}
                            onPress={() => setShowFullScreenViewer(false)}
                        >
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.fullScreenDeleteButton}
                            onPress={() => {
                                setShowFullScreenViewer(false);
                                deleteGalleryItem(currentImageIndex);
                            }}
                        >
                            <Ionicons name="trash" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Media Display */}
                    {gallery[currentImageIndex] && (
                        <View style={styles.fullScreenMediaContainer}>
                            {gallery[currentImageIndex].type === 'video' ? (
                                <VideoView
                                    style={styles.fullScreenMedia}
                                    player={videoPlayer}
                                    allowsFullscreen={false}
                                    nativeControls={true}
                                />
                            ) : (
                                <Image
                                    source={{ uri: gallery[currentImageIndex].uri }}
                                    style={styles.fullScreenMedia}
                                    resizeMode="contain"
                                />
                            )}
                        </View>
                    )}

                    {/* Social Actions */}
                    <View style={styles.fullScreenActions}>
                        <TouchableOpacity
                            style={styles.fullScreenActionButton}
                            onPress={() => handleLike(currentImageIndex)}
                        >
                            <Ionicons
                                name={gallery[currentImageIndex]?.likes?.includes(auth.currentUser.uid) ? "heart" : "heart-outline"}
                                size={32}
                                color={gallery[currentImageIndex]?.likes?.includes(auth.currentUser.uid) ? "#ff4444" : "#fff"}
                            />
                            <Text style={styles.fullScreenActionText}>
                                {gallery[currentImageIndex]?.likesCount || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.fullScreenActionButton}
                            onPress={() => {
                                setShowFullScreenViewer(false);
                                handleComment(currentImageIndex);
                            }}
                        >
                            <Ionicons name="chatbubble-outline" size={32} color="#fff" />
                            <Text style={styles.fullScreenActionText}>
                                {gallery[currentImageIndex]?.commentsCount || 0}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.fullScreenActionButton}
                            onPress={() => handleShare(currentImageIndex)}
                        >
                            <Ionicons name="share-outline" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Navigation Indicators */}
                    <View style={styles.navigationIndicators}>
                        <Text style={styles.indicatorText}>
                            {currentImageIndex + 1} / {gallery.length}
                        </Text>
                    </View>

                    {/* Swipe Navigation */}
                    {currentImageIndex > 0 && (
                        <TouchableOpacity
                            style={[styles.navButton, styles.navButtonLeft]}
                            onPress={() => setCurrentImageIndex(currentImageIndex - 1)}
                        >
                            <Ionicons name="chevron-back" size={40} color="#fff" />
                        </TouchableOpacity>
                    )}
                    {currentImageIndex < gallery.length - 1 && (
                        <TouchableOpacity
                            style={[styles.navButton, styles.navButtonRight]}
                            onPress={() => setCurrentImageIndex(currentImageIndex + 1)}
                        >
                            <Ionicons name="chevron-forward" size={40} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </Modal >

            {/* Main Service Selection Modal */}
            <Modal
                visible={showMainServiceModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowMainServiceModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select Main Service</Text>
                        <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                            Choose the primary service you want to display on your profile badge
                        </Text>

                        <ScrollView style={styles.mainServiceList}>
                            {selectedServices.map((service) => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={[
                                        styles.mainServiceOption,
                                        { borderColor: theme.border, backgroundColor: theme.card },
                                        mainService?.id === service.id && {
                                            borderColor: theme.primary,
                                            backgroundColor: theme.primary + '20'
                                        }
                                    ]}
                                    onPress={() => selectMainService(service)}
                                >
                                    <View style={styles.mainServiceInfo}>
                                        <Ionicons
                                            name="briefcase"
                                            size={24}
                                            color={mainService?.id === service.id ? theme.primary : theme.textSecondary}
                                        />
                                        <Text style={[
                                            styles.mainServiceText,
                                            { color: theme.text },
                                            mainService?.id === service.id && {
                                                color: theme.primary,
                                                fontWeight: '600'
                                            }
                                        ]}>
                                            {service.name}
                                        </Text>
                                    </View>
                                    {mainService?.id === service.id && (
                                        <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: theme.primary }]}
                            onPress={() => setShowMainServiceModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Edit Profile Modal */}
            <Modal
                visible={showEditProfileModal}
                animationType="slide"
                onRequestClose={() => setShowEditProfileModal(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
                    <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
                        <TouchableOpacity onPress={() => setShowEditProfileModal(false)}>
                            <Ionicons name="close" size={28} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.editProfileContent}>
                        {/* Full Name */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Full Name *</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={theme.textSecondary}
                                    value={editedProfile.fullName}
                                    onChangeText={(text) => setEditedProfile({ ...editedProfile, fullName: text })}
                                />
                            </View>
                        </View>

                        {/* Phone */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Phone Number *</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="call-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Enter your phone number"
                                    placeholderTextColor={theme.textSecondary}
                                    value={editedProfile.phone}
                                    onChangeText={(text) => setEditedProfile({ ...editedProfile, phone: text })}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        {/* Date of Birth */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Date of Birth</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor={theme.textSecondary}
                                    value={editedProfile.dateOfBirth}
                                    onChangeText={formatDateOfBirthEdit}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </View>
                            <Text style={[styles.inputHint, { color: theme.textSecondary }]}>
                                Format: DD/MM/YYYY (e.g., 15/01/1990)
                            </Text>
                        </View>

                        {/* Location Section Header */}
                        <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
                            <Ionicons name="location" size={20} color={theme.primary} />
                            <Text style={[styles.sectionHeaderText, { color: theme.text }]}>Location Information</Text>
                        </View>

                        {/* Country/Nationality */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Country *</Text>
                            <View style={[styles.pickerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="flag-outline" size={20} color={theme.textSecondary} style={styles.pickerIcon} />
                                <Picker
                                    selectedValue={editedProfile.nationality}
                                    onValueChange={(value) => handleCountryChange(value)}
                                    style={[styles.picker, { color: theme.text }]}
                                    dropdownIconColor={theme.text}
                                >
                                    <Picker.Item label="Select Country" value="" />
                                    {COUNTRIES.map((country) => (
                                        <Picker.Item
                                            key={country.value}
                                            label={String(country.label)}
                                            value={String(country.value)}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {/* State/County */}
                        {availableStates.length > 0 && (
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: theme.text }]}>State/County</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                    <Ionicons name="map-outline" size={20} color={theme.textSecondary} style={styles.pickerIcon} />
                                    <Picker
                                        selectedValue={editedProfile.state}
                                        onValueChange={(value) => setEditedProfile({ ...editedProfile, state: value })}
                                        style={[styles.picker, { color: theme.text }]}
                                        dropdownIconColor={theme.text}
                                    >
                                        <Picker.Item label="Select State/County" value="" />
                                        {availableStates.map((stateObj, index) => (
                                            <Picker.Item
                                                key={stateObj.value || `state-${index}`}
                                                label={String(stateObj.label)}
                                                value={String(stateObj.value)}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        )}

                        {/* Street */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Street Address</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="home-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Enter your street address (optional)"
                                    placeholderTextColor={theme.textSecondary}
                                    value={editedProfile.street}
                                    onChangeText={(text) => setEditedProfile({ ...editedProfile, street: text })}
                                />
                            </View>
                        </View>

                        {/* Zip Code */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: theme.text }]}>Zip/Postal Code</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Enter zip/postal code (optional)"
                                    placeholderTextColor={theme.textSecondary}
                                    value={editedProfile.zipCode}
                                    onChangeText={(text) => setEditedProfile({ ...editedProfile, zipCode: text })}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Info Note */}
                        <View style={[styles.infoNote, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <Ionicons name="information-circle" size={20} color={theme.primary} />
                            <Text style={[styles.infoNoteText, { color: theme.textSecondary }]}>
                                All location fields are optional. Your location helps connect you with local service providers.
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Save Button */}
                    <View style={styles.editProfileFooter}>
                        <TouchableOpacity
                            style={[styles.saveProfileButton, { backgroundColor: theme.primary }]}
                            onPress={saveProfile}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                            <Text style={styles.saveProfileButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: 'relative',
    },
    bannerWrapper: {
        position: 'relative',
        height: 280,
    },
    bannerTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    bannerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    bannerEditBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    profileInfoOnBanner: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
    },
    profileOverlay: {
        marginTop: -50,
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    header: {
        padding: 30,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
        borderWidth: 4,
        borderColor: '#fff',
        borderRadius: 60,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    nameOnBanner: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    emailOnBanner: {
        fontSize: 16,
        color: '#fff',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    badgeOnBanner: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    badgeTextOnBanner: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        marginTop: 5,
    },
    badge: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    themeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
    },
    themeButtonText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    switchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    switchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        margin: 15,
        padding: 20,
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        gap: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    galleryContainer: {
        marginTop: 10,
    },
    galleryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    galleryGrid: {
        flexDirection: 'column',
        gap: 10,
    },
    galleryItem: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        gap: 10,
    },
    info: {
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4444',
        margin: 15,
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        gap: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        marginBottom: 0,
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    feedbackText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        marginTop: 0,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        gap: 10,
    },
    settingsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    themeOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        gap: 15,
    },
    themeOptionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
    },
    closeButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageViewerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeImageButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    servicesContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    selectedServicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    serviceChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    serviceChipText: {
        fontSize: 14,
        fontWeight: '600',
    },
    categorySection: {
        marginBottom: 20,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    serviceOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 8,
    },
    serviceOptionText: {
        fontSize: 16,
    },
    customServiceSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    addCustomButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        gap: 10,
    },
    addCustomText: {
        fontSize: 16,
        fontWeight: '600',
    },
    customInputContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    customInput: {
        flex: 1,
        borderWidth: 1,
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
    },
    addButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 10,
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
    },
    doneButton: {
        padding: 15,
        margin: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    galleryPostCard: {
        width: '100%',
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
    },
    socialActions: {
        flexDirection: 'row',
        padding: 10,
        gap: 15,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    actionText: {
        fontSize: 14,
    },
    commentsContainer: {
        flex: 1,
        padding: 15,
    },
    commentItem: {
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    commentHeader: {
        flexDirection: 'row',
        gap: 10,
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 4,
    },
    commentTime: {
        fontSize: 12,
    },
    noComments: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    noCommentsText: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    commentInputContainer: {
        flexDirection: 'row',
        padding: 10,
        gap: 10,
        borderTopWidth: 1,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    galleryThumbnail: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 10,
        position: 'relative',
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    thumbnailOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
    },
    thumbnailStats: {
        flexDirection: 'row',
        gap: 15,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    videoIndicator: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    modalContainer: {
        flex: 1,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
    },
    fullScreenContainer: {
        flex: 1,
    },
    fullScreenHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 50,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    fullScreenCloseButton: {
        padding: 10,
    },
    fullScreenDeleteButton: {
        padding: 10,
    },
    fullScreenMediaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenMedia: {
        width: width,
        height: '100%',
    },
    fullScreenActions: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        gap: 20,
        zIndex: 10,
    },
    fullScreenActionButton: {
        alignItems: 'center',
        gap: 5,
    },
    fullScreenActionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    navigationIndicators: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    indicatorText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        zIndex: 10,
    },
    navButtonLeft: {
        left: 20,
    },
    navButtonRight: {
        right: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 13,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        gap: 8,
        marginBottom: 10,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        gap: 5,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    highlightsContainer: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    highlightItem: {
        alignItems: 'center',
        marginHorizontal: 8,
        width: 70,
    },
    highlightCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    highlightLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    instagramGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2,
    },
    gridItem: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        position: 'relative',
    },
    gridImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f0f0f0',
    },
    videoIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    gridOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    gridStats: {
        flexDirection: 'row',
        gap: 15,
    },
    gridStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    gridStatText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reelIcon: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -12 }, { translateY: -12 }],
    },
    reelViews: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    reelViewsText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        marginTop: 10,
    },
    reviewsContainer: {
        padding: 15,
    },
    reviewCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewUserInfo: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
    },
    reviewUserDetails: {
        flex: 1,
    },
    reviewUserName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
    },
    reviewRating: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewText: {
        fontSize: 14,
        lineHeight: 20,
    },
    servicesInfoSection: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    servicesListContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
        marginLeft: 30,
    },
    serviceInfoChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    serviceInfoText: {
        fontSize: 13,
        fontWeight: '500',
    },
    modalSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    mainServiceList: {
        maxHeight: 400,
    },
    mainServiceOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10,
    },
    mainServiceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    mainServiceText: {
        fontSize: 16,
        flex: 1,
    },
    servicesDropdownContainer: {
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    servicesDropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    servicesDropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    servicesDropdownTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    servicesDropdownContent: {
        paddingBottom: 10,
    },
    serviceDropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    serviceDropdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    serviceBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    serviceDropdownText: {
        fontSize: 15,
        flex: 1,
    },
    mainServiceBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    mainServiceBadgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    servicesDropdownActions: {
        flexDirection: 'row',
        gap: 10,
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    dropdownActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    dropdownActionText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
    },
    editProfileText: {
        fontSize: 14,
        fontWeight: '600',
    },
    editProfileContent: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        gap: 10,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        gap: 10,
        minHeight: 50,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 15,
        minHeight: 50,
        overflow: 'hidden',
    },
    pickerIcon: {
        marginRight: 10,
    },
    picker: {
        flex: 1,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    inputHint: {
        fontSize: 12,
        marginTop: 5,
        fontStyle: 'italic',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        marginBottom: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        gap: 8,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '600',
    },
    infoNote: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 10,
        marginTop: 10,
    },
    infoNoteText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    editProfileFooter: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    saveProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 10,
        gap: 8,
    },
    saveProfileButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
