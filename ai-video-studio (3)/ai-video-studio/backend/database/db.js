const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { dbPath } = require('../config/db.config');

// Open (or create) the SQLite database file
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Run schema.sql on boot (idempotent - uses CREATE TABLE IF NOT EXISTS)
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

module.exports = db;
