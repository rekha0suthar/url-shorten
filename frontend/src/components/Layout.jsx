import { Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, LoginOutlined } from '@mui/icons-material';
import { logout } from '../redux/slices/authSlice';

const Layout = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            component="h1"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Shortify
          </Typography>
          {isAuthenticated && user ? (
            <>
              <Typography
                sx={{
                  ml: 3,
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  fontWeight: 500,
                }}
              >
                {user.email.split('@')[0]}
              </Typography>
              <Button
                color="inherit"
                sx={{ minWidth: 0 }}
                onClick={handleLogout}
              >
                <LogoutOutlined />
              </Button>
            </>
          ) : (
            <Button color="inherit" onClick={handleLogin} sx={{ minWidth: 0 }}>
              <LoginOutlined />
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
