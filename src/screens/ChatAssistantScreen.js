import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

// Mock service database
const SERVICES = [
    { id: 1, name: 'Hair Salon', category: 'Beauty', price: '$30-50', rating: 4.5 },
    { id: 2, name: 'Barber Shop', category: 'Beauty', price: '$15-25', rating: 4.8 },
    { id: 3, name: 'Plumbing Service', category: 'Home', price: '$50-100', rating: 4.6 },
    { id: 4, name: 'Electrician', category: 'Home', price: '$60-120', rating: 4.7 },
    { id: 5, name: 'House Cleaning', category: 'Home', price: '$40-80', rating: 4.4 },
    { id: 6, name: 'Nail Salon', category: 'Beauty', price: '$25-45', rating: 4.5 },
    { id: 7, name: 'Massage Therapy', category: 'Wellness', price: '$50-90', rating: 4.9 },
    { id: 8, name: 'Personal Trainer', category: 'Fitness', price: '$40-70', rating: 4.6 },
    { id: 9, name: 'Car Wash', category: 'Auto', price: '$20-40', rating: 4.3 },
    { id: 10, name: 'Landscaping', category: 'Home', price: '$80-150', rating: 4.5 },
];

export default function ChatAssistantScreen({ navigation }) {
    const [messages, setMessages] = useState([
        {
            id: '1',
            text: 'Hi! I\'m your SkillSling assistant. I can help you find services near you. What are you looking for today?',
            sender: 'bot',
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef();
    const { theme } = useTheme();

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Generate bot response
        setTimeout(() => {
            const botResponse = generateResponse(inputText);
            setMessages(prev => [...prev, botResponse]);
        }, 500);
    };

    const generateResponse = (userInput) => {
        const input = userInput.toLowerCase();
        let responseText = '';
        let services = [];

        // Search for services based on keywords
        if (input.includes('hair') || input.includes('salon')) {
            services = SERVICES.filter(s => s.category === 'Beauty' && s.name.includes('Salon'));
            responseText = 'I found these hair salons for you:';
        } else if (input.includes('barber')) {
            services = SERVICES.filter(s => s.name.includes('Barber'));
            responseText = 'Here are the barber shops available:';
        } else if (input.includes('plumb')) {
            services = SERVICES.filter(s => s.name.includes('Plumb'));
            responseText = 'I found these plumbing services:';
        } else if (input.includes('electric')) {
            services = SERVICES.filter(s => s.name.includes('Electric'));
            responseText = 'Here are the electricians near you:';
        } else if (input.includes('clean')) {
            services = SERVICES.filter(s => s.name.includes('Clean'));
            responseText = 'These cleaning services are available:';
        } else if (input.includes('beauty') || input.includes('nail')) {
            services = SERVICES.filter(s => s.category === 'Beauty');
            responseText = 'Here are beauty services I found:';
        } else if (input.includes('home') || input.includes('house')) {
            services = SERVICES.filter(s => s.category === 'Home');
            responseText = 'These home services are available:';
        } else if (input.includes('fitness') || input.includes('gym') || input.includes('train')) {
            services = SERVICES.filter(s => s.category === 'Fitness');
            responseText = 'I found these fitness services:';
        } else if (input.includes('massage') || input.includes('wellness')) {
            services = SERVICES.filter(s => s.category === 'Wellness');
            responseText = 'Here are wellness services:';
        } else if (input.includes('car') || input.includes('auto')) {
            services = SERVICES.filter(s => s.category === 'Auto');
            responseText = 'These auto services are available:';
        } else if (input.includes('all') || input.includes('show') || input.includes('list')) {
            services = SERVICES;
            responseText = 'Here are all available services:';
        } else {
            responseText = 'I can help you find:\n\n• Hair Salons & Barbers\n• Plumbers & Electricians\n• House Cleaning\n• Beauty Services\n• Fitness & Wellness\n• Auto Services\n\nWhat would you like to find?';
        }

        return {
            id: Date.now().toString(),
            text: responseText,
            sender: 'bot',
            timestamp: new Date(),
            services: services.length > 0 ? services : null,
        };
    };

    const handleServicePress = (service) => {
        navigation.navigate('ServiceDetail', { service });
    };

    const renderMessage = ({ item }) => {
        const isBot = item.sender === 'bot';

        return (
            <View style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
                <View style={[
                    styles.messageBubble,
                    { backgroundColor: isBot ? theme.surface : theme.primary }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isBot ? theme.text : '#fff' }
                    ]}>
                        {item.text}
                    </Text>

                    {/* Service Cards */}
                    {item.services && item.services.length > 0 && (
                        <View style={styles.servicesContainer}>
                            {item.services.map((service) => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}
                                    onPress={() => handleServicePress(service)}
                                >
                                    <View style={styles.serviceHeader}>
                                        <Text style={[styles.serviceName, { color: theme.text }]}>
                                            {service.name}
                                        </Text>
                                        <View style={styles.ratingContainer}>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                            <Text style={[styles.rating, { color: theme.textSecondary }]}>
                                                {service.rating}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.serviceCategory, { color: theme.textSecondary }]}>
                                        {service.category}
                                    </Text>
                                    <Text style={[styles.servicePrice, { color: theme.primary }]}>
                                        {service.price}
                                    </Text>
                                    <View style={[styles.viewButton, { backgroundColor: theme.primary }]}>
                                        <Text style={styles.viewButtonText}>View Details</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <Text style={[styles.timestamp, { color: isBot ? theme.textSecondary : '#fff9' }]}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    const quickReplies = ['Hair Salon', 'Plumber', 'Electrician', 'Cleaning', 'Show All'];

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <Ionicons name="chatbubbles" size={24} color="#fff" />
                <Text style={styles.headerTitle}>AI Assistant</Text>
                <View style={styles.onlineIndicator} />
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Quick Replies */}
            <View style={styles.quickRepliesContainer}>
                <FlatList
                    horizontal
                    data={quickReplies}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.quickReply, { backgroundColor: theme.surface, borderColor: theme.border }]}
                            onPress={() => {
                                setInputText(item);
                                setTimeout(() => handleSend(), 100);
                            }}
                        >
                            <Text style={[styles.quickReplyText, { color: theme.text }]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Input */}
            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Type your message..."
                    placeholderTextColor={theme.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: theme.primary }]}
                    onPress={handleSend}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
        gap: 10,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    onlineIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
    },
    messagesList: {
        padding: 15,
    },
    messageContainer: {
        marginBottom: 15,
    },
    botMessage: {
        alignItems: 'flex-start',
    },
    userMessage: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 15,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 5,
    },
    servicesContainer: {
        marginTop: 10,
        gap: 10,
    },
    serviceCard: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        minWidth: 200,
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
    },
    serviceCategory: {
        fontSize: 14,
        marginBottom: 5,
    },
    servicePrice: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    viewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 8,
        gap: 5,
    },
    viewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    quickRepliesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    quickReply: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
    },
    quickReplyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 10,
        borderTopWidth: 1,
        gap: 10,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
