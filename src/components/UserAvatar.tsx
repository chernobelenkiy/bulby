'use client';

import { useState } from 'react';
import { 
  Avatar, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Typography, 
  Tooltip,
  Skeleton
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// Fallback text for user menu
const fallbackUserMenu = {
  profile: 'Профиль',
  settings: 'Настройки',
  logout: 'Выйти'
};

export default function UserAvatar() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const { t, i18n, ready } = useTranslation();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  // Function to get translations with fallback
  const getTranslation = (key: string, fallback: string) => {
    if (!ready || !i18n.exists(key)) return fallback;
    return t(key);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    router.push('/');
  };

  // Show skeleton while loading
  if (isLoading) {
    return (
      <Skeleton 
        variant="circular" 
        width={40} 
        height={40} 
        animation="wave"
        sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
      />
    );
  }

  // If no user, return null (sign in button will be shown in navigation)
  if (!user) {
    return null;
  }

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="Открыть меню">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          {user.image ? (
            <Avatar 
              alt={user.name || 'User'}
              src={user.image}
              sx={{ border: '2px solid white' }}
            />
          ) : (
            <Avatar sx={{ bgcolor: 'primary.dark', border: '2px solid white' }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <PersonIcon />}
            </Avatar>
          )}
        </IconButton>
      </Tooltip>
      
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user.name || 'Пользователь'}
          </Typography>
          {user.email && (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Box>
        
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{getTranslation('user.profile', fallbackUserMenu.profile)}</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleCloseUserMenu}>
          <Typography textAlign="center">{getTranslation('user.settings', fallbackUserMenu.settings)}</Typography>
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <Typography textAlign="center" color="error">
            {getTranslation('user.logout', fallbackUserMenu.logout)}
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
} 