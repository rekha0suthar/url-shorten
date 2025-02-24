import analyticsService from '../services/analyticsService.js';

const getOverallAnalytics = async (req, res) => {
  try {
    const user = req.user.email;
    const analytics = await analyticsService.getOverallAnalytics(user);
    res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getTopicAnalytics = async (req, res) => {
  try {
    const user = req.user.email;
    const { topic } = req.params;
    const analytics = await analyticsService.getTopicAnalytics(user, topic);
    res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUrlAnalytics = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const analytics = await analyticsService.getUrlAnalytics(shortUrl);
    res.status(200).json(analytics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getOverallAnalytics, getTopicAnalytics, getUrlAnalytics };
