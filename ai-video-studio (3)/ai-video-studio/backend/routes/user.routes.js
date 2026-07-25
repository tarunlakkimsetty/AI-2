const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { changePasswordValidator } = require('../validators/auth.validator');
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} = require('../controllers/user.controller');

router.use(protect);
router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/password', changePasswordValidator, validate, changePassword);
router.delete('/me', deleteAccount);

module.exports = router;
