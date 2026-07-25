// Loads environment variables once, at app boot.
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  geminiTemperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.4'),
  geminiMaxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '8192', 10),
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxUploadSize: process.env.MAX_UPLOAD_SIZE || '5mb',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173'
};
