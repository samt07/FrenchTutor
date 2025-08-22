import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
  HelperText,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';
import { apiService, validateEmail, formatCurrency } from '../services/api';

const StudentPortalScreen = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    subscriptionId: '',
  });

  const [studentData, setStudentData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!loginData.subscriptionId.trim()) {
      newErrors.subscriptionId = 'Subscription ID is required';
    } else if (!loginData.subscriptionId.startsWith('sub_')) {
      newErrors.subscriptionId = 'Please enter a valid subscription ID (starts with "sub_")';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.studentLogin(loginData.email, loginData.subscriptionId);
      
      if (response.success) {
        setStudentData({
          student: response.student,
          subscription: response.subscription
        });
        Alert.alert('Login Successful', 'Welcome to your student portal!');
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Student login error:', error);
      Alert.alert(
        'Login Failed',
        'Unable to log in. Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setStudentData(null);
            setLoginData({ email: '', subscriptionId: '' });
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.colors.success;
      case 'incomplete':
      case 'past_due':
        return theme.colors.warning;
      case 'canceled':
      case 'unpaid':
        return theme.colors.error;
      default:
        return theme.colors.placeholder;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active ✓';
      case 'incomplete':
        return 'Payment Incomplete';
      case 'past_due':
        return 'Payment Past Due';
      case 'canceled':
        return 'Canceled';
      case 'unpaid':
        return 'Unpaid';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // If student is logged in, show dashboard
  if (studentData) {
    const { student, subscription } = studentData;

    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Welcome Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={localStyles.headerSection}
        >
          <View style={localStyles.headerContent}>
            <Ionicons name="person-circle" size={80} color="#fff" style={{ marginBottom: 15 }} />
            <Title style={localStyles.headerTitle}>
              Welcome, {student.firstName}!
            </Title>
            <Paragraph style={localStyles.headerSubtitle}>
              Your French Learning Dashboard
            </Paragraph>
          </View>
        </LinearGradient>

        {/* Student Information */}
        <View style={localStyles.contentContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Student Information</Title>
              <View style={localStyles.infoRow}>
                <Ionicons name="person" size={20} color={theme.colors.primary} />
                <Paragraph style={localStyles.infoText}>
                  {student.firstName} {student.lastName}
                </Paragraph>
              </View>
              <View style={localStyles.infoRow}>
                <Ionicons name="mail" size={20} color={theme.colors.primary} />
                <Paragraph style={localStyles.infoText}>{student.email}</Paragraph>
              </View>
              <View style={localStyles.infoRow}>
                <Ionicons name="school" size={20} color={theme.colors.primary} />
                <Paragraph style={localStyles.infoText}>
                  {student.gradeLevel.charAt(0).toUpperCase() + student.gradeLevel.slice(1)} School
                </Paragraph>
              </View>
              <View style={localStyles.infoRow}>
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Paragraph style={localStyles.infoText}>
                  Registered: {new Date(student.registrationDate).toLocaleDateString()}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>

          {/* Subscription Details */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Subscription Details</Title>
              
              <View style={localStyles.subscriptionHeader}>
                <View>
                  <Paragraph style={localStyles.planName}>{subscription.planName}</Paragraph>
                  <Paragraph style={localStyles.planPrice}>
                    {formatCurrency(subscription.monthlyAmount)} / month
                  </Paragraph>
                </View>
                <View style={[localStyles.statusBadge, { backgroundColor: getStatusColor(subscription.status) + '20' }]}>
                  <Paragraph style={[localStyles.statusText, { color: getStatusColor(subscription.status) }]}>
                    {getStatusText(subscription.status)}
                  </Paragraph>
                </View>
              </View>

              <Divider style={{ marginVertical: 15 }} />

              <View style={localStyles.subscriptionDetails}>
                <View style={localStyles.detailRow}>
                  <Paragraph style={localStyles.detailLabel}>Subscription ID:</Paragraph>
                  <Paragraph style={localStyles.detailValue}>{subscription.id}</Paragraph>
                </View>
                <View style={localStyles.detailRow}>
                  <Paragraph style={localStyles.detailLabel}>Classes per Month:</Paragraph>
                  <Paragraph style={localStyles.detailValue}>4 classes</Paragraph>
                </View>
                <View style={localStyles.detailRow}>
                  <Paragraph style={localStyles.detailLabel}>Grade Level:</Paragraph>
                  <Paragraph style={localStyles.detailValue}>
                    {subscription.gradeLevel.charAt(0).toUpperCase() + subscription.gradeLevel.slice(1)}
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Quick Actions */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Quick Actions</Title>
              
              <Button
                mode="outlined"
                icon="calendar"
                style={localStyles.actionButton}
                onPress={() => Alert.alert('Feature Coming Soon', 'Class scheduling will be available soon!')}
              >
                Schedule Next Class
              </Button>
              
              <Button
                mode="outlined"
                icon="book-open"
                style={localStyles.actionButton}
                onPress={() => Alert.alert('Feature Coming Soon', 'Study materials will be available soon!')}
              >
                View Study Materials
              </Button>
              
              <Button
                mode="outlined"
                icon="chat"
                style={localStyles.actionButton}
                onPress={() => Alert.alert('Contact Sandy', 'WhatsApp: +91 98765 43210\nEmail: sandy.frenchtutor@gmail.com')}
              >
                Contact Sandy
              </Button>
            </Card.Content>
          </Card>

          {/* Logout Button */}
          <Button
            mode="contained"
            onPress={handleLogout}
            style={localStyles.logoutButton}
            icon="logout"
            buttonColor={theme.colors.error}
          >
            Logout
          </Button>
        </View>
      </ScrollView>
    );
  }

  // Login Form
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header Section */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={localStyles.headerSection}
        >
          <View style={localStyles.headerContent}>
            <Ionicons name="log-in" size={60} color="#fff" style={{ marginBottom: 15 }} />
            <Title style={localStyles.headerTitle}>
              Student Portal
            </Title>
            <Paragraph style={localStyles.headerSubtitle}>
              Access your French learning dashboard
            </Paragraph>
          </View>
        </LinearGradient>

        {/* Login Form */}
        <View style={localStyles.contentContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Login to Your Account</Title>
              <Paragraph style={localStyles.loginInstructions}>
                Enter the email and subscription ID from your registration confirmation email.
              </Paragraph>

              <TextInput
                label="Email Address *"
                value={loginData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
                left={<TextInput.Icon icon="mail" />}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Subscription ID *"
                value={loginData.subscriptionId}
                onChangeText={(text) => handleInputChange('subscriptionId', text)}
                style={styles.input}
                autoCapitalize="none"
                error={!!errors.subscriptionId}
                left={<TextInput.Icon icon="key" />}
                placeholder="sub_xxxxxxxxxxxxxxxxxx"
              />
              <HelperText type="error" visible={!!errors.subscriptionId}>
                {errors.subscriptionId}
              </HelperText>

              <Button
                mode="contained"
                onPress={handleLogin}
                style={localStyles.loginButton}
                loading={loading}
                disabled={loading}
                icon="login"
              >
                {loading ? 'Logging in...' : 'Access My Portal'}
              </Button>
            </Card.Content>
          </Card>

          {/* Help Section */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Need Help?</Title>
              <Paragraph style={localStyles.helpText}>
                Can't find your subscription ID? Check your registration confirmation email or contact Sandy.
              </Paragraph>
              
              <View style={localStyles.contactRow}>
                <Ionicons name="mail" size={20} color={theme.colors.secondary} />
                <Paragraph style={localStyles.contactText}>sandy.frenchtutor@gmail.com</Paragraph>
              </View>
              <View style={localStyles.contactRow}>
                <Ionicons name="logo-whatsapp" size={20} color={theme.colors.success} />
                <Paragraph style={localStyles.contactText}>+91 98765 43210</Paragraph>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  loginInstructions: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 20,
    textAlign: 'center',
  },
  loginButton: {
    paddingVertical: 12,
    marginTop: 20,
  },
  helpText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 10,
    fontSize: 15,
  },
  // Dashboard styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  planPrice: {
    fontSize: 16,
    color: theme.colors.secondary,
    marginTop: 5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  subscriptionDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  actionButton: {
    marginVertical: 5,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
  },
});

export default StudentPortalScreen; 