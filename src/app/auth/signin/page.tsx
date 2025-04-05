import { Container, Paper, Typography, Box } from '@mui/material';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import TelegramLoginContainer from './TelegramLoginContainer';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export default async function SignInPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/');
  }

  // Get Telegram bot name from environment
  const botName = process.env.TELEGRAM_BOT_NAME;
  
  if (!botName) {
    console.error('TELEGRAM_BOT_NAME environment variable is not set');
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Sign In
        </Typography>
        
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Sign in with Telegram to continue
        </Typography>
        
        {/* Telegram login section */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <TelegramLoginContainer botName={botName || ''} />
        </Box>
      </Paper>
    </Container>
  );
} 