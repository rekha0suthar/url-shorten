// tests/api.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../app.js'; // Ensure your app is exported from app.js
import Url from '../models/Url';

// Use your test secret (must match the one in your auth middleware)
const TEST_SECRET = 'your-secret-key';

// Define a test user email
const testUserEmail = 'test@example.com';

// Generate a test token for authorized requests
const token = jwt.sign({ email: testUserEmail }, TEST_SECRET, {
  expiresIn: '1h',
});

// Connect to a test database (or in-memory database)
beforeAll(async () => {
  const mongoURI =
    process.env.MONGO_URI_TEST || 'mongodb://localhost/url_shorten_test';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the Url collection after each test
afterEach(async () => {
  await Url.deleteMany({});
});

// Disconnect from MongoDB after all tests are done
afterAll(async () => {
  await mongoose.connection.close();
});

//////////////////////////////
// Tests for GET /api/overall
//////////////////////////////
describe('GET /api/overall', () => {
  it('should return overall analytics for the authenticated user', async () => {
    // Create sample URL documents with clicks for our test user
    await Url.create([
      {
        originalUrl: 'https://example.com/1',
        shortUrl: 'alias1',
        topic: 'activation',
        user: testUserEmail,
        clicks: [
          {
            timestamp: new Date(),
            ipAddress: '192.168.0.1',
            userAgent: 'TestAgent',
            os: 'Windows',
            device: 'desktop',
          },
          {
            timestamp: new Date(),
            ipAddress: '192.168.0.2',
            userAgent: 'TestAgent2',
            os: 'macOS',
            device: 'desktop',
          },
        ],
      },
      {
        originalUrl: 'https://example.com/2',
        shortUrl: 'alias2',
        topic: 'activation',
        user: testUserEmail,
        clicks: [
          {
            timestamp: new Date(),
            ipAddress: '192.168.0.1',
            userAgent: 'TestAgent',
            os: 'Windows',
            device: 'desktop',
          },
        ],
      },
    ]);

    const response = await request(app)
      .get('/api/overall')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    // Expect keys such as totalUrls, totalClicks, uniqueUsers, clicksInWeek, osType, deviceType
    expect(response.body).toHaveProperty('totalUrls');
    expect(response.body).toHaveProperty('totalClicks');
    expect(response.body).toHaveProperty('uniqueUsers');
    expect(response.body).toHaveProperty('clicksInWeek');
    expect(response.body).toHaveProperty('osType');
    expect(response.body).toHaveProperty('deviceType');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/overall')
      .set('Accept', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.error || response.body.message).toMatch(
      /Unauthorized/
    );
  });
});

//////////////////////////////
// Tests for GET /api/topic/:topic
//////////////////////////////
describe('GET /api/topic/:topic', () => {
  it('should return topic-specific analytics for the authenticated user', async () => {
    // Create URL documents for a specific topic
    await Url.create([
      {
        originalUrl: 'https://example.com/3',
        shortUrl: 'alias3',
        topic: 'activation',
        user: testUserEmail,
        clicks: [
          {
            timestamp: new Date(),
            ipAddress: '192.168.1.1',
            userAgent: 'Agent',
            os: 'Linux',
            device: 'desktop',
          },
        ],
      },
      {
        originalUrl: 'https://example.com/4',
        shortUrl: 'alias4',
        topic: 'activation',
        user: testUserEmail,
        clicks: [
          {
            timestamp: new Date(),
            ipAddress: '192.168.1.2',
            userAgent: 'Agent2',
            os: 'Windows',
            device: 'mobile',
          },
        ],
      },
      {
        originalUrl: 'https://example.com/5',
        shortUrl: 'alias5',
        topic: 'retention',
        user: testUserEmail,
        clicks: [],
      },
    ]);

    const response = await request(app)
      .get('/api/topic/activation')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalClicks');
    expect(response.body).toHaveProperty('uniqueUsers');
    expect(response.body).toHaveProperty('clicksInWeek');
    expect(response.body).toHaveProperty('urls');
    // Check that urls in response have a valid shortUrl format (adjust regex as needed)
    response.body.urls.forEach((urlStat) => {
      expect(urlStat.shortUrl).toMatch(/^https:\/\/.+\/api\/shorten\/\w+$/);
    });
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/topic/activation')
      .set('Accept', 'application/json');
    expect(response.status).toBe(401);
  });
});

//////////////////////////////
// Tests for GET /api/:alias (URL analytics)
//////////////////////////////
describe('GET /api/:alias', () => {
  it('should return analytics for a specific URL alias for the authenticated user', async () => {
    // Create a URL document with clicks
    await Url.create({
      originalUrl: 'https://example.com/6',
      shortUrl: 'alias6',
      topic: 'acquisition',
      user: testUserEmail,
      clicks: [
        {
          timestamp: new Date(),
          ipAddress: '10.0.0.1',
          userAgent: 'UA',
          os: 'iOS',
          device: 'mobile',
        },
      ],
    });

    const response = await request(app)
      .get('/api/alias6')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalClicks');
    expect(response.body).toHaveProperty('uniqueUsers');
    expect(response.body).toHaveProperty('clicksInWeek');
    expect(response.body).toHaveProperty('osType');
    expect(response.body).toHaveProperty('deviceType');
  });

  it('should return 404 if the alias does not exist', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/not found/i);
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/alias6')
      .set('Accept', 'application/json');
    expect(response.status).toBe(401);
  });
});

//////////////////////////////
// Tests for POST /api/shorten (Create Short URL)
//////////////////////////////
describe('POST /api/shorten', () => {
  it('should create a short URL when provided valid data', async () => {
    const payload = {
      originalUrl: 'https://www.google.com',
      customAlias: 'google',
      topic: 'others',
    };

    const response = await request(app)
      .post('/api/shorten')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('shortUrl');
    // Adjust the regex if your short URL format is different
    expect(response.body.shortUrl).toMatch(
      /^https:\/\/.+\/api\/shorten\/\w{8}$/
    );
    expect(response.body).toHaveProperty('createdAt');
  });

  it('should return an error for an invalid URL', async () => {
    const payload = {
      originalUrl: 'invalid-url',
      customAlias: 'google',
      topic: 'others',
    };

    const response = await request(app)
      .post('/api/shorten')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Invalid URL/);
  });

  it('should return an error when required fields are missing', async () => {
    const payload = {
      // originalUrl missing
      customAlias: 'google',
      topic: 'others',
    };

    const response = await request(app)
      .post('/api/shorten')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Original URL is required/);
  });

  it('should return an error when a custom alias already exists', async () => {
    // First, create a URL with a custom alias
    await Url.create({
      originalUrl: 'https://www.example.com',
      shortUrl: 'google',
      topic: 'others',
      user: testUserEmail,
      clicks: [],
    });

    const payload = {
      originalUrl: 'https://www.google.com',
      customAlias: 'google', // already exists
      topic: 'others',
    };

    const response = await request(app)
      .post('/api/shorten')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Alias already exists/);
  });

  it('should return 401 for unauthorized access', async () => {
    const payload = {
      originalUrl: 'https://www.google.com',
      customAlias: 'google',
      topic: 'others',
    };

    const response = await request(app)
      .post('/api/shorten')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body.error || response.body.message).toMatch(
      /Unauthorized/
    );
  });
});

//////////////////////////////
// Tests for GET /api/shorten/:alias (URL Redirect)
//////////////////////////////
describe('GET /api/shorten/:alias (Redirect URL)', () => {
  it('should redirect to the original URL when the alias exists', async () => {
    // Create a URL document to test redirection
    await Url.create({
      originalUrl: 'https://www.wikipedia.org',
      shortUrl: 'wiki1234',
      topic: 'others',
      user: testUserEmail,
      clicks: [],
    });

    const response = await request(app)
      .get('/api/shorten/wiki1234')
      .set('Accept', 'application/json');

    // A successful redirect typically sends a 302 status code
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('https://www.wikipedia.org');
  });

  it('should return 404 when the alias does not exist', async () => {
    const response = await request(app)
      .get('/api/shorten/nonexistent')
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/URL not found/);
  });
});

//////////////////////////////
// Tests for GET /api/urls (Paginated URLs)
//////////////////////////////
describe('GET /api/urls', () => {
  it('should return paginated URLs for the authenticated user', async () => {
    // Insert multiple URL documents
    const urlsToInsert = [];
    for (let i = 1; i <= 15; i++) {
      urlsToInsert.push({
        originalUrl: `https://example.com/page${i}`,
        shortUrl: `alias${i}`,
        topic: i % 2 === 0 ? 'activation' : 'retention',
        user: testUserEmail,
        clicks: [],
      });
    }
    await Url.insertMany(urlsToInsert);

    // Request first page with a limit of 7
    const response = await request(app)
      .get('/api/urls?page=1&limit=7')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.urls.length).toBe(7);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('page');
    expect(response.body).toHaveProperty('pages');
  });

  it('should return 401 for unauthorized access', async () => {
    const response = await request(app)
      .get('/api/urls')
      .set('Accept', 'application/json');
    expect(response.status).toBe(401);
  });
});
