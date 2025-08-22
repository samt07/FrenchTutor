import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  RadioButton,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';
import { apiService, formatCurrency } from '../services/api';

const PaymentScreen = ({ route, navigation }) => {
  const { registrationData } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!registrationData) {
      Alert.alert('Error', 'Registration data not found. Please go back and try again.');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        await handleCardPayment();
      } else {
        await handleBankTransferPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert(
        'Payment Failed',
        'There was an error processing your payment. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async () => {
    Alert.alert(
      'Card Payment',
      'Card payment integration is coming soon! For now, please use bank transfer option or contact Sandy directly.',
      [
        { text: 'Use Bank Transfer', onPress: () => setPaymentMethod('bank_transfer') },
        { text: 'Contact Sandy', onPress: showContactInfo },
        { text: 'OK' }
      ]
    );
  };

  const handleBankTransferPayment = async () => {
    try {
      const response = await apiService.createBankTransferPayment(registrationData);
      
      if (response.success) {
        Alert.alert(
          'Registration Successful! 🎉',
          `Your registration has been submitted successfully!\n\nPayment Details:\n• Amount: ${formatCurrency(response.amount)}\n• Registration ID: ${response.registrationId}\n\nBank transfer instructions have been sent to your email. Sandy will contact you within 24 hours to confirm your classes.\n\nWhatsApp: +91 98765 43210`,
          [
            { 
              text: 'Done', 
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  const showContactInfo = () => {
    Alert.alert(
      'Contact Sandy',
      'For immediate assistance:\n\n📧 Email: sandy.frenchtutor@gmail.com\n📱 WhatsApp: +91 98765 43210\n\nSandy will help you complete your registration personally.',
      [{ text: 'OK' }]
    );
  };

  const getPricing = () => {
    const grades = {
      elementary: 5500,
      middle: 6500,
      high: 7500
    };
    return grades[registrationData?.gradeLevel] || 0;
  };

  const getPlanName = () => {
    if (!registrationData?.gradeLevel) return 'French Plan';
    const gradeLevel = registrationData.gradeLevel;
    return `${gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)} School Plan`;
  };

  if (!registrationData) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={60} color={theme.colors.error} />
        <Title style={[styles.title, { color: theme.colors.error, marginTop: 20 }]}>
          No Registration Data
        </Title>
        <Paragraph style={styles.subtitle}>
          Please go back and complete the registration form first.
        </Paragraph>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={localStyles.headerSection}
      >
        <View style={localStyles.headerContent}>
          <Ionicons name="card" size={60} color="#fff" style={{ marginBottom: 15 }} />
          <Title style={localStyles.headerTitle}>
            Complete Your Payment
          </Title>
          <Paragraph style={localStyles.headerSubtitle}>
            Final step to start your French learning journey
          </Paragraph>
        </View>
      </LinearGradient>

      <View style={localStyles.contentContainer}>
        {/* Registration Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>Registration Summary</Title>
            <View style={localStyles.summaryRow}>
              <Paragraph style={localStyles.summaryLabel}>Student Name:</Paragraph>
              <Paragraph style={localStyles.summaryValue}>
                {registrationData.firstName} {registrationData.lastName}
              </Paragraph>
            </View>
            <View style={localStyles.summaryRow}>
              <Paragraph style={localStyles.summaryLabel}>Email:</Paragraph>
              <Paragraph style={localStyles.summaryValue}>{registrationData.email}</Paragraph>
            </View>
            <View style={localStyles.summaryRow}>
              <Paragraph style={localStyles.summaryLabel}>Selected Plan:</Paragraph>
              <Paragraph style={localStyles.summaryValue}>{getPlanName()}</Paragraph>
            </View>
            <View style={localStyles.summaryRow}>
              <Paragraph style={localStyles.summaryLabel}>Classes per Month:</Paragraph>
              <Paragraph style={localStyles.summaryValue}>4 classes</Paragraph>
            </View>
            <Divider style={{ marginVertical: 15 }} />
            <View style={localStyles.summaryRow}>
              <Paragraph style={localStyles.totalLabel}>Monthly Amount:</Paragraph>
              <Paragraph style={localStyles.totalValue}>
                {formatCurrency(getPricing())}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Methods */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>Select Payment Method</Title>
            
            <RadioButton.Group
              onValueChange={setPaymentMethod}
              value={paymentMethod}
            >
              <View style={localStyles.paymentOption}>
                <View style={localStyles.paymentRow}>
                  <RadioButton value="card" />
                  <View style={localStyles.paymentContent}>
                    <Ionicons name="card" size={24} color={theme.colors.primary} />
                    <View style={localStyles.paymentText}>
                      <Paragraph style={localStyles.paymentTitle}>Credit/Debit Card</Paragraph>
                      <Paragraph style={localStyles.paymentSubtitle}>
                        Pay securely with your card (Coming Soon)
                      </Paragraph>
                    </View>
                  </View>
                </View>
              </View>

              <View style={localStyles.paymentOption}>
                <View style={localStyles.paymentRow}>
                  <RadioButton value="bank_transfer" />
                  <View style={localStyles.paymentContent}>
                    <Ionicons name="business" size={24} color={theme.colors.secondary} />
                    <View style={localStyles.paymentText}>
                      <Paragraph style={localStyles.paymentTitle}>Bank Transfer</Paragraph>
                      <Paragraph style={localStyles.paymentSubtitle}>
                        Transfer directly to Sandy's account
                      </Paragraph>
                    </View>
                  </View>
                </View>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        {/* Bank Transfer Info */}
        {paymentMethod === 'bank_transfer' && (
          <Card style={[styles.card, { backgroundColor: theme.colors.secondary + '10' }]}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Bank Transfer Instructions</Title>
              <Paragraph style={localStyles.bankInstructions}>
                After clicking "Complete Registration", you'll receive bank transfer details via email. 
                Your classes will start once payment is confirmed.
              </Paragraph>
              <View style={localStyles.bankBenefits}>
                <View style={localStyles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Paragraph style={localStyles.benefitText}>Secure and reliable</Paragraph>
                </View>
                <View style={localStyles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Paragraph style={localStyles.benefitText}>No processing fees</Paragraph>
                </View>
                <View style={localStyles.benefitRow}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  <Paragraph style={localStyles.benefitText}>Direct to Sandy's account</Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Payment Button */}
        <Button
          mode="contained"
          onPress={handlePayment}
          style={localStyles.paymentButton}
          loading={loading}
          disabled={loading}
          icon={paymentMethod === 'card' ? 'card' : 'bank-transfer'}
        >
          {loading 
            ? 'Processing...' 
            : paymentMethod === 'card' 
              ? 'Pay with Card' 
              : 'Complete Registration'
          }
        </Button>

        {/* Help Section */}
        <Card style={styles.card}>
          <Card.Content style={localStyles.helpSection}>
            <Title style={[localStyles.sectionTitle, { textAlign: 'center' }]}>
              Need Help?
            </Title>
            <Paragraph style={localStyles.helpText}>
              Having trouble with payment? Contact Sandy directly for assistance.
            </Paragraph>
            
            <Button
              mode="outlined"
              onPress={showContactInfo}
              style={localStyles.helpButton}
              icon="headset"
            >
              Contact Sandy
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  headerSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  paymentOption: {
    marginVertical: 5,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  paymentText: {
    marginLeft: 15,
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  bankInstructions: {
    fontSize: 15,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  bankBenefits: {
    marginTop: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  benefitText: {
    marginLeft: 10,
    fontSize: 15,
    color: theme.colors.text,
  },
  paymentButton: {
    paddingVertical: 15,
    marginVertical: 20,
  },
  helpSection: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  helpButton: {
    paddingHorizontal: 20,
  },
});

export default PaymentScreen; 