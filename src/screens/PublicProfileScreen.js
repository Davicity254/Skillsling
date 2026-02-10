import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Linking, Alert, FlatList, Dimensions } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 6) / 3;

export default function PublicProfileScreen({ route, navigation }) {
    const { userId } = route.params;
    const { theme } = useTheme();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('grid');
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        loadUserData();
        loadReviews();
    }, [userId]);

    const loadUserData = async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserData({ id: userDoc.id, ...userDoc.data() });
            }
        } catch (error) {
            console.log('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        try {
            const reviewsQuery = query(
                collection(db, 'serviceReviews'),
                where('providerId', '==', userId),
                orderBy('timestamp', 'desc')
            );
            const reviewsSnapshot = await getDocs(reviewsQuery);
            const reviewsData = reviewsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);

            if (reviewsData.length > 0) {
                const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
                setAverageRating((totalRating / reviewsData.length).toFixed(1));
            }
        } catch (error) {
            console.log('Error loading reviews:', error);
        }
    };

    const handleCall = () => {
        if (userData?.phone) {
            Linking.openURL(`tel:${userData.phone}`);
        } else {
            Alert.alert('No Phone', 'This provider has not added a phone number.');
        }
    };

    const handleMessage = () => {
        navigation.navigate('Chat', {
            userId: userData.id,
            userName: userData.fullName,
            userPhoto: userData.profilePicture
        });
    };

    const handleRequestService = () => {
        navigation.navigate('Booking', {
            providerId: userData.id,
            providerName: userData.fullName
        });
    };

    const handleShare = () => {
        Alert.alert('Share Profile', 'Share functionality coming soon!');
    };

    const handleReport = () => {
        Alert.alert(
            'Report Profile',
            'Why are you reporting this profile?',
            [
                { text: 'Spam', onPress: () => submitReport('spam') },
                { text: 'Inappropriate Content', onPress: () => submitReport('inappropriate') },
                { text: 'Fake Profile', onPress: () => submitReport('fake') },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const submitReport = (reason) => {
        // TODO: Implement report submission to Firestore
        Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Loading...</Text>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>User not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
                    <Ionicons name="share-outline" size={24} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReport} style={styles.headerButton}>
                    <Ionicons name="flag-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Banner */}
            <Image
                source={{ uri: userData.bannerImage || 'https://via.placeholder.com/800x300/FF6B35/FFFFFF?text=SkillSling' }}
                style={styles.banner}
            />

            {/* Profile Info */}
            <View style={styles.profileSection}>
                <Image
                    source={{ uri: userData.profilePicture || 'https://via.placeholder.com/120' }}
                    style={styles.avatar}
                />
                <Text style={[styles.name, { color: theme.text }]}>{userData.fullName}</Text>
                <Text style={[styles.location, { color: theme.textSecondary }]}>
                    {userData.location?.city}, {userData.location?.country}
                </Text>
                {userData.mainService && (
                    <View style={[styles.mainServiceBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.mainServiceText}>🔧 {userData.mainService.name}</Text>
                    </View>
                )}
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={[styles.statNumber, { color: theme.text }]}>
                        {userData.gallery?.length || 0}
                    </Text>
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
                    style={[styles.actionButton, { backgroundColor: theme.primary }]}
                    onPress={handleRequestService}
                >
                    <Ionicons name="briefcase" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Request Service</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
                    onPress={handleMessage}
                >
                    <Ionicons name="chatbubble" size={20} color={theme.primary} />
                    <Text style={[styles.actionButtonTextSecondary, { color: theme.primary }]}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
                    onPress={handleCall}
                >
                    <Ionicons name="call" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            {/* Services */}
            {userData.services && userData.services.length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Services Offered</Text>
                    <View style={styles.servicesContainer}>
                        {userData.services.map((service) => (
                            <View
                                key={service.id}
                                style={[styles.serviceChip, { backgroundColor: theme.card, borderColor: theme.border }]}
                            >
                                <Text style={[styles.serviceText, { color: theme.text }]}>
                                    {service.name}
                                </Text>
                            </View>
                        ))}
                    </View>
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

            {/* Gallery Grid */}
            {activeTab === 'grid' && (
                <View style={styles.instagramGrid}>
                    {userData.gallery && userData.gallery.length > 0 ? (
                        userData.gallery.map((item, index) => (
                            <View key={index} style={styles.gridItem}>
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
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="images-outline" size={64} color={theme.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No posts yet
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 50,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: { padding: 5 },
    headerButton: { padding: 5 },
    banner: { width: '100%', height: 250 },
    profileSection: { alignItems: 'center', marginTop: -60, marginBottom: 20 },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
    location: { fontSize: 16, marginTop: 5 },
    mainServiceBadge: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    mainServiceText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
    statBox: { alignItems: 'center' },
    statNumber: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 13, marginTop: 2 },
    actionButtons: { flexDirection: 'row', padding: 15, gap: 10 },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        gap: 8
    },
    iconButton: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
    actionButtonTextSecondary: { fontSize: 14, fontWeight: '600' },
    section: { margin: 15, padding: 20, borderRadius: 10 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    servicesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    serviceChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
    },
    serviceText: { fontSize: 14 },
    tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    instagramGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 2, padding: 2 },
    gridItem: { width: ITEM_SIZE, height: ITEM_SIZE, position: 'relative' },
    gridImage: { width: '100%', height: '100%', backgroundColor: '#f0f0f0' },
    videoIcon: { position: 'absolute', top: 8, right: 8 },
    reviewsContainer: { padding: 15 },
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
    reviewUserInfo: { flexDirection: 'row', gap: 10, flex: 1 },
    reviewUserDetails: { flex: 1 },
    reviewUserName: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    reviewDate: { fontSize: 12 },
    reviewRating: { flexDirection: 'row', gap: 2 },
    reviewText: { fontSize: 14, lineHeight: 20 },
    emptyState: { alignItems: 'center', padding: 60, width: '100%' },
    emptyText: { fontSize: 16, marginTop: 10 },
});
