import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import AboutScreen from './src/screens/AboutScreen';
import ClassesScreen from './src/screens/ClassesScreen';
import DemoScreen from './src/screens/DemoScreen';
import StudentPortalScreen from './src/screens/StudentPortalScreen';
import RegistrationScreen from './src/screens/RegistrationScreen';
import PaymentScreen from './src/screens/PaymentScreen';

// Import theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Registration Flow
function RegistrationStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="ClassesMain" 
        component={ClassesScreen} 
        options={{ title: 'French Classes' }}
      />
      <Stack.Screen 
        name="Registration" 
        component={RegistrationScreen} 
        options={{ title: 'Register for Classes' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen} 
        options={{ title: 'Payment' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Classes') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Demo') {
            iconName = focused ? 'play-circle' : 'play-circle-outline';
          } else if (route.name === 'Portal') {
            iconName = focused ? 'log-in' : 'log-in-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Classes" 
        component={RegistrationStack} 
        options={{ title: 'Classes', headerShown: false }}
      />
      <Tab.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'About Sandy' }}
      />
      <Tab.Screen 
        name="Demo" 
        component={DemoScreen} 
        options={{ title: 'Book Demo' }}
      />
      <Tab.Screen 
        name="Portal" 
        component={StudentPortalScreen} 
        options={{ title: 'Student Portal' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor={theme.colors.primary} />
        <MainTabs />
      </NavigationContainer>
    </PaperProvider>
  );
} 