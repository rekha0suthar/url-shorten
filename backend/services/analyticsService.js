import Url from '../models/UrlModel.js';

class AnalyticsService {
  async getOverallAnalytics(user) {
    const analytics = await Url.aggregate([
      { $match: { user } },
      {
        $facet: {
          totalUrls: [{ $count: 'count' }],
          clickStats: [
            { $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$clicks.ipAddress' },
                clicksInWeek: {
                  $push: {
                    date: {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$clicks.timestamp',
                      },
                    },
                    value: 1,
                  },
                },
                osType: {
                  $push: {
                    os: '$clicks.os',
                  },
                },
                deviceType: {
                  $push: {
                    device: '$clicks.device',
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalClicks: 1,
                uniqueUsers: { $size: '$uniqueUsers' },
                clicksInWeek: 1,
                osType: {
                  $map: {
                    input: {
                      $setUnion: {
                        $map: {
                          input: '$osType',
                          as: 'os',
                          in: '$$os.os',
                        },
                      },
                    },
                    as: 'os',
                    in: {
                      osName: '$$os',
                      uniqueClicks: {
                        $size: {
                          $filter: {
                            input: '$osType',
                            as: 'osItem',
                            cond: { $eq: ['$$osItem.os', '$$os'] },
                          },
                        },
                      },
                      uniqueUsers: {
                        $size: {
                          $setUnion: {
                            $map: {
                              input: {
                                $filter: {
                                  input: '$osType',
                                  as: 'osItem',
                                  cond: { $eq: ['$$osItem.os', '$$os'] },
                                },
                              },
                              as: 'osItem',
                              in: '$$osItem.ipAddress',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                deviceType: {
                  $map: {
                    input: {
                      $setUnion: {
                        $map: {
                          input: '$deviceType',
                          as: 'device',
                          in: '$$device.device',
                        },
                      },
                    },
                    as: 'device',
                    in: {
                      deviceName: '$$device',
                      uniqueClicks: {
                        $size: {
                          $filter: {
                            input: '$deviceType',
                            as: 'deviceItem',
                            cond: { $eq: ['$$deviceItem.device', '$$device'] },
                          },
                        },
                      },
                      uniqueUsers: {
                        $size: {
                          $setUnion: {
                            $map: {
                              input: {
                                $filter: {
                                  input: '$deviceType',
                                  as: 'deviceItem',
                                  cond: {
                                    $eq: ['$$deviceItem.device', '$$device'],
                                  },
                                },
                              },
                              as: 'deviceItem',
                              in: '$$deviceItem.ipAddress',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          totalUrls: { $arrayElemAt: ['$totalUrls.count', 0] },
          totalClicks: { $arrayElemAt: ['$clickStats.totalClicks', 0] },
          uniqueUsers: { $arrayElemAt: ['$clickStats.uniqueUsers', 0] },
          clicksInWeek: {
            $reduce: {
              input: { $arrayElemAt: ['$clickStats.clicksInWeek', 0] },
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  [
                    {
                      date: '$$this.date',
                      value: {
                        $add: [
                          {
                            $ifNull: [
                              { $arrayElemAt: ['$$value.value', -1] },
                              0,
                            ],
                          },
                          '$$this.value',
                        ],
                      },
                    },
                  ],
                ],
              },
            },
          },
          osType: { $arrayElemAt: ['$clickStats.osType', 0] },
          deviceType: { $arrayElemAt: ['$clickStats.deviceType', 0] },
        },
      },
    ]);

    return (
      analytics[0] || {
        totalUrls: 0,
        totalClicks: 0,
        uniqueUsers: 0,
        clicksInWeek: [],
        osType: [],
        deviceType: [],
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
            { $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true } },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                uniqueUsers: { $addToSet: '$clicks.ipAddress' },
                clicksInWeek: {
                  $push: {
                    date: {
                      $dateToString: {
                        format: '%Y-%m-%d',
                        date: '$clicks.timestamp',
                      },
                    },
                    value: 1,
                  },
                },
                osType: {
                  $push: {
                    os: '$clicks.os',
                    ipAddress: '$clicks.ipAddress',
                  },
                },
                deviceType: {
                  $push: {
                    device: '$clicks.device',
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
                clicksInWeek: 1,
                osType: {
                  $map: {
                    input: {
                      $setUnion: {
                        $map: {
                          input: '$osType',
                          as: 'os',
                          in: '$$os.os',
                        },
                      },
                    },
                    as: 'os',
                    in: {
                      osName: '$$os',
                      uniqueClicks: {
                        $size: {
                          $filter: {
                            input: '$osType',
                            as: 'osItem',
                            cond: { $eq: ['$$osItem.os', '$$os'] },
                          },
                        },
                      },
                      uniqueUsers: {
                        $size: {
                          $setUnion: {
                            $map: {
                              input: {
                                $filter: {
                                  input: '$osType',
                                  as: 'osItem',
                                  cond: { $eq: ['$$osItem.os', '$$os'] },
                                },
                              },
                              as: 'osItem',
                              in: '$$osItem.ipAddress',
                            },
                          },
                        },
                      },
                    },
                  },
                },
                deviceType: {
                  $map: {
                    input: {
                      $setUnion: {
                        $map: {
                          input: '$deviceType',
                          as: 'device',
                          in: '$$device.device',
                        },
                      },
                    },
                    as: 'device',
                    in: {
                      deviceName: '$$device',
                      uniqueClicks: {
                        $size: {
                          $filter: {
                            input: '$deviceType',
                            as: 'deviceItem',
                            cond: { $eq: ['$$deviceItem.device', '$$device'] },
                          },
                        },
                      },
                      uniqueUsers: {
                        $size: {
                          $setUnion: {
                            $map: {
                              input: {
                                $filter: {
                                  input: '$deviceType',
                                  as: 'deviceItem',
                                  cond: {
                                    $eq: ['$$deviceItem.device', '$$device'],
                                  },
                                },
                              },
                              as: 'deviceItem',
                              in: '$$deviceItem.ipAddress',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
          urlList: [
            {
              $project: {
                shortUrl: 1,
                originalUrl: 1,
                createdAt: 1,
                clicks: { $size: { $ifNull: ['$clicks', []] } },
              },
            },
            { $sort: { clicks: -1 } },
          ],
        },
      },
      {
        $project: {
          urlCount: { $arrayElemAt: ['$urlCount.count', 0] },
          totalClicks: { $arrayElemAt: ['$clickStats.totalClicks', 0] },
          uniqueUsers: { $arrayElemAt: ['$clickStats.uniqueUsers', 0] },
          clicksInWeek: {
            $reduce: {
              input: { $arrayElemAt: ['$clickStats.clicksInWeek', 0] },
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  [
                    {
                      date: '$$this.date',
                      value: {
                        $add: [
                          {
                            $ifNull: [
                              { $arrayElemAt: ['$$value.value', -1] },
                              0,
                            ],
                          },
                          '$$this.value',
                        ],
                      },
                    },
                  ],
                ],
              },
            },
          },
          osType: { $arrayElemAt: ['$clickStats.osType', 0] },
          deviceType: { $arrayElemAt: ['$clickStats.deviceType', 0] },
          urlList: 1,
        },
      },
    ]);

    return (
      analytics[0] || {
        urlCount: 0,
        totalClicks: 0,
        uniqueUsers: 0,
        clicksInWeek: [],
        osType: [],
        deviceType: [],
        urlList: [],
      }
    );
  }

  async getUrlAnalytics(shortUrl) {
    const analytics = await Url.aggregate([
      { $match: { shortUrl } },
      { $unwind: { path: '$clicks', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$clicks.ipAddress' },
          clicksInWeek: {
            $push: {
              date: {
                $dateToString: {
                  format: '%Y-%m-%d',
                  date: '$clicks.timestamp',
                },
              },
              value: 1,
            },
          },
          osType: {
            $push: {
              os: '$clicks.os',
              ipAddress: '$clicks.ipAddress',
            },
          },
          deviceType: {
            $push: {
              device: '$clicks.device',
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
          clicksInWeek: {
            $reduce: {
              input: '$clicksInWeek',
              initialValue: [],
              in: {
                $concatArrays: [
                  '$$value',
                  [
                    {
                      date: '$$this.date',
                      value: {
                        $add: [
                          {
                            $ifNull: [
                              { $arrayElemAt: ['$$value.value', -1] },
                              0,
                            ],
                          },
                          '$$this.value',
                        ],
                      },
                    },
                  ],
                ],
              },
            },
          },
          osType: {
            $map: {
              input: {
                $setUnion: {
                  $map: {
                    input: '$osType',
                    as: 'os',
                    in: '$$os.os',
                  },
                },
              },
              as: 'os',
              in: {
                osName: '$$os',
                uniqueClicks: {
                  $size: {
                    $filter: {
                      input: '$osType',
                      as: 'osItem',
                      cond: { $eq: ['$$osItem.os', '$$os'] },
                    },
                  },
                },
                uniqueUsers: {
                  $size: {
                    $setUnion: {
                      $map: {
                        input: {
                          $filter: {
                            input: '$osType',
                            as: 'osItem',
                            cond: { $eq: ['$$osItem.os', '$$os'] },
                          },
                        },
                        as: 'osItem',
                        in: '$$osItem.ipAddress',
                      },
                    },
                  },
                },
              },
            },
          },
          deviceType: {
            $map: {
              input: {
                $setUnion: {
                  $map: {
                    input: '$deviceType',
                    as: 'device',
                    in: '$$device.device',
                  },
                },
              },
              as: 'device',
              in: {
                deviceName: '$$device',
                uniqueClicks: {
                  $size: {
                    $filter: {
                      input: '$deviceType',
                      as: 'deviceItem',
                      cond: { $eq: ['$$deviceItem.device', '$$device'] },
                    },
                  },
                },
                uniqueUsers: {
                  $size: {
                    $setUnion: {
                      $map: {
                        input: {
                          $filter: {
                            input: '$deviceType',
                            as: 'deviceItem',
                            cond: { $eq: ['$$deviceItem.device', '$$device'] },
                          },
                        },
                        as: 'deviceItem',
                        in: '$$deviceItem.ipAddress',
                      },
                    },
                  },
                },
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
        clicksInWeek: [],
        osType: [],
        deviceType: [],
      }
    );
  }
}

export default new AnalyticsService();
