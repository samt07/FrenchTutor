import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme, styles } from '../theme/theme';

const AboutScreen = ({ navigation }) => {
  const qualifications = [
    {
      icon: 'school-outline',
      title: 'Qualified French Instructor',
      description: 'Certified French language instructor with extensive teaching experience',
    },
    {
      icon: 'trophy-outline',
      title: 'Exam Specialist',
      description: 'Expert in preparing students for French exams across multiple education boards',
    },
    {
      icon: 'globe-outline',
      title: 'International Experience',
      description: 'Experience with curricula from India, Dubai, UK, Australia, and US',
    },
    {
      icon: 'heart-outline',
      title: 'Student-Focused Approach',
      description: 'Personalized teaching methods tailored to each student\'s learning style',
    },
  ];

  const achievements = [
    '100+ students successfully coached',
    'High exam success rate across all boards',
    'Specialized in school-level French instruction',
    'Fluent in French and English',
    'Proven track record in exam preparation',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      {/* Header Section */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={localStyles.headerSection}
      >
        <View style={localStyles.headerContent}>
          {/* Placeholder for tutor image */}
          <View style={localStyles.imageContainer}>
            <Ionicons name="person-circle" size={120} color="#fff" />
          </View>
          <Title style={localStyles.tutorName}>
            Sandhya Prasanna (Sandy)
          </Title>
          <Paragraph style={localStyles.tutorTitle}>
            French Exam Specialist & Certified Instructor
          </Paragraph>
        </View>
      </LinearGradient>

      {/* About Section */}
      <View style={localStyles.sectionContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>About Sandy</Title>
            <Paragraph style={localStyles.aboutText}>
              Welcome to my French tutoring journey! I'm Sandhya Prasanna, but everyone calls me Sandy. 
              As a passionate French language specialist, I've dedicated my career to helping school students 
              master French and excel in their exams.
            </Paragraph>
            <Paragraph style={localStyles.aboutText}>
              My mission is simple: to make French accessible, enjoyable, and successful for every student. 
              I believe that with the right guidance and personalized attention, every student can achieve 
              excellence in French, regardless of their starting level.
            </Paragraph>
          </Card.Content>
        </Card>
      </View>

      {/* Qualifications Section */}
      <View style={localStyles.sectionContainer}>
        <Title style={localStyles.sectionTitle}>
          Why Students Choose Sandy
        </Title>
        
        {qualifications.map((qual, index) => (
          <Card key={index} style={[styles.card, { marginBottom: 10 }]}>
            <Card.Content style={localStyles.qualificationCard}>
              <View style={localStyles.qualIcon}>
                <Ionicons 
                  name={qual.icon} 
                  size={28} 
                  color={theme.colors.primary} 
                />
              </View>
              <View style={localStyles.qualContent}>
                <Text style={localStyles.qualTitle}>{qual.title}</Text>
                <Text style={localStyles.qualDescription}>{qual.description}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Achievements Section */}
      <View style={localStyles.sectionContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>Track Record</Title>
            {achievements.map((achievement, index) => (
              <View key={index} style={localStyles.achievementRow}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={20} 
                  color={theme.colors.success} 
                />
                <Text style={localStyles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>

      {/* Teaching Philosophy */}
      <View style={localStyles.sectionContainer}>
        <Card style={[styles.card, { backgroundColor: theme.colors.secondary + '10' }]}>
          <Card.Content>
            <Title style={localStyles.sectionTitle}>Teaching Philosophy</Title>
            <View style={localStyles.quoteContainer}>
              <Ionicons 
                name="chatbubble-ellipses" 
                size={24} 
                color={theme.colors.secondary} 
                style={localStyles.quoteIcon}
              />
              <Text style={localStyles.quoteText}>
                "Success in French comes not just from memorizing vocabulary and grammar, 
                but from understanding the language's rhythm, culture, and beauty. My goal 
                is to help each student not just pass their exams, but truly appreciate 
                and enjoy the French language."
              </Text>
              <Text style={localStyles.quoteAuthor}>- Sandhya Prasanna</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Contact Section */}
      <View style={localStyles.sectionContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={[localStyles.sectionTitle, { textAlign: 'center' }]}>
              Ready to Excel in French?
            </Title>
            <Paragraph style={{ textAlign: 'center', marginBottom: 20 }}>
              Let's work together to achieve your French language goals!
            </Paragraph>
            
            <View style={localStyles.contactButtons}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Demo')}
                style={localStyles.contactButton}
                icon="play-circle"
              >
                Book Free Demo
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Classes')}
                style={localStyles.contactButton}
                icon="school"
              >
                View Classes
              </Button>
            </View>

            <View style={localStyles.contactInfo}>
              <View style={localStyles.contactRow}>
                <Ionicons name="mail" size={18} color={theme.colors.secondary} />
                <Text style={localStyles.contactText}>sandy.frenchtutor@gmail.com</Text>
              </View>
              <View style={localStyles.contactRow}>
                <Ionicons name="logo-whatsapp" size={18} color={theme.colors.success} />
                <Text style={localStyles.contactText}>+91 98765 43210</Text>
              </View>
            </View>
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
  imageContainer: {
    marginBottom: 20,
  },
  tutorName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tutorTitle: {
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
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
    marginBottom: 15,
    textAlign: 'justify',
  },
  qualificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  qualIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  qualContent: {
    flex: 1,
  },
  qualTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 5,
  },
  qualDescription: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 20,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  achievementText: {
    marginLeft: 10,
    fontSize: 15,
    color: theme.colors.text,
    flex: 1,
  },
  quoteContainer: {
    position: 'relative',
    paddingTop: 10,
  },
  quoteIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 15,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    textAlign: 'right',
  },
  contactButtons: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  contactButton: {
    marginVertical: 5,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 15,
    color: theme.colors.text,
  },
});

export default AboutScreen; 