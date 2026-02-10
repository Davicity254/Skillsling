import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../config/ThemeContext';

export default function TermsOfServiceScreen({ navigation }) {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
                    Last Updated: February 9, 2026
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>Agreement to Terms</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Welcome to SkillSling! These Terms of Service govern your access to and use of the SkillSling mobile application. By using the app, you agree to be bound by these Terms. If you do not agree, do not use the app.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>1. Eligibility and Age Requirements</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    To use SkillSling, you must meet the following age requirements:{'\n\n'}
                    • Customers: Must be at least 13 years old{'\n'}
                    • Service Providers: Must be at least 18 years old{'\n\n'}
                    By creating an account, you represent and warrant that you meet these age requirements.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>2. Account Registration</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You agree to:{'\n'}
                    • Provide accurate, current, and complete information{'\n'}
                    • Maintain and update your information{'\n'}
                    • Not impersonate any person or entity{'\n'}
                    • Not create multiple accounts{'\n'}
                    • Maintain the confidentiality of your password{'\n'}
                    • Notify us of any unauthorized use{'\n\n'}
                    You are responsible for all activities under your account.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>3. User Types and Modes</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    SkillSling allows users to operate in two modes:{'\n\n'}
                    • Customer Mode: To search for and request services{'\n'}
                    • Provider Mode: To offer services to customers{'\n\n'}
                    You can switch between modes at any time. Provider mode requires users to be 18 years or older.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>4. Prohibited Services</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    The following services are strictly prohibited:{'\n\n'}
                    • Prostitution, escort services, or sexual services{'\n'}
                    • Drug dealing or illegal substance sales{'\n'}
                    • Weapons sales or trafficking{'\n'}
                    • Human trafficking or exploitation{'\n'}
                    • Gambling services (unless legally licensed){'\n'}
                    • Counterfeit goods or services{'\n'}
                    • Hacking or illegal computer services{'\n'}
                    • Money laundering or financial fraud{'\n'}
                    • Any illegal activities{'\n\n'}
                    Violations will result in immediate account termination and may be reported to law enforcement.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>5. User Conduct</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You agree NOT to:{'\n\n'}
                    • Violate any laws or regulations{'\n'}
                    • Infringe on intellectual property rights{'\n'}
                    • Harass, abuse, or harm other users{'\n'}
                    • Post false, misleading, or deceptive content{'\n'}
                    • Spam or send unsolicited messages{'\n'}
                    • Attempt unauthorized access to the app{'\n'}
                    • Use automated systems (bots, scrapers){'\n'}
                    • Collect user information without consent{'\n'}
                    • Impersonate others{'\n'}
                    • Post offensive or hateful content{'\n'}
                    • Engage in fraudulent activities{'\n'}
                    • Manipulate ratings or reviews
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>6. Platform Role</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    SkillSling is a platform that connects Service Providers with Customers. We:{'\n\n'}
                    • Do NOT provide the services listed on the app{'\n'}
                    • Do NOT employ or control Service Providers{'\n'}
                    • Do NOT guarantee the quality of services{'\n'}
                    • Do NOT verify Provider credentials{'\n'}
                    • Are NOT a party to agreements between Providers and Customers{'\n\n'}
                    All service agreements are directly between Providers and Customers. You acknowledge that we are not responsible for service performance or outcomes.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>7. Content and Intellectual Property</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You retain ownership of content you post. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display, reproduce, and distribute your content for operating and promoting the app.{'\n\n'}
                    You are solely responsible for all content you post and ensuring you have the right to post it.{'\n\n'}
                    The app and its original content are owned by us and protected by copyright, trademark, and other intellectual property laws.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>8. Reviews and Ratings</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    When posting reviews, you must:{'\n\n'}
                    • Base reviews on actual experiences{'\n'}
                    • Be honest and accurate{'\n'}
                    • Not post fake or misleading reviews{'\n'}
                    • Not review yourself or competitors{'\n'}
                    • Not accept compensation for reviews{'\n\n'}
                    We reserve the right to remove reviews that violate our guidelines.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>9. Privacy and Data Protection</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    Your use of the app is also governed by our Privacy Policy. By using the app, you understand that:{'\n\n'}
                    • Your profile information is visible to other users{'\n'}
                    • Your posts and gallery are public{'\n'}
                    • Messages are visible to recipients{'\n'}
                    • Reviews you write are public{'\n'}
                    • Your location (country, state, city) is visible
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>10. Disclaimers and Limitations</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT:{'\n\n'}
                    • Guarantee the quality of services{'\n'}
                    • Verify Provider credentials{'\n'}
                    • Endorse any Provider or service{'\n'}
                    • Guarantee service availability{'\n'}
                    • Warrant error-free operation{'\n\n'}
                    YOU ARE SOLELY RESPONSIBLE FOR:{'\n\n'}
                    • Verifying Provider credentials{'\n'}
                    • Evaluating service quality{'\n'}
                    • Your interactions with other users{'\n'}
                    • Your safety and security{'\n\n'}
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>11. Indemnification</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You agree to indemnify and hold harmless SkillSling from any claims, damages, losses, and expenses arising from:{'\n\n'}
                    • Your use of the app{'\n'}
                    • Your violation of these Terms{'\n'}
                    • Your content or conduct{'\n'}
                    • Services you provide or receive{'\n'}
                    • Your interactions with other users
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>12. Termination</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    You may terminate your account at any time through Settings.{'\n\n'}
                    We may terminate or suspend your account immediately for:{'\n'}
                    • Violation of these Terms{'\n'}
                    • Fraudulent or illegal activity{'\n'}
                    • Abusive behavior{'\n'}
                    • Providing false information{'\n'}
                    • Any other reason at our discretion{'\n\n'}
                    Upon termination, your right to use the app ceases immediately.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>13. Changes to Terms</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    We may modify these Terms at any time. We will notify you of changes by posting updated Terms in the app and updating the "Last Updated" date. Your continued use after changes constitutes acceptance of the updated Terms.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>14. Dispute Resolution</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    If you have a dispute with us, please contact us first to attempt informal resolution.{'\n\n'}
                    These Terms are governed by the laws of [Your Country/State]. Any legal action must be brought in the courts of [Your Location].
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>15. Contact Information</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    If you have questions about these Terms, please contact us:{'\n\n'}
                    Email: [your-email@example.com]{'\n'}
                    Address: [Your Business Address]{'\n'}
                    Phone: [Your Phone Number]{'\n\n'}
                    Response Time: We aim to respond within 48 hours.
                </Text>

                <Text style={[styles.sectionTitle, { color: theme.text }]}>16. Special Provisions</Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>For Service Providers:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    As a Service Provider, you additionally agree to:{'\n'}
                    • Maintain appropriate insurance (if required){'\n'}
                    • Comply with all professional regulations{'\n'}
                    • Pay all applicable taxes{'\n'}
                    • Obtain necessary licenses and permits{'\n'}
                    • Not misrepresent your qualifications{'\n'}
                    • Provide services professionally
                </Text>

                <Text style={[styles.subTitle, { color: theme.text }]}>For Customers:</Text>
                <Text style={[styles.paragraph, { color: theme.text }]}>
                    As a Customer, you additionally agree to:{'\n'}
                    • Verify Provider credentials independently{'\n'}
                    • Exercise reasonable caution{'\n'}
                    • Report issues promptly{'\n'}
                    • Provide honest feedback and reviews
                </Text>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                        By using SkillSling, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                    </Text>
                    <Text style={[styles.footerText, { color: theme.textSecondary, marginTop: 10 }]}>
                        SkillSling Team{'\n'}
                        Connecting Communities, One Service at a Time
                    </Text>
                    <Text style={[styles.footerText, { color: theme.textSecondary, marginTop: 15, fontSize: 11 }]}>
                        IMPORTANT: These are template terms. Please consult with a lawyer to ensure they comply with your local laws and adequately protect your business.
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
