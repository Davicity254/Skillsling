import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image, Keyboard } from 'react-native';
import { collection, query, where, onSnapshot, addDoc, doc, setDoc, getDoc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function ChatScreen({ route, navigation }) {
    const { chatId, userId, userName, userPhoto } = route.params;
    const { theme } = useTheme();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [currentChatId, setCurrentChatId] = useState(chatId);
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <TouchableOpacity
                    style={styles.headerTitle}
                    onPress={() => navigation.navigate('PublicProfile', { userId })}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: userPhoto || 'https://via.placeholder.com/40' }}
                        style={styles.headerAvatar}
                    />
                    <Text style={[styles.headerName, { color: theme.text }]}>{userName}</Text>
                </TouchableOpacity>
            ),
        });
    }, [userName, userPhoto, userId]);

    useEffect(() => {
        if (currentChatId) {
            loadMessages();
        } else {
            // Check if chat exists
            checkExistingChat();
        }
    }, [currentChatId]);

    const checkExistingChat = async () => {
        try {
            const chatsRef = collection(db, 'chats');
            const q = query(
                chatsRef,
                where('participants', 'array-contains', auth.currentUser.uid)
            );
            const snapshot = await getDocs(q);

            let existingChatId = null;
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.participants.includes(userId)) {
                    existingChatId = doc.id;
                }
            });

            if (existingChatId) {
                setCurrentChatId(existingChatId);
            }
        } catch (error) {
            console.log('Error checking existing chat:', error);
        }
    };

    const loadMessages = () => {
        const messagesRef = collection(db, 'messages');
        const q = query(
            messagesRef,
            where('chatId', '==', currentChatId)
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const messagesList = [];
            const unreadMessages = [];

            snapshot.forEach((doc) => {
                const messageData = { id: doc.id, ...doc.data() };
                messagesList.push(messageData);

                // Collect unread messages that are not from current user
                if (!messageData.read && messageData.senderId !== auth.currentUser.uid) {
                    unreadMessages.push(doc.id);
                }
            });

            // Sort client-side by timestamp
            messagesList.sort((a, b) => {
                const timeA = a.timestamp?.toMillis() || 0;
                const timeB = b.timestamp?.toMillis() || 0;
                return timeA - timeB;
            });

            setMessages(messagesList);

            // Mark unread messages as read and update chat unreadCount
            if (unreadMessages.length > 0) {
                unreadMessages.forEach(async (messageId) => {
                    try {
                        await updateDoc(doc(db, 'messages', messageId), {
                            read: true
                        });
                    } catch (error) {
                        console.log('Error marking message as read:', error);
                    }
                });

                // Reset unreadCount in chat document
                try {
                    await updateDoc(doc(db, 'chats', currentChatId), {
                        unreadCount: 0
                    });
                } catch (error) {
                    console.log('Error updating unreadCount:', error);
                }
            }

            // Scroll to bottom
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        return unsubscribe;
    };

    const sendMessage = async () => {
        if (!messageText.trim()) return;

        try {
            let chatIdToUse = currentChatId;

            // Create chat if it doesn't exist
            if (!chatIdToUse) {
                const chatRef = await addDoc(collection(db, 'chats'), {
                    participants: [auth.currentUser.uid, userId],
                    lastMessage: messageText,
                    lastMessageTime: serverTimestamp(),
                    otherUserName: userName,
                    otherUserPhoto: userPhoto,
                    unreadCount: 1,
                });
                chatIdToUse = chatRef.id;
                setCurrentChatId(chatIdToUse);
            } else {
                // Get current unreadCount and increment it
                const chatDoc = await getDoc(doc(db, 'chats', chatIdToUse));
                const currentUnreadCount = chatDoc.data()?.unreadCount || 0;

                // Update chat with incremented unreadCount
                await updateDoc(doc(db, 'chats', chatIdToUse), {
                    lastMessage: messageText,
                    lastMessageTime: serverTimestamp(),
                    unreadCount: currentUnreadCount + 1,
                });
            }

            // Add message
            await addDoc(collection(db, 'messages'), {
                chatId: chatIdToUse,
                senderId: auth.currentUser.uid,
                text: messageText,
                timestamp: serverTimestamp(),
                read: false,
            });

            setMessageText('');
        } catch (error) {
            console.log('Error sending message:', error);
        }
    };

    const renderMessage = ({ item }) => {
        const isMyMessage = item.senderId === auth.currentUser.uid;

        return (
            <View style={[
                styles.messageContainer,
                isMyMessage ? styles.myMessage : styles.theirMessage
            ]}>
                <View style={[
                    styles.messageBubble,
                    { backgroundColor: isMyMessage ? theme.primary : theme.surface }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isMyMessage ? '#fff' : theme.text }
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.messageTime,
                        { color: isMyMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary }
                    ]}>
                        {item.timestamp ? new Date(item.timestamp.toDate()).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : ''}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubbles-outline" size={64} color={theme.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                No messages yet
                            </Text>
                            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                                Start the conversation!
                            </Text>
                        </View>
                    }
                />

                <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]}
                        placeholder="Type a message..."
                        placeholderTextColor={theme.textSecondary}
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={1000}
                        onFocus={() => {
                            // Scroll to bottom when keyboard opens
                            setTimeout(() => {
                                flatListRef.current?.scrollToEnd({ animated: true });
                            }, 300);
                        }}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.primary }]}
                        onPress={sendMessage}
                        disabled={!messageText.trim()}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerAvatar: { width: 35, height: 35, borderRadius: 17.5 },
    headerName: { fontSize: 16, fontWeight: '600' },
    messagesList: { padding: 15 },
    messageContainer: { marginBottom: 10 },
    myMessage: { alignItems: 'flex-end' },
    theirMessage: { alignItems: 'flex-start' },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
    },
    messageText: { fontSize: 16, lineHeight: 20 },
    messageTime: { fontSize: 11, marginTop: 4 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        gap: 10,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: { alignItems: 'center', padding: 40, marginTop: 100 },
    emptyText: { fontSize: 18, marginTop: 10, fontWeight: '600' },
    emptySubtext: { fontSize: 14, marginTop: 5 },
});
