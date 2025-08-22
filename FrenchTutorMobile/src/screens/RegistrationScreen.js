import React, { useState, useEffect } from 'react';
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
  Checkbox,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';
import { apiService, validateEmail, validatePhone, formatCurrency } from '../services/api';

const RegistrationScreen = ({ route, navigation }) => {
  const { selectedPlan } = route.params || {};
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    frenchLevel: 'complete-beginner',
    gradeLevel: selectedPlan || 'elementary',
    preferredTimeSlot: 'morning',
    startDate: '',
    paymentMethod: 'card',
    terms: false,
    confirmation: false,
  });

  const [pricing, setPricing] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const pricingData = await apiService.getPricing();
      setPricing(pricingData);
    } catch (error) {
      console.error('Failed to load pricing:', error);
    }
  };

  const frenchLevels = [
    { value: 'complete-beginner', label: 'Complete Beginner' },
    { value: 'some-basics', label: 'Some Basics' },
    { value: 'elementary', label: 'Elementary Level' },
    { value: 'intermediate', label: 'Intermediate Level' },
  ];

  const gradeLevels = [
    { value: 'elementary', label: 'Elementary School (Grades 1-5)' },
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

    if (!formData.terms) {
      newErrors.terms = 'Please accept the terms and conditions';
    }

    if (!formData.confirmation) {
      newErrors.confirmation = 'Please confirm your registration details';
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
      Alert.alert('Please Fix Errors', 'Please correct the highlighted errors before proceeding.');
      return;
    }

    navigation.navigate('Payment', { registrationData: formData });
  };

  const getCurrentPrice = () => {
    if (pricing && pricing[formData.gradeLevel]) {
      return pricing[formData.gradeLevel].amount;
    }
    return 0;
  };

  const getPlanName = () => {
    const gradeLevel = formData.gradeLevel;
    return `${gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)} School Plan`;
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Form Sections */}
        <View style={localStyles.formContainer}>
          {/* Personal Information */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>Personal Information</Title>
              
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

              <View style={localStyles.nameRow}>
                <View style={localStyles.nameField}>
                  <TextInput
                    label="Age *"
                    value={formData.age}
                    onChangeText={(text) => handleInputChange('age', text)}
                    style={[styles.input, { marginRight: 10 }]}
                    keyboardType="numeric"
                    error={!!errors.age}
                  />
                  <HelperText type="error" visible={!!errors.age}>
                    {errors.age}
                  </HelperText>
                </View>
                
                <View style={localStyles.nameField}>
                  <TextInput
                    label="Occupation (Optional)"
                    value={formData.occupation}
                    onChangeText={(text) => handleInputChange('occupation', text)}
                    style={styles.input}
                  />
                </View>
              </View>
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
              <Title style={localStyles.sectionTitle}>Grade Level & Plan</Title>
              <RadioButton.Group
                onValueChange={(value) => handleInputChange('gradeLevel', value)}
                value={formData.gradeLevel}
              >
                {gradeLevels.map((grade) => (
                  <View key={grade.value} style={localStyles.radioRow}>
                    <RadioButton value={grade.value} />
                    <View style={localStyles.gradeContent}>
                      <Paragraph style={localStyles.radioLabel}>{grade.label}</Paragraph>
                      {pricing && pricing[grade.value] && (
                        <Paragraph style={localStyles.priceLabel}>
                          {formatCurrency(pricing[grade.value].amount)}/month
                        </Paragraph>
                      )}
                    </View>
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

          {/* Start Date */}
          <Card style={styles.card}>
            <Card.Content>
              <Title style={localStyles.sectionTitle}>When would you like to start?</Title>
              <TextInput
                label="Preferred Start Date (Optional)"
                value={formData.startDate}
                onChangeText={(text) => handleInputChange('startDate', text)}
                style={styles.input}
                placeholder="e.g., Next Monday, January 15th, etc."
              />
            </Card.Content>
          </Card>

          {/* Summary */}
          {pricing && (
            <Card style={[styles.card, { backgroundColor: theme.colors.secondary + '10' }]}>
              <Card.Content>
                <Title style={localStyles.sectionTitle}>Registration Summary</Title>
                <View style={localStyles.summaryRow}>
                  <Paragraph style={localStyles.summaryLabel}>Selected Plan:</Paragraph>
                  <Paragraph style={localStyles.summaryValue}>{getPlanName()}</Paragraph>
                </View>
                <View style={localStyles.summaryRow}>
                  <Paragraph style={localStyles.summaryLabel}>Classes per Month:</Paragraph>
                  <Paragraph style={localStyles.summaryValue}>4 classes</Paragraph>
                </View>
                <View style={localStyles.summaryRow}>
                  <Paragraph style={localStyles.summaryLabel}>Monthly Amount:</Paragraph>
                  <Paragraph style={[localStyles.summaryValue, localStyles.priceValue]}>
                    {formatCurrency(getCurrentPrice())}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          )}

          {/* Terms and Conditions */}
          <Card style={styles.card}>
            <Card.Content>
              <View style={localStyles.checkboxRow}>
                <Checkbox
                  status={formData.terms ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange('terms', !formData.terms)}
                />
                <Paragraph style={localStyles.checkboxLabel}>
                  I agree to the terms and conditions of the French tutoring service *
                </Paragraph>
              </View>
              <HelperText type="error" visible={!!errors.terms}>
                {errors.terms}
              </HelperText>

              <View style={localStyles.checkboxRow}>
                <Checkbox
                  status={formData.confirmation ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange('confirmation', !formData.confirmation)}
                />
                <Paragraph style={localStyles.checkboxLabel}>
                  I confirm that the above information is correct and I'm ready to proceed with payment *
                </Paragraph>
              </View>
              <HelperText type="error" visible={!!errors.confirmation}>
                {errors.confirmation}
              </HelperText>
            </Card.Content>
          </Card>

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={localStyles.submitButton}
            loading={loading}
            disabled={loading}
            icon="arrow-right"
          >
            Proceed to Payment
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
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
  gradeContent: {
    flex: 1,
    marginLeft: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  priceValue: {
    fontSize: 20,
    color: theme.colors.secondary,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  checkboxLabel: {
    marginLeft: 10,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  submitButton: {
    paddingVertical: 12,
    marginTop: 20,
  },
});

export default RegistrationScreen; 