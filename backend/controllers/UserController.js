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

const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message || 'User not found' });
  }
};

const checkAuthStatus = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export { googleLogin, getProfile, checkAuthStatus };
