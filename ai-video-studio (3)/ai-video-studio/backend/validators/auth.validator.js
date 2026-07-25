const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.')
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters.')
];

module.exports = { registerValidator, loginValidator, changePasswordValidator };
