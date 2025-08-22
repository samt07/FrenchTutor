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
  RadioButton,
  HelperText,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';
import { apiService, validateEmail, validatePhone } from '../services/api';

const DemoScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    frenchLevel: 'complete-beginner',
    gradeLevel: 'elementary',
    preferredTimeSlot: 'morning',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const frenchLevels = [
    { value: 'complete-beginner', label: 'Complete Beginner' },
    { value: 'some-basics', label: 'Some Basics' },
    { value: 'elementary', label: 'Elementary Level' },
    { value: 'intermediate', label: 'Intermediate Level' },
  ];

  const gradeLevels = [
    { value: 'elementary', label: 'Elementary (Grades 1-5)' },
    { value: 'middle', label: 'Middle School (Grades 6-8)' },
    { value: 'high', label: 'High School (Grades 9-12)' },
  ];

  const timeSlots = [
    { value: 'morning', label: 'Morning (9:00 AM - 12:00 PM IST)' },
    { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM IST)' },
    { value: 'evening', label: 'Evening (4:00 PM - 7:00 PM IST)' },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 5 || parseInt(formData.age) > 25) {
      newErrors.age = 'Please enter a valid age (5-25)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.bookDemo({
        ...formData,
        preferredTimeSlot: timeSlots.find(slot => slot.value === formData.preferredTimeSlot)?.label,
      });

      setSuccess(true);
      Alert.alert(
        'Demo Booked Successfully! 🎉',
        'Sandy will contact you within 24 hours to confirm your demo class timing. Check your email for confirmation details.',
        [{ text: 'OK', onPress: () => {
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            frenchLevel: 'complete-beginner',
            gradeLevel: 'elementary',
            preferredTimeSlot: 'morning',
            specialRequests: '',
          });
          setSuccess(false);
        }}]
      );
    } catch (error) {
      console.error('Demo booking error:', error);
      Alert.alert(
        'Booking Failed',
        'There was an error booking your demo class. Please try again or contact us directly.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
        <Title style={[styles.title, { color: theme.colors.success, marginTop: 20 }]}>
          Demo Booked Successfully!
        </Title>
        <Paragraph style={[styles.subtitle, { textAlign: 'center' }]}>
          Sandy will contact you within 24 hours to confirm your demo class timing.
        </Paragraph>
      </View>
    );
  }

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
            <Ionicons name="play-circle" size={60} color="#fff" style={{ marginBottom: 15 }} />
            <Title style={localStyles.headerTitle}>
              Book Your Free Demo Class
            </Title>
            <Paragraph style={localStyles.headerSubtitle}>
              Experience Sandy's teaching style with a personalized 30-minute demo session
            </Paragraph>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <View style={localStyles.formContainer}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Student Information</Title>
              
              {/* Name Fields */}
              <View style={localStyles.nameRow}>
                <View style={localStyles.nameField}>
                  <TextInput
                    label="First Name *"
                    value={formData.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                    style={[styles.input, { marginRight: 10 }]}
                    error={!!errors.firstName}
                  />
                  <HelperText type="error" visible={!!errors.firstName}>
                    {errors.firstName}
                  </HelperText>
                </View>
                
                <View style={localStyles.nameField}>
                  <TextInput
                    label="Last Name *"
                    value={formData.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                    style={styles.input}
                    error={!!errors.lastName}
                  />
                  <HelperText type="error" visible={!!errors.lastName}>
                    {errors.lastName}
                  </HelperText>
                </View>
              </View>

              {/* Contact Information */}
              <TextInput
                label="Email Address *"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!errors.email}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Phone Number *"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                style={styles.input}
                keyboardType="phone-pad"
                error={!!errors.phone}
              />
              <HelperText type="error" visible={!!errors.phone}>
                {errors.phone}
              </HelperText>

              <TextInput
                label="Age *"
                value={formData.age}
                onChangeText={(text) => handleInputChange('age', text)}
                style={styles.input}
                keyboardType="numeric"
                error={!!errors.age}
              />
              <HelperText type="error" visible={!!errors.age}>
                {errors.age}
              </HelperText>
            </Card.Content>
          </Card>

          {/* French Level */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Current French Level</Title>
              <RadioButton.Group
                onValueChange={(value) => handleInputChange('frenchLevel', value)}
                value={formData.frenchLevel}
              >
                {frenchLevels.map((level) => (
                  <View key={level.value} style={localStyles.radioRow}>
                    <RadioButton value={level.value} />
                    <Paragraph style={localStyles.radioLabel}>{level.label}</Paragraph>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Grade Level */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Grade Level</Title>
              <RadioButton.Group
                onValueChange={(value) => handleInputChange('gradeLevel', value)}
                value={formData.gradeLevel}
              >
                {gradeLevels.map((grade) => (
                  <View key={grade.value} style={localStyles.radioRow}>
                    <RadioButton value={grade.value} />
                    <Paragraph style={localStyles.radioLabel}>{grade.label}</Paragraph>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Preferred Time */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Preferred Time Slot</Title>
              <RadioButton.Group
                onValueChange={(value) => handleInputChange('preferredTimeSlot', value)}
                value={formData.preferredTimeSlot}
              >
                {timeSlots.map((slot) => (
                  <View key={slot.value} style={localStyles.radioRow}>
                    <RadioButton value={slot.value} />
                    <Paragraph style={localStyles.radioLabel}>{slot.label}</Paragraph>
                  </View>
                ))}
              </RadioButton.Group>
            </Card.Content>
          </Card>

          {/* Special Requests */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Special Requests (Optional)</Title>
              <TextInput
                label="Any specific topics or concerns?"
                value={formData.specialRequests}
                onChangeText={(text) => handleInputChange('specialRequests', text)}
                style={styles.input}
                multiline
                numberOfLines={3}
              />
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={localStyles.submitButton}
            loading={loading}
            disabled={loading}
            icon="calendar-check"
          >
            {loading ? 'Booking Demo...' : 'Book Free Demo Class'}
          </Button>

          {/* Contact Info */}
          <Card style={[styles.card, { marginTop: 20 }]}>
            <Card.Content>
              <Title style={[localStyles.sectionTitle, { textAlign: 'center' }]}>
                Questions? Contact Sandy
              </Title>
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
  formContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 15,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    flex: 1,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioLabel: {
    marginLeft: 10,
    flex: 1,
    fontSize: 16,
  },
  submitButton: {
    paddingVertical: 12,
    marginTop: 20,
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
});

export default DemoScreen; 