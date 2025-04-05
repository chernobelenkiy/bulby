'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Paper, Typography, TextField, Button, Box, Link } from '@mui/material';

// Add fallback translations for auth page
const fallbackText = {
  auth: {
    signin: "Sign In",
    signinSubtitle: "Sign in to your account",
    email: "Email",
    password: "Password",
    submit: "Submit",
    signup: "Sign Up",
    signupSubtitle: "Create a new account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?"
  }
};

export default function AuthForm() {
  const { t, i18n, ready } = useTranslation();
  const [isSignIn, setIsSignIn] = useState(true);
  
  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isSignIn 
            ? getTranslation('auth.signin', fallbackText.auth.signin)
            : getTranslation('auth.signup', fallbackText.auth.signup)
          }
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary" sx={{ mb: 3 }}>
          {isSignIn 
            ? getTranslation('auth.signinSubtitle', fallbackText.auth.signinSubtitle)
            : getTranslation('auth.signupSubtitle', fallbackText.auth.signupSubtitle)
          }
        </Typography>
        
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={getTranslation('auth.email', fallbackText.auth.email)}
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={getTranslation('auth.password', fallbackText.auth.password)}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {getTranslation('auth.submit', fallbackText.auth.submit)}
          </Button>
          <Box textAlign="center">
            <Link component="button" variant="body2" onClick={toggleAuthMode}>
              {isSignIn 
                ? getTranslation('auth.noAccount', fallbackText.auth.noAccount) 
                : getTranslation('auth.haveAccount', fallbackText.auth.haveAccount)
              }
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
} 