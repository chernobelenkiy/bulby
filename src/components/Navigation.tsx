'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

// Fallback text for navigation items in case translations aren't loaded
const fallbackNavItems = {
  home: 'Home',
  app: 'App',
  myIdeas: 'My Ideas',
  signin: 'Sign In'
};

// Fallback for app name
const fallbackAppName = 'IdeaBulb';

export default function Navigation() {
  const { t, i18n, ready } = useTranslation();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {getTranslation('app.name', fallbackAppName)}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/">
                <Typography textAlign="center">{getTranslation('nav.home', fallbackNavItems.home)}</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/app">
                <Typography textAlign="center">{getTranslation('nav.app', fallbackNavItems.app)}</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu} component={Link} href="/app/my-ideas">
                <Typography textAlign="center">{getTranslation('nav.myIdeas', fallbackNavItems.myIdeas)}</Typography>
              </MenuItem>
            </Menu>
          </Box>
          
          <Typography
            variant="h5"
            noWrap
            component={Link}
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {getTranslation('app.name', fallbackAppName)}
          </Typography>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={Link}
              href="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {getTranslation('nav.home', fallbackNavItems.home)}
            </Button>
            <Button
              component={Link}
              href="/app"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {getTranslation('nav.app', fallbackNavItems.app)}
            </Button>
            <Button
              component={Link}
              href="/app/my-ideas"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {getTranslation('nav.myIdeas', fallbackNavItems.myIdeas)}
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Login button */}
            <Button 
              color="inherit"
              component={Link}
              href="/auth"
              sx={{ ml: 1 }}
            >
              {getTranslation('nav.signin', fallbackNavItems.signin)}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
} 