const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', protect, me);

module.exports = router;
