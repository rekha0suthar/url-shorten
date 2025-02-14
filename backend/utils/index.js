// function to get stats data for a week of all urls of specific user
export const weekStats = (urls) => {
  // Total clicks in a week
  const totalUrls = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
  const uniqueUsers = new Set(
    urls.flatMap((url) => url.clicks.map((click) => click.ipAddress))
  ).size;
  const now = new Date();
  const lastWeek = new Date(now.setDate(now.getDate() - 7));

  const clicksInWeek = urls
    .flatMap((url) => url.clicks)
    .filter((click) => click.timestamp >= lastWeek)
    .reduce((acc, click) => {
      const date = click.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  return { clicksInWeek, uniqueUsers, totalClicks, totalUrls };
};

// function to get stats data for a week of specific url of specific user
export const urlWeekStats = (url) => {
  // Total clicks in a week
  const totalClicks = url.clicks.length;
  const uniqueUsers = new Set(url.clicks.map((click) => click.ipAddress)).size;
  const now = new Date();
  const lastWeek = new Date(now.setDate(now.getDate() - 7));

  const clicksInWeek = url.clicks
    .filter((click) => click.timestamp >= lastWeek)
    .reduce((acc, click) => {
      const date = click.timestamp.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

  return { clicksInWeek, uniqueUsers, totalClicks };
};

// function to get analytics of OS and DEVICE
export const osAndDeviceAnalytics = (osStats, deviceStats) => {
  const osAnalytics = Object.entries(osStats).map(([osName, stats]) => ({
    osName,
    uniqueClicks: stats.uniqueClicks.size,
    uniqueUsers: stats.uniqueUsers.size,
  }));

  const deviceAnalytics = Object.entries(deviceStats).map(
    ([deviceName, stats]) => ({
      deviceName,
      uniqueClicks: stats.uniqueClicks.size,
      uniqueUsers: stats.uniqueUsers.size,
    })
  );

  return { osAnalytics, deviceAnalytics };
};
