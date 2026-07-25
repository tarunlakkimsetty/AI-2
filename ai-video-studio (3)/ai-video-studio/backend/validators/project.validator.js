const { body } = require('express-validator');

const generateValidator = [
  body('inputType')
    .isIn(['topic', 'url', 'text', 'file'])
    .withMessage('inputType must be one of topic, url, text, file.'),
  body('platform')
    .isIn(['YouTube', 'Shorts', 'Reels', 'TikTok'])
    .withMessage('Invalid platform.'),
  body('tone').trim().notEmpty().withMessage('Tone is required.'),
  body('audience').trim().notEmpty().withMessage('Audience is required.'),
  body('language')
    .isIn(['English', 'Hindi', 'Telugu'])
    .withMessage('Invalid language.')
];

module.exports = { generateValidator };
