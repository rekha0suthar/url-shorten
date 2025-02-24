import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

class UserService {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async verifyGoogleToken(token) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  }

  async findOrCreateUser(payload) {
    const { email, name, picture } = payload;

    // Find existing user or create new one
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        provider: 'google',
      });
    }

    return user;
  }

  generateToken(user) {
    return jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async handleGoogleLogin(credential) {
    // Verify Google token
    const payload = await this.verifyGoogleToken(credential);

    // Find or create user
    const user = await this.findOrCreateUser(payload);

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token,
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ email: decoded.email });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async getUserProfile(userId) {
    const user = await User.findById(userId).select('-__v');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

export default new UserService();
