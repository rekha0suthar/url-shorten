import { Box, Typography, Container, Paper } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { googleLoginApi } from '../apis/index';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';

const Login = () => {
  const { login, setLoading, handleData, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // Get the state passed from the redirect (if any)

  const onSuccess = async (credentialResponse) => {
    try {
      setLoading(false);
      const { redirectAfterLogin, pendingUrlData } = location.state || {};
      const data = await googleLoginApi(credentialResponse);

      login({
        token: data.token,
        ...data.user,
      });
      navigate(redirectAfterLogin || '/');
      if (pendingUrlData) {
        handleData();
      }
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const onError = () => {
    toast.error('Google Sign-In failed. Please try again.');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 30 }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Shortify
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Sign in to manage your shortened URLs
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            >
              <GoogleLogin
                onSuccess={onSuccess}
                onError={onError}
                useOneTap
                theme="filled_blue"
                size="large"
                width="250"
                text="signin_with"
                shape="rectangular"
              />
            </GoogleOAuthProvider>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
