import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';
import { apiService, formatCurrency } from '../services/api';

const ClassesScreen = ({ navigation }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    try {
      const pricingData = await apiService.getPricing();
      setPricing(pricingData);
    } catch (error) {
      console.error('Failed to load pricing:', error);
      Alert.alert('Error', 'Failed to load pricing information');
    } finally {
      setLoading(false);
    }
  };

  const classPlans = [
    {
      id: 'elementary',
      title: 'Elementary School',
      subtitle: 'Ages 6-11 • Grades 1-5',
      description: 'Perfect for young learners starting their French journey. Interactive lessons designed to build strong foundations.',
      features: [
        'Basic vocabulary and pronunciation',
        'Interactive games and activities',
        'Visual learning materials',
        'Simple conversation practice',
        'Cultural introduction',
      ],
      icon: 'happy-outline',
      color: theme.colors.success,
    },
    {
      id: 'middle',
      title: 'Middle School',
      subtitle: 'Ages 11-14 • Grades 6-8',
      description: 'Comprehensive French education for growing minds. Focus on grammar, communication, and exam preparation.',
      features: [
        'Grammar fundamentals',
        'Reading comprehension',
        'Writing skills development',
        'Conversation practice',
        'Exam preparation techniques',
      ],
      icon: 'book-outline',
      color: theme.colors.secondary,
    },
    {
      id: 'high',
      title: 'High School',
      subtitle: 'Ages 14-18 • Grades 9-12',
      description: 'Advanced French coaching for academic excellence. Specialized preparation for all major education boards.',
      features: [
        'Advanced grammar and syntax',
        'Literature analysis',
        'Essay writing techniques',
        'Oral exam preparation',
        'Board-specific strategies',
      ],
      icon: 'trophy-outline',
      color: theme.colors.accent,
    },
  ];

  const educationBoards = [
    'CBSE', 'ICSE', 'IB', 'Cambridge IGCSE',
    'State Boards', 'American Curriculum',
    'British Curriculum', 'Australian Curriculum'
  ];

  const handleEnrollNow = (planId) => {
    navigation.navigate('Registration', { selectedPlan: planId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading classes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={localStyles.headerSection}
      >
        <View style={localStyles.headerContent}>
          <Title style={localStyles.headerTitle}>
            French Classes for School Students
          </Title>
          <Paragraph style={localStyles.headerSubtitle}>
            Expert tutoring tailored for your grade level and curriculum
          </Paragraph>
        </View>
      </LinearGradient>

      {/* Education Boards Section */}
      <View style={localStyles.sectionContainer}>
        <Title style={localStyles.sectionTitle}>
          Covering All Major Education Boards
        </Title>
        <View style={localStyles.boardsContainer}>
          {educationBoards.map((board, index) => (
            <Chip
              key={index}
              mode="outlined"
              style={localStyles.boardChip}
              textStyle={localStyles.boardChipText}
            >
              {board}
            </Chip>
          ))}
        </View>
      </View>

      {/* Class Plans Section */}
      <View style={localStyles.sectionContainer}>
        <Title style={localStyles.sectionTitle}>
          Choose Your Perfect Plan
        </Title>
        
        {classPlans.map((plan, index) => (
          <Card key={plan.id} style={[styles.card, localStyles.planCard]}>
            <Card.Content>
              <View style={localStyles.planHeader}>
                <View style={localStyles.planIcon}>
                  <Ionicons 
                    name={plan.icon} 
                    size={32} 
                    color={plan.color} 
                  />
                </View>
                <View style={localStyles.planTitleContainer}>
                  <Title style={localStyles.planTitle}>{plan.title}</Title>
                  <Text style={localStyles.planSubtitle}>{plan.subtitle}</Text>
                </View>
              </View>

              <Paragraph style={localStyles.planDescription}>
                {plan.description}
              </Paragraph>

              <View style={localStyles.featuresContainer}>
                <Text style={localStyles.featuresTitle}>What You'll Learn:</Text>
                {plan.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={localStyles.featureRow}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={theme.colors.success} 
                    />
                    <Text style={localStyles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <View style={localStyles.pricingContainer}>
                {pricing && pricing[plan.id] && (
                  <View style={localStyles.priceInfo}>
                    <Text style={localStyles.priceLabel}>Monthly Subscription:</Text>
                    <Text style={[localStyles.price, { color: plan.color }]}>
                      {formatCurrency(pricing[plan.id].amount)}
                    </Text>
                    <Text style={localStyles.priceDetails}>4 classes per month</Text>
                  </View>
                )}

                <Button
                  mode="contained"
                  onPress={() => handleEnrollNow(plan.id)}
                  style={[localStyles.enrollButton, { backgroundColor: plan.color }]}
                  labelStyle={localStyles.enrollButtonText}
                >
                  Enroll Now
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* What's Included Section */}
      <View style={localStyles.sectionContainer}>
        <Card style={[styles.card, { backgroundColor: theme.colors.secondary + '10' }]}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>
              Every Plan Includes:
            </Title>
            
            <View style={localStyles.includedGrid}>
              <View style={localStyles.includedItem}>
                <Ionicons name="person" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>1-on-1 Personal Attention</Text>
              </View>
              
              <View style={localStyles.includedItem}>
                <Ionicons name="calendar" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>Flexible Scheduling</Text>
              </View>
              
              <View style={localStyles.includedItem}>
                <Ionicons name="document-text" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>Study Materials</Text>
              </View>
              
              <View style={localStyles.includedItem}>
                <Ionicons name="trophy" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>Exam Preparation</Text>
              </View>
              
              <View style={localStyles.includedItem}>
                <Ionicons name="chatbubbles" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>WhatsApp Support</Text>
              </View>
              
              <View style={localStyles.includedItem}>
                <Ionicons name="shield-checkmark" size={24} color={theme.colors.secondary} />
                <Text style={localStyles.includedText}>Progress Tracking</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* CTA Section */}
      <View style={localStyles.sectionContainer}>
        <Card style={styles.card}>
          <Card.Content style={localStyles.ctaContent}>
            <Title style={[localStyles.sectionTitle, { textAlign: 'center' }]}>
              Start Your French Journey Today!
            </Title>
            <Paragraph style={{ textAlign: 'center', marginBottom: 20 }}>
              Book a free demo class and see why students love learning French with Sandy
            </Paragraph>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Demo')}
              style={localStyles.demoButton}
              icon="play-circle"
            >
              Book Free Demo Class
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
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  boardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  boardChip: {
    margin: 3,
  },
  boardChipText: {
    fontSize: 12,
  },
  planCard: {
    marginBottom: 20,
    elevation: 4,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  planIcon: {
    marginRight: 15,
  },
  planTitleContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  planSubtitle: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  planDescription: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 15,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
  pricingContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.placeholder + '40',
    paddingTop: 15,
  },
  priceInfo: {
    alignItems: 'center',
    marginBottom: 15,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
    marginBottom: 5,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceDetails: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  enrollButton: {
    paddingVertical: 8,
  },
  enrollButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  includedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  includedItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  includedText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
  },
  ctaContent: {
    alignItems: 'center',
  },
  demoButton: {
    paddingHorizontal: 20,
  },
});

export default ClassesScreen; 