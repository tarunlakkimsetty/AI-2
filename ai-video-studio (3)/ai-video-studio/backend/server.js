const app = require('./app');
const { port, nodeEnv } = require('./config/env');

// Touching db.js here ensures the SQLite schema is initialized on boot
require('./database/db');

app.listen(port, () => {
  console.log(`🚀 AI Video Content Studio API running on port ${port} [${nodeEnv}]`);
});
