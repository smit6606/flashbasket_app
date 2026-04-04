import { createTheme, alpha } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: '#00b894', 
      light: '#55efc4',
      dark: '#00947e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c5ce7', 
      light: '#a29bfe',
      dark: '#4834d4',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00d1b2',
      light: mode === 'light' ? '#ebfffc' : alpha('#00d1b2', 0.1),
      dark: '#00947e',
    },
    warning: {
      main: '#ff9f43',
      light: mode === 'light' ? '#fff5eb' : alpha('#ff9f43', 0.1),
      dark: '#bf711d',
    },
    error: {
      main: '#ff3860',
      light: mode === 'light' ? '#feecf0' : alpha('#ff3860', 0.1),
      dark: '#cc0f35',
    },
    info: {
      main: '#0984e3',
      light: mode === 'light' ? '#e1f5fe' : alpha('#0984e3', 0.1),
      dark: '#01579b',
    },
    background: {
      default: mode === 'light' ? '#f8fafc' : '#0f172a',
      paper: mode === 'light' ? '#ffffff' : '#1e293b',
    },
    text: {
      primary: mode === 'light' ? '#1e293b' : '#f8fafc',
      secondary: mode === 'light' ? '#64748b' : '#94a3b8',
      disabled: mode === 'light' ? '#94a3b8' : '#64748b',
    },
    divider: mode === 'light' ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.8)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.025em' },
    h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.015em' },
    h4: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.005em' },
    h6: { fontSize: '1rem', fontWeight: 700 },
    subtitle1: { fontSize: '1rem', fontWeight: 600 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 600 },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: '0.01em' },
    overline: { fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(31, 41, 55, 0.04)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ...Array(18).fill('none'),
  ],
});

/**
 * Premium SaaS Theme Generator
 */
export const themeGenerator = (mode = 'light') => {
  const validMode = (mode === 'dark' || mode === 'light') ? mode : 'light';
  const tokens = getDesignTokens(validMode);
  
  return createTheme({
    ...tokens,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            transition: 'all 0.2s ease-in-out',
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${tokens.palette.primary.main} 0%, ${tokens.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${tokens.palette.primary.dark} 0%, ${tokens.palette.primary.main} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${tokens.palette.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  });
};

export default themeGenerator;
