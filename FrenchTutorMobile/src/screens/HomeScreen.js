import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  const features = [
    {
      icon: 'school-outline',
      title: 'Expert French Instruction',
      description: 'Learn from Sandhya Prasanna (Sandy), a qualified French tutor with years of experience',
    },
    {
      icon: 'trophy-outline',
      title: 'Exam Excellence',
      description: 'Specialized coaching for French exams across global education boards',
    },
    {
      icon: 'globe-outline',
      title: 'International Boards',
      description: 'Covering curricula from India, Dubai, UK, Australia, and US education systems',
    },
    {
      icon: 'people-outline',
      title: 'School Students Focus',
      description: 'Tailored specifically for elementary, middle, and high school students',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={localStyles.heroSection}
      >
        <View style={localStyles.heroContent}>
          <Title style={localStyles.heroTitle}>
            Master French with Sandy
          </Title>
          <Paragraph style={localStyles.heroSubtitle}>
            Expert French tutoring for school students to excel in their French exams across all global education boards
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Classes')}
            style={[localStyles.heroButton, { backgroundColor: '#fff' }]}
            labelStyle={{ color: theme.colors.primary, fontSize: 16, fontWeight: 'bold' }}
          >
            Start Learning French
          </Button>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={localStyles.sectionContainer}>
        <Title style={localStyles.sectionTitle}>
          Why Choose Our French Tutoring?
        </Title>
        
        {features.map((feature, index) => (
          <Card key={index} style={[styles.card, { marginBottom: 15 }]}>
            <Card.Content style={localStyles.featureCard}>
              <View style={localStyles.featureIcon}>
                <Ionicons 
                  name={feature.icon} 
                  size={32} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={localStyles.featureContent}>
                <Text style={localStyles.featureTitle}>{feature.title}</Text>
                <Text style={localStyles.featureDescription}>{feature.description}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Quick Actions Section */}
      <View style={localStyles.sectionContainer}>
        <Title style={localStyles.sectionTitle}>
          Get Started Today
        </Title>
        
        <View style={localStyles.actionGrid}>
          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() => navigation.navigate('Demo')}
          >
            <Ionicons name="play-circle" size={40} color={theme.colors.secondary} />
            <Text style={localStyles.actionTitle}>Book Free Demo</Text>
            <Text style={localStyles.actionSubtitle}>Try our teaching style</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() => navigation.navigate('Classes')}
          >
            <Ionicons name="school" size={40} color={theme.colors.secondary} />
            <Text style={localStyles.actionTitle}>View Classes</Text>
            <Text style={localStyles.actionSubtitle}>See pricing & plans</Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.actionGrid}>
          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() => navigation.navigate('About')}
          >
            <Ionicons name="person-circle" size={40} color={theme.colors.secondary} />
            <Text style={localStyles.actionTitle}>About Sandy</Text>
            <Text style={localStyles.actionSubtitle}>Meet your tutor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={localStyles.actionCard}
            onPress={() => navigation.navigate('Portal')}
          >
            <Ionicons name="log-in" size={40} color={theme.colors.secondary} />
            <Text style={localStyles.actionTitle}>Student Portal</Text>
            <Text style={localStyles.actionSubtitle}>Access your account</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contact Information */}
      <Card style={[styles.card, { margin: 20, marginTop: 10 }]}>
        <Card.Content>
          <Title style={{ color: theme.colors.primary, textAlign: 'center' }}>
            Ready to Start?
          </Title>
          <Paragraph style={{ textAlign: 'center', marginBottom: 15 }}>
            Contact Sandy for personalized French tutoring
          </Paragraph>
          <View style={localStyles.contactRow}>
            <Ionicons name="mail" size={20} color={theme.colors.secondary} />
            <Text style={localStyles.contactText}>sandy.frenchtutor@gmail.com</Text>
          </View>
          <View style={localStyles.contactRow}>
            <Ionicons name="logo-whatsapp" size={20} color={theme.colors.success} />
            <Text style={localStyles.contactText}>+91 98765 43210</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  heroSection: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 350,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
    opacity: 0.9,
  },
  heroButton: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    elevation: 3,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  featureIcon: {
    marginRight: 15,
    marginTop: 5,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 20,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: theme.colors.placeholder,
    marginTop: 5,
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
    fontSize: 16,
    color: theme.colors.text,
  },
});

export default HomeScreen; 