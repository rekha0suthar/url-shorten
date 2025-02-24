import { Box, Typography, Container, Paper } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { googleLoginApi } from '../apis/index';
import { useNavigate, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { loginUser } from '../redux/slices/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const onSuccess = async (credentialResponse) => {
    try {
      const { redirectAfterLogin } = location.state || {};
      const response = await googleLoginApi(credentialResponse);

      await dispatch(loginUser(response)).unwrap();
      navigate(redirectAfterLogin || '/');
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
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
