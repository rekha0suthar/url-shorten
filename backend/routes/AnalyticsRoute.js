import { Router } from 'express';
import Url from '../models/UrlModel.js';
import auth from '../middleware/auth.js';
import {
  getOverallAnalytics,
  getTopicAnalytics,
  getUrlAnalytics,
} from '../controllers/AnalyticsController.js';

const router = Router();

// API - fetch overall analytics - GET
router.get('/overall', auth, getOverallAnalytics);

// API - fetch topic specific analytics - GET
router.get('/topic/:topic', auth, getTopicAnalytics);

// API - short URL specific analytics - GET
router.get('/:shortUrl', auth, getUrlAnalytics);

export default router;
