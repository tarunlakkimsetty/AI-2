const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Project model - thin data-access layer over the `projects` table
const Project = {
  create({ userId, title, inputType, sourceContent, platform, tone, audience, language, resultJson }) {
    const id = uuidv4();
    db.prepare(
      `INSERT INTO projects
        (id, user_id, title, input_type, source_content, platform, tone, audience, language, result_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(id, userId, title, inputType, sourceContent, platform, tone, audience, language, resultJson);
    return Project.findById(id, userId);
  },

  findById(id, userId) {
    return db
      .prepare(`SELECT * FROM projects WHERE id = ? AND user_id = ?`)
      .get(id, userId);
  },

  findAllByUser(userId, { search, favouritesOnly, sortBy = 'created_at', order = 'DESC' } = {}) {
    let query = `SELECT * FROM projects WHERE user_id = ?`;
    const params = [userId];

    if (search) {
      query += ` AND title LIKE ?`;
      params.push(`%${search}%`);
    }
    if (favouritesOnly) {
      query += ` AND is_favourite = 1`;
    }

    const allowedSort = ['created_at', 'updated_at', 'title'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${safeSort} ${safeOrder}`;

    return db.prepare(query).all(...params);
  },

  rename(id, userId, title) {
    db.prepare(
      `UPDATE projects SET title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`
    ).run(title, id, userId);
    return Project.findById(id, userId);
  },

  toggleFavourite(id, userId) {
    db.prepare(
      `UPDATE projects SET is_favourite = NOT is_favourite, updated_at = datetime('now') WHERE id = ? AND user_id = ?`
    ).run(id, userId);
    return Project.findById(id, userId);
  },

  duplicate(id, userId) {
    const original = Project.findById(id, userId);
    if (!original) return null;
    return Project.create({
      userId,
      title: `${original.title} (Copy)`,
      inputType: original.input_type,
      sourceContent: original.source_content,
      platform: original.platform,
      tone: original.tone,
      audience: original.audience,
      language: original.language,
      resultJson: original.result_json
    });
  },

  delete(id, userId) {
    db.prepare(`DELETE FROM projects WHERE id = ? AND user_id = ?`).run(id, userId);
  },

  stats(userId) {
    const total = db.prepare(`SELECT COUNT(*) c FROM projects WHERE user_id = ?`).get(userId).c;
    const favourites = db
      .prepare(`SELECT COUNT(*) c FROM projects WHERE user_id = ? AND is_favourite = 1`)
      .get(userId).c;
    const thisMonth = db
      .prepare(
        `SELECT COUNT(*) c FROM projects WHERE user_id = ? AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')`
      )
      .get(userId).c;
    return { total, favourites, thisMonth };
  }
};

module.exports = Project;
