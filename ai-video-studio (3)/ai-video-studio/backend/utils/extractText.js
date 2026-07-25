const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const ApiError = require('./ApiError');

// Fetches a blog/article URL and strips it down to readable plain text
async function extractFromUrl(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (AI Video Studio Bot)' }
    });
    const $ = cheerio.load(html);

    // Remove non-content elements
    $('script, style, nav, footer, header, iframe, noscript, svg').remove();

    // Prefer <article>, fall back to body text
    let text = $('article').text() || $('main').text() || $('body').text();
    text = text.replace(/\s+/g, ' ').trim();

    if (!text || text.length < 100) {
      throw new ApiError(422, 'Could not extract meaningful content from that URL.');
    }

    // Cap length to keep the Gemini prompt reasonable
    return text.slice(0, 12000);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(422, `Failed to fetch/parse the URL: ${err.message}`);
  }
}

// Reads an uploaded .txt file from disk
function extractFromFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8').trim();
    if (!text) throw new ApiError(422, 'Uploaded file is empty.');
    return text.slice(0, 12000);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(422, `Failed to read uploaded file: ${err.message}`);
  } finally {
    // Clean up the temp upload regardless of outcome
    fs.unlink(filePath, () => {});
  }
}

module.exports = { extractFromUrl, extractFromFile };
