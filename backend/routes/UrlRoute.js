import { Router } from 'express';
import auth from '../middleware/auth.js';
import Url from '../models/UrlModel.js';
import { nanoid } from 'nanoid';
import rateLimit from 'express-rate-limit';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

const router = Router();

// URL creation rate limit
const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 requests per `window` (her
});

// API - url shorten - POST
router.post('/shorten', auth, createUrlLimiter, async (req, res) => {
  try {
    const { originalUrl, customAlias, topic } = req.body;
    const user = req.user.email;
    let alias;

    // Validate URL
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid URL' });
    }

    // Check if custom alias is provided, and it is available
    if (customAlias) {
      const existingAlias = await Url.findOne({ shortUrl: customAlias });
      if (existingAlias) {
        return res.status(400).json({ message: 'Alias already exists' });
      }
      alias = customAlias;
    }
    alias = nanoid(8);

    // Create new URL
    const newUrl = new Url({
      originalUrl,
      shortUrl: alias,
      topic,
      user,
    });

    // save URL to database
    await newUrl.save();

    res.status(201).json({ message: 'Short url created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API - url redirect - GET
// Redirect to the original URL using the alias.
// This route should be defined outside of API paths so that visiting BASE_URL/alias redirects properly.
router.get('/:alias', async (req, res) => {
  try {
    const { alias } = req.params;

    // Record click analytics
    const userAgent = new UAParser(req.headers['user-agent']);
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    const analyticsData = {
      timestamp: new Date(),
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
      os: userAgent.getOS().name,
      device: userAgent.getDevice().type || 'desktop',
      location: {
        country: geo?.country,
        city: geo?.city,
      },
    };

    // Find the URL by alias
    const url = await Url.findOneAndUpdate(
      { shortUrl: alias },
      { $push: { clicks: analyticsData } }
    );

    // If URL is not found, return 404
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// API - fetch all urls - GET
// Fetch all URLs for authenticated user with optional topic filter.

router.get('/', auth, async (req, res) => {
  try {
    const user = req.user.email;
    const { topic } = req.query;
    let query = { user };
    if (topic) {
      // filter by topic
      query.topic = topic;
    }
    const urls = await Url.find(query); // fetch all URLs
    res.status(200).json(urls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; // export the router
