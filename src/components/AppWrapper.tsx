'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SessionProvider } from 'next-auth/react';
import theme from '@/lib/theme';
import Navigation from '@/components/Navigation';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

// Initialize i18n on client side only - must import this AFTER i18n import
// But don't need a separate import statement since we're using resources directly

type AppWrapperProps = {
  children: ReactNode;
};

export default function AppWrapper({ children }: AppWrapperProps) {
  // Add state to track if i18n has been initialized
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // Initialize i18n when component mounts
  useEffect(() => {
    // Ensure i18n is available
    if (i18n.isInitialized) {
      setI18nInitialized(true);
    } else {
      // Add an initialization listener
      i18n.on('initialized', () => {
        setI18nInitialized(true);
      });
    }
  }, []);

  // Render nothing until i18n is initialized
  if (!i18nInitialized && typeof window !== 'undefined') {
    return <div style={{ visibility: 'hidden' }} />;
  }

  return (
    <SessionProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </I18nextProvider>
    </SessionProvider>
  );
} 