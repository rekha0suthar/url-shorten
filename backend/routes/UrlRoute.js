import { Router } from 'express';
import auth from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

import {
  shortUrl,
  redirectUrl,
  getUrls,
} from '../controllers/UrlController.js';

const router = Router();

// URL creation rate limit
const createUrlLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 requests per `window` (her
});

// API - url shorten - POST
router.post('/shorten', auth, createUrlLimiter, shortUrl);

// API - url redirect - GET
// Redirect to the original URL using the alias.
// This route should be defined outside of API paths so that visiting BASE_URL/alias redirects properly.
router.get('/shorten/:alias', redirectUrl);

// API - fetch all urls with pagination - GET
// Fetch all URLs for authenticated user with optional topic filter and pagination.

router.get('/urls', auth, getUrls);

export default router; // export the router
