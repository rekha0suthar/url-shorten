import { nanoid } from 'nanoid';
import Url from '../models/UrlModel.js';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

class UrlService {
  async generateUniqueAlias(customAlias = null) {
    let alias = customAlias;
    let exists = true;

    // If custom alias is provided, check if it exists
    if (alias) {
      exists = await Url.exists({ shortUrl: alias });
      if (exists) {
        throw new Error('Alias already exists');
      }
      return alias;
    }

    // Generate unique nanoid if no custom alias
    while (exists) {
      alias = nanoid(8);
      exists = await Url.exists({ shortUrl: alias });
    }

    return alias;
  }

  async validateUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }

  async createShortUrl(originalUrl, customAlias, topic, user, protocol, host) {
    // Validate URL
    await this.validateUrl(originalUrl);

    // Check if URL already exists for this user
    const existingUrl = await Url.findOne({ originalUrl, user });
    if (existingUrl) {
      const fullShortUrl = `${protocol}://${host}/api/shorten/${existingUrl.shortUrl}`;
      return {
        shortUrl: fullShortUrl,
        createdAt: existingUrl.createdAt,
        isExisting: true,
      };
    }

    // Generate unique alias
    const alias = await this.generateUniqueAlias(customAlias);

    // Create new URL
    const newUrl = new Url({
      originalUrl,
      shortUrl: alias,
      topic,
      user,
    });

    await newUrl.save();

    const fullShortUrl = `${protocol}://${host}/api/shorten/${alias}`;
    return {
      shortUrl: fullShortUrl,
      createdAt: newUrl.createdAt,
      isExisting: false,
    };
  }

  async recordClick(alias, req) {
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

    // Use findOneAndUpdate with upsert for atomic operation
    const url = await Url.findOneAndUpdate(
      { shortUrl: alias },
      {
        $push: {
          clicks: {
            $each: [analyticsData],
            $position: 0, // Add new clicks at the beginning of the array
          },
        },
      },
      { new: true }
    );

    return url;
  }

  async getUrlsByUser(user, page = 1, limit = 7) {
    const query = { user };
    const options = {
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit),
    };

    // Use Promise.all for parallel execution
    const [urls, total] = await Promise.all([
      Url.find(query)
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .lean(), // Use lean() for better performance
      Url.countDocuments(query),
    ]);

    return {
      urls,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    };
  }

  async getUrlAnalytics(urlId) {
    // Aggregate analytics at the database level
    const analytics = await Url.aggregate([
      { $match: { _id: urlId } },
      { $unwind: '$clicks' },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$clicks.ipAddress' },
          devices: { $addToSet: '$clicks.device' },
          countries: { $addToSet: '$clicks.location.country' },
          clicksByDay: {
            $push: {
              timestamp: '$clicks.timestamp',
              ipAddress: '$clicks.ipAddress',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalClicks: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          devices: 1,
          countries: 1,
          clicksByDay: 1,
        },
      },
    ]);

    return (
      analytics[0] || {
        totalClicks: 0,
        uniqueUsers: 0,
        devices: [],
        countries: [],
        clicksByDay: [],
      }
    );
  }
}

export default new UrlService();
