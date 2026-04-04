import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { themeGenerator } from '../theme';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  return useContext(ColorModeContext);
}

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('admin_theme_mode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('admin_theme_mode', newMode);
          return newMode;
        });
      },
    }),
    []
  );

  // Generate theme object - explicitly ensuring it's an object
  const theme = useMemo(() => {
    const generatedTheme = themeGenerator(mode);
    return generatedTheme;
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
