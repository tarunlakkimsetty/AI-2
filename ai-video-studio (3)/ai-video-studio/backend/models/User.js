const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// User model - thin data-access layer over the `users` table
const User = {
  create({ name, email, hashedPassword }) {
    const id = uuidv4();
    db.prepare(
      `INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`
    ).run(id, name, email, hashedPassword);
    return User.findById(id);
  },

  findByEmail(email) {
    return db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT id, name, email, theme, language, tone, temperature, created_at FROM users WHERE id = ?`
      )
      .get(id);
  },

  findByIdWithPassword(id) {
    return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
  },

  updateProfile(id, { name, theme, language, tone, temperature }) {
    db.prepare(
      `UPDATE users SET
        name = COALESCE(?, name),
        theme = COALESCE(?, theme),
        language = COALESCE(?, language),
        tone = COALESCE(?, tone),
        temperature = COALESCE(?, temperature),
        updated_at = datetime('now')
       WHERE id = ?`
    ).run(name, theme, language, tone, temperature, id);
    return User.findById(id);
  },

  updatePassword(id, hashedPassword) {
    db.prepare(
      `UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?`
    ).run(hashedPassword, id);
  },

  delete(id) {
    db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
  },

  projectCount(id) {
    const row = db
      .prepare(`SELECT COUNT(*) as count FROM projects WHERE user_id = ?`)
      .get(id);
    return row.count;
  }
};

module.exports = User;
