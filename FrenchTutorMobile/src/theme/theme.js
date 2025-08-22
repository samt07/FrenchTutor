import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2c3e50',
    secondary: '#3498db',
    accent: '#e74c3c',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#2c3e50',
    onSurface: '#2c3e50',
    placeholder: '#95a5a6',
    backdrop: 'rgba(0,0,0,0.5)',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

export const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 8,
  },
  input: {
    marginVertical: 8,
    backgroundColor: theme.colors.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: 10,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  successText: {
    color: theme.colors.success,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
}; 