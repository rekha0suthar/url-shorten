import urlService from '../services/urlService.js';

// Shorten URL controller
const shortUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, topic } = req.body;
    const user = req.user.email;

    const result = await urlService.createShortUrl(
      originalUrl,
      customAlias,
      topic,
      user,
      req.protocol,
      req.get('host')
    );

    res.status(result.isExisting ? 200 : 201).json({
      shortUrl: result.shortUrl,
      createdAt: result.createdAt,
      isExisting: result.isExisting,
    });
  } catch (error) {
    console.error(error);
    res
      .status(
        error.message === 'Invalid URL' ||
          error.message === 'Alias already exists'
          ? 400
          : 500
      )
      .json({ message: error.message || 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    const url = await urlService.recordClick(alias, req);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUrls = async (req, res) => {
  try {
    const user = req.user.email;
    const { page, limit } = req.query;

    const result = await urlService.getUrlsByUser(user, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { shortUrl, redirectUrl, getUrls };
