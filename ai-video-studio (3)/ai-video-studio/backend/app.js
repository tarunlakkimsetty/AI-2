const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { clientUrl, nodeEnv } = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Basic rate limiting to protect the Gemini-backed endpoint from abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', apiLimiter);

// --- Routes ---
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ai-video-studio-backend' }));
app.use('/api', routes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
