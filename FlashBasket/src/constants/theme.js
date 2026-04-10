export const COLORS = {
  primary: '#00b894', // Zepto Green
  secondary: '#ff7675',
  accent: '#fdcb6e',
  
  // Light Theme
  light: {
    primary: '#00b894',
    secondary: '#ff7675',
    accent: '#fdcb6e',
    background: '#FFFFFF', // Clean White
    surface: '#ffffff',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#636e72',
    textTertiary: '#b2bec3',
    border: '#E2E8F0',
    white: '#ffffff',
    primaryLight: '#e6f8f4',
    error: '#d63031',
    textOnPrimary: '#ffffff',
  },
  
  // Dark Theme (Premium Deep Dark)
  dark: {
    primary: '#00b894',
    secondary: '#ff7675',
    accent: '#fdcb6e',
    background: '#0F0F0F', // Deeper background
    surface: '#1A1A1A', // Layered surface
    card: '#202020', // Card surface
    text: '#FFFFFF',
    textSecondary: '#BBBBBB', // Higher contrast secondary text
    textTertiary: '#636e72',
    border: '#2A2A2A', // Subtle borders
    white: '#ffffff',
    primaryLight: '#004d3d',
    error: '#ff4d4d',
    textOnPrimary: '#ffffff',
  },
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
};

export const FONT = {
  bold: 'bold',
  medium: '600',
  regular: '400',
};

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
};

const theme = {
  light: {
    colors: COLORS.light,
    spacing: SPACING,
    typography: FONT,
    shadows: SHADOWS,
  },
  dark: {
    colors: COLORS.dark,
    spacing: SPACING,
    typography: FONT,
    shadows: SHADOWS,
  },
};

export default theme;
