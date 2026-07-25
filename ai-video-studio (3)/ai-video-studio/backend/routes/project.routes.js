const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const upload = require('../middleware/upload.middleware');
const { generateValidator } = require('../validators/project.validator');
const {
  generate,
  list,
  stats,
  getById,
  rename,
  toggleFavourite,
  duplicate,
  remove
} = require('../controllers/project.controller');

router.use(protect);

// multer runs before validation so file-based generation also gets validated
router.post('/generate', upload.single('file'), generateValidator, validate, generate);
router.get('/', list);
router.get('/stats', stats);
router.get('/:id', getById);
router.patch('/:id/rename', rename);
router.patch('/:id/favourite', toggleFavourite);
router.post('/:id/duplicate', duplicate);
router.delete('/:id', remove);

module.exports = router;
