import { nanoid } from 'nanoid';
import Url from '../models/UrlModel.js';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import redisClient from '../redisClient.js';
// Shorten URL controller
const shortUrl = async (req, res) => {
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
    } else {
      alias = nanoid(8);
    }

    // Create new URL
    const newUrl = new Url({
      originalUrl,
      shortUrl: alias,
      topic,
      user,
    });

    // save URL to database
    await newUrl.save();

    // Construct the full short URL dynamically.
    const protocol = req.protocol;
    const host = req.get('host');
    const fullShortUrl = `${protocol}://${host}/api/shorten/${alias}`;

    res.status(201).json({
      shortUrl: fullShortUrl,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
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

    // Check if the URL is cached in Redis
    const cachedUrl = await redisClient.get(`shortUrl:${alias}`);
    if (cachedUrl) {
      return res.redirect(cachedUrl);
    }

    // Find the URL by alias
    const url = await Url.findOneAndUpdate(
      { shortUrl: alias },
      { $push: { clicks: analyticsData } }
    );

    // If URL is not found, return 404
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Cache the URL in Redis
    await redisClient.set(`shortUrl:${alias}`, url.originalUrl, {
      EX: 3600, // Cache for 1 hour
    });

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUrls = async (req, res) => {
  try {
    const user = req.user.email;
    let { page = 1, limit = 7 } = req.query;

    let query = { user };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 }, // Optional: sort by creation date descending
    };

    const urls = await Url.find(query)
      .sort(options.sort)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Url.countDocuments(query);

    res.status(200).json({
      urls,
      total,
      page: options.page,
      pages: Math.ceil(total / options.limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { shortUrl, redirectUrl, getUrls };
