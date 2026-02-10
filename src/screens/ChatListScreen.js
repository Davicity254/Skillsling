import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function ChatListScreen({ navigation }) {
    const { theme } = useTheme();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query without orderBy to avoid index requirement
        const q = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', auth.currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chatList = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Get the other user's info
                const otherUserId = data.participants.find(id => id !== auth.currentUser.uid);
                chatList.push({
                    id: doc.id,
                    ...data,
                    otherUserId
                });
            });

            // Sort client-side by lastMessageTime
            chatList.sort((a, b) => {
                const timeA = a.lastMessageTime?.toMillis() || 0;
                const timeB = b.lastMessageTime?.toMillis() || 0;
                return timeB - timeA;
            });

            setChats(chatList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diff = now - date;

        // Less than 24 hours
        if (diff < 86400000) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        // Less than 7 days
        else if (diff < 604800000) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        }
        // Older
        else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const renderChat = ({ item }) => (
        <TouchableOpacity
            style={[styles.chatItem, { backgroundColor: theme.surface }]}
            onPress={() => navigation.navigate('Chat', {
                chatId: item.id,
                userId: item.otherUserId,
                userName: item.otherUserName,
                userPhoto: item.otherUserPhoto
            })}
        >
            <Image
                source={{ uri: item.otherUserPhoto || 'https://via.placeholder.com/50' }}
                style={styles.avatar}
            />
            <View style={styles.chatInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>{item.otherUserName}</Text>
                <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
                    {item.lastMessage || 'No messages yet'}
                </Text>
            </View>
            <View style={styles.chatMeta}>
                <Text style={[styles.time, { color: theme.textSecondary }]}>
                    {formatTime(item.lastMessageTime)}
                </Text>
                {item.unreadCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.badgeText}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Loading chats...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={chats}
                renderItem={renderChat}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={64} color={theme.textSecondary} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            No messages yet
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                            Start a conversation with a service provider
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatar: { width: 50, height: 50, borderRadius: 25 },
    chatInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    lastMessage: { fontSize: 14 },
    chatMeta: { alignItems: 'flex-end', justifyContent: 'space-between' },
    time: { fontSize: 12, marginBottom: 4 },
    badge: {
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', padding: 40, marginTop: 100 },
    emptyText: { fontSize: 18, marginTop: 10, fontWeight: '600' },
    emptySubtext: { fontSize: 14, marginTop: 5, textAlign: 'center' },
});
