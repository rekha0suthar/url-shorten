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

  generateToken(payload) {
    return jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  async handleGoogleLogin(credential) {
    // Verify Google token
    const payload = await this.verifyGoogleToken(credential);

    // Generate JWT token
    const token = this.generateToken(payload);

    return {
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      token,
    };
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new UserService();
