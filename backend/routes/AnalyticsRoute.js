import { Router } from 'express';
import Url from '../models/UrlModel.js';
import auth from '../middleware/auth.js';
import {
  osAndDeviceAnalytics,
  urlWeekStats,
  weekStats,
} from '../utils/index.js';

const router = Router();

// API - fetch overall analytics - GET
router.get('/overall', auth, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.email });

    const { clicksInWeek, uniqueUsers, totalClicks, totalUrls } =
      weekStats(urls);

    // OS and device analytics
    let osStats = {};
    let deviceStats = {};

    urls.forEach((url) => {
      url.clicks.forEach((click) => {
        // OS Stats
        if (!osStats[click.os]) {
          osStats[click.os] = {
            uniqueClicks: new Set(),
            uniqueUsers: new Set(),
          };
        }
        osStats[click.os].uniqueClicks.add(click.timestamp);
        osStats[click.os].uniqueUsers.add(click.ipAddress);

        // Device Stats
        if (!deviceStats[click.device]) {
          deviceStats[click.device] = {
            uniqueClicks: new Set(),
            uniqueUsers: new Set(),
          };
        }
        deviceStats[click.device].uniqueClicks.add(click.timestamp);
        deviceStats[click.device].uniqueUsers.add(click.ipAddress);
      });
    });

    const { osAnalytics, deviceAnalytics } = osAndDeviceAnalytics(
      osStats,
      deviceStats
    );

    res.status(200).json({
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksInWeek: Object.entries(clicksInWeek).map(([date, count]) => ({
        date,
        count,
      })),
      osType: osAnalytics,
      deviceType: deviceAnalytics,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API - fetch topic specific analytics - GET
router.get('/topic/:topic', auth, async (req, res) => {
  try {
    const { topic } = req.params;

    const urls = await Url.find({ topic, user: req.user.email });

    const { clicksInWeek, uniqueUsers, totalClicks } = weekStats(urls);

    // URL - specific stats
    const urlsStats = urls.map((url) => ({
      shortUrl: `${process.env.BASE_URL}/${url.shortUrl}`,
      totalClicks: url.clicks.length,
      uniqueUsers: new Set(url.clicks.map((click) => click.ipAddress)).size,
    }));

    res.status(200).json({
      totalClicks,
      uniqueUsers,
      clicksInWeek: Object.entries(clicksInWeek).map(([date, count]) => ({
        date,
        count,
      })),
      urls: urlsStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// API - short URL specific analytics - GET
router.get('/:shortUrl', auth, async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl, user: req.user.email });

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const { clicksInWeek, uniqueUsers, totalClicks } = urlWeekStats(url);

    // OS analytics
    const osStats = url.clicks.reduce((acc, click) => {
      if (!acc[click.os]) {
        acc[click.os] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      acc[click.os].uniqueClicks.add(click.timestamp);
      acc[click.os].uniqueUsers.add(click.ipAddress);
      return acc;
    }, {});

    // Device analytics
    const deviceStats = url.clicks.reduce((acc, click) => {
      if (!acc[click.device]) {
        acc[click.device] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      acc[click.device].uniqueClicks.add(click.timestamp);
      acc[click.device].uniqueUsers.add(click.ipAddress);
      return acc;
    }, {});

    res.status(200).json({
      totalClicks,
      uniqueUsers,
      clicksInWeek: Object.entries(clicksInWeek).map(([date, count]) => ({
        date,
        count,
      })),
      osStats: Object.entries(osStats).map(([os, stats]) => ({
        os,
        uniqueClicks: stats.uniqueClicks.size,
        uniqueUsers: stats.uniqueUsers.size,
      })),
      deviceStats: Object.entries(deviceStats).map(([device, stats]) => ({
        device,
        uniqueClicks: stats.uniqueClicks.size,
        uniqueUsers: stats.uniqueUsers.size,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
