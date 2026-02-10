import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }) {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
                    Last Updated: February 9, 2026
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Introduction</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Welcome to SkillSling. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Information We Collect</Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Personal Information You Provide:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    • Full name, email address, phone number{'\n'}
                    • Date of birth (to verify age requirements){'\n'}
                    • Nationality and location information{'\n'}
                    • Profile picture and banner image{'\n'}
                    • Services offered (for service providers){'\n'}
                    • Messages, reviews, and gallery posts
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Information Collected Automatically:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    • Usage data (features used, time spent){'\n'}
                    • Device information (model, OS, identifiers){'\n'}
                    • Technical data (IP address, browser type)
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>What We Do NOT Collect:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    • Precise GPS location (only manual location entry){'\n'}
                    • Your contacts{'\n'}
                    • Background location tracking{'\n'}
                    • Payment card information
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>2. How We Use Your Information</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We use your information to:{'\n\n'}
                    • Create and manage your account{'\n'}
                    • Enable app features (search, messaging, booking){'\n'}
                    • Connect service providers with customers{'\n'}
                    • Display your profile to other users{'\n'}
                    • Improve our service and user experience{'\n'}
                    • Send service-related notifications{'\n'}
                    • Ensure safety and security{'\n'}
                    • Comply with legal obligations
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>3. How We Share Your Information</Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Information Shared Publicly:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    • Your name and profile picture{'\n'}
                    • Services you offer (for providers){'\n'}
                    • Your location (country, state, city - NOT exact address){'\n'}
                    • Gallery posts and reviews{'\n'}
                    • Your ratings and review count
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Service Providers:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We share your information with:{'\n'}
                    • Firebase (Google) - Hosting, authentication, database{'\n'}
                    • Expo - App development platform{'\n'}
                    These providers are contractually obligated to protect your information.
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Legal Requirements:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We may disclose your information if required by law or to:{'\n'}
                    • Comply with legal processes{'\n'}
                    • Protect our rights and safety{'\n'}
                    • Prevent fraud or illegal activities
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Data Storage and Security</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Your data is stored on secure Firebase servers in the Europe multi-region (eur3). We implement:{'\n\n'}
                    • Encryption of data in transit (HTTPS/SSL){'\n'}
                    • Encryption of passwords{'\n'}
                    • Secure authentication systems{'\n'}
                    • Access controls and security rules{'\n\n'}
                    However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>5. Your Rights and Choices</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You have the right to:{'\n\n'}
                    • Access and update your information (in Profile settings){'\n'}
                    • Delete your account (in Settings){'\n'}
                    • Opt-out of notifications{'\n'}
                    • Request a copy of your data{'\n'}
                    • Withdraw consent at any time
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>For EU Users (GDPR):</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You have additional rights including:{'\n'}
                    • Right to rectification{'\n'}
                    • Right to erasure ("right to be forgotten"){'\n'}
                    • Right to restrict processing{'\n'}
                    • Right to data portability{'\n'}
                    • Right to object to processing
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Children's Privacy</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Age Requirements:{'\n'}
                    • Customers: Must be 13 years or older{'\n'}
                    • Service Providers: Must be 18 years or older{'\n\n'}
                    We do not knowingly collect information from children under 13. If we discover an underage user, we will immediately delete their account and data.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Data Retention</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We retain your information:{'\n'}
                    • Account data: Until you delete your account{'\n'}
                    • Messages: Until deleted by you or recipient{'\n'}
                    • Posts/Gallery: Until you delete them{'\n'}
                    • Reviews: Retained (anonymized after account deletion){'\n'}
                    • Logs: Up to 90 days
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>8. International Data Transfers</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Changes to This Policy</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy in the app and updating the "Last Updated" date. Your continued use after changes constitutes acceptance.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>10. Contact Us</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    If you have questions about this Privacy Policy or your personal information, please contact us:{'\n\n'}
                    Email: [your-email@example.com]{'\n'}
                    Address: [Your Business Address]{'\n'}
                    Phone: [Your Phone Number]{'\n\n'}
                    Response Time: We aim to respond within 48 hours.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Regional Compliance</Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>Kenya:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We comply with the Kenya Data Protection Act, 2019. You can lodge complaints with the Office of the Data Protection Commissioner.
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>European Union (GDPR):</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We comply with GDPR. Our legal basis for processing includes consent, contract performance, legal obligations, and legitimate interests.
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>California (CCPA):</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We comply with CCPA. We do NOT sell your personal information to third parties.
                </Text>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        By using SkillSling, you consent to this Privacy Policy and agree to its terms.
                    </Text>
                    <Text style={[styles.footerText, { color: theme.textSecondary, marginTop: 10 }]}>
                        SkillSling Team{'\n'}
                        Connecting Communities, One Service at a Time
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 15,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    placeholder: {
        width: 34,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    lastUpdated: {
        fontSize: 12,
        fontStyle: 'italic',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 10,
    },
    footer: {
        marginTop: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    footerText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 20,
    },
});
