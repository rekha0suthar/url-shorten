import userService from '../services/userService.js';

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    const result = await userService.handleGoogleLogin(token);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: error.message || 'Authentication failed' });
  }
};

const checkAuthStatus = async (req, res) => {
  try {
    // req.user is already verified by the auth middleware
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export { googleLogin, checkAuthStatus };
