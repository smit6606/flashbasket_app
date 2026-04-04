export const COLORS = {
  primary: '#00b894', // Zepto Green
  secondary: '#ff7675',
  accent: '#fdcb6e',
  
  // Light Theme
  light: {
    primary: '#00b894',
    secondary: '#ff7675',
    accent: '#fdcb6e',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#2d3436',
    textSecondary: '#636e72',
    textTertiary: '#b2bec3',
    border: '#dfe6e9',
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
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b2bec3',
    textTertiary: '#636e72',
    border: '#2d3436',
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
