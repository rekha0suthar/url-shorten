import Url from '../models/UrlModel.js';

class AnalyticsService {
  async getOverallAnalytics(user) {
    const analytics = await Url.aggregate([
      { $match: { user } },
      {
        $facet: {
          totalUrls: [{ $count: 'count' }],
          clickStats: [
            { $unwind: '$clicks' },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$clicks.ipAddress' },
                devices: { $addToSet: '$clicks.device' },
                countries: { $addToSet: '$clicks.location.country' },
              },
            },
          ],
          topUrls: [
            { $unwind: '$clicks' },
            {
              $group: {
                _id: '$shortUrl',
                originalUrl: { $first: '$originalUrl' },
                clicks: { $sum: 1 },
              },
            },
            { $sort: { clicks: -1 } },
            { $limit: 5 },
          ],
          clicksByDay: [
            { $unwind: '$clicks' },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$clicks.timestamp',
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
      {
        $project: {
          totalUrls: { $arrayElemAt: ['$totalUrls.count', 0] },
          totalClicks: { $arrayElemAt: ['$clickStats.totalClicks', 0] },
          uniqueUsers: {
            $size: { $arrayElemAt: ['$clickStats.uniqueUsers', 0] },
          },
          devices: { $arrayElemAt: ['$clickStats.devices', 0] },
          countries: { $arrayElemAt: ['$clickStats.countries', 0] },
          topUrls: 1,
          clicksByDay: 1,
        },
      },
    ]);

    return (
      analytics[0] || {
        totalUrls: 0,
        totalClicks: 0,
        uniqueUsers: 0,
        devices: [],
        countries: [],
        topUrls: [],
        clicksByDay: [],
      }
    );
  }

  async getTopicAnalytics(user, topic) {
    const analytics = await Url.aggregate([
      { $match: { user, topic } },
      {
        $facet: {
          urlCount: [{ $count: 'count' }],
          clickStats: [
            { $unwind: '$clicks' },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$clicks.ipAddress' },
                devices: { $addToSet: '$clicks.device' },
                countries: { $addToSet: '$clicks.location.country' },
              },
            },
          ],
          clicksByDay: [
            { $unwind: '$clicks' },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$clicks.timestamp',
                  },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          urlList: [
            {
              $project: {
                shortUrl: 1,
                originalUrl: 1,
                createdAt: 1,
                clickCount: { $size: '$clicks' },
              },
            },
            { $sort: { clickCount: -1 } },
          ],
        },
      },
      {
        $project: {
          urlCount: { $arrayElemAt: ['$urlCount.count', 0] },
          totalClicks: { $arrayElemAt: ['$clickStats.totalClicks', 0] },
          uniqueUsers: {
            $size: { $arrayElemAt: ['$clickStats.uniqueUsers', 0] },
          },
          devices: { $arrayElemAt: ['$clickStats.devices', 0] },
          countries: { $arrayElemAt: ['$clickStats.countries', 0] },
          clicksByDay: 1,
          urlList: 1,
        },
      },
    ]);

    return (
      analytics[0] || {
        urlCount: 0,
        totalClicks: 0,
        uniqueUsers: 0,
        devices: [],
        countries: [],
        clicksByDay: [],
        urlList: [],
      }
    );
  }

  async getUrlAnalytics(shortUrl) {
    const analytics = await Url.aggregate([
      { $match: { shortUrl } },
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
              device: '$clicks.device',
              country: '$clicks.location.country',
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
          clicksByDay: {
            $map: {
              input: '$clicksByDay',
              as: 'click',
              in: {
                date: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$$click.timestamp',
                  },
                },
                device: '$$click.device',
                country: '$$click.country',
              },
            },
          },
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

export default new AnalyticsService();
