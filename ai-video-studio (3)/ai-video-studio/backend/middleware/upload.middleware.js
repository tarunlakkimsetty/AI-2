const multer = require('multer');
const path = require('path');
const { uploadPath } = require('../config/env');

// Accepts only .txt files, stores them temporarily in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}.txt`;
    cb(null, unique);
  }
});

function fileFilter(req, file, cb) {
  const isTxt = file.mimetype === 'text/plain' || path.extname(file.originalname).toLowerCase() === '.txt';
  if (!isTxt) {
    return cb(new Error('Only .txt files are allowed.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5mb
});

module.exports = upload;
