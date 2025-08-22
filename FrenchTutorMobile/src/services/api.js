import axios from 'axios';

// Base URL for your backend API
// Update this to match your Railway deployment URL
const BASE_URL = 'https://www.reussirfrench.in/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Demo booking
  bookDemo: async (demoData) => {
    try {
      const response = await api.post('/book-demo', demoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Student registration
  registerStudent: async (registrationData) => {
    try {
      const response = await api.post('/register', registrationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create subscription setup intent
  createSubscriptionIntent: async (registrationData) => {
    try {
      const response = await api.post('/create-subscription-intent', {
        registrationData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Confirm subscription
  confirmSubscription: async (setupIntentId, registrationData) => {
    try {
      const response = await api.post('/confirm-subscription', {
        setupIntentId,
        registrationData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Student portal login
  studentLogin: async (email, subscriptionId) => {
    try {
      const response = await api.post('/student-login', {
        email,
        subscriptionId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create bank transfer payment
  createBankTransferPayment: async (registrationData) => {
    try {
      const response = await api.post('/create-bank-transfer-payment', {
        registrationData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get pricing information
  getPricing: async () => {
    try {
      // This endpoint might not exist yet, but we'll structure the data
      return {
        elementary: { amount: 5500, currency: 'inr', description: 'Elementary School Plan' },
        middle: { amount: 6500, currency: 'inr', description: 'Middle School Plan' },
        high: { amount: 7500, currency: 'inr', description: 'High School Plan' }
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

// Helper function to format currency
export const formatCurrency = (amount, currency = 'INR') => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount / 100); // Convert from paise to rupees
};

// Helper function to validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export default api; 