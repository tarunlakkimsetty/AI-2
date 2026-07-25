const GeminiProvider = require('../providers/GeminiProvider');
const ApiError = require('../utils/ApiError');

// The exact JSON contract the frontend expects, embedded in the prompt itself.
const JSON_SHAPE = `{
  "title": "string - catchy video title",
  "hook": "string - first 3-5 seconds spoken hook to stop the scroll",
  "introduction": "string - short intro after the hook",
  "script": "string - full spoken video script, scene-flow, ready to read aloud",
  "voiceOver": "string - clean voice-over-only version of the script (no stage directions)",
  "summary": "string - 2-3 sentence summary of the video's content",
  "callToAction": "string - closing CTA line",
  "duration": "string - estimated total video duration, e.g. '60 seconds' or '3-4 minutes'",
  "musicSuggestion": "string - background music mood/genre suggestion",
  "thumbnailPrompt": "string - descriptive prompt for generating a thumbnail image",
  "subtitle": "string - full subtitle/caption text synced to the script",
  "scenes": [
    { "scene": 1, "title": "string", "visual": "string - what's shown on screen", "description": "string - shot direction notes", "duration": "string - e.g. '0:00-0:05'" }
  ],
  "seo": {
    "title": "string - SEO-optimized title (different phrasing from main title)",
    "description": "string - SEO video description, 2-3 sentences",
    "keywords": ["string", "..."],
    "tags": ["string", "..."]
  },
  "captions": {
    "youtube": "string - caption/description formatted for YouTube",
    "instagram": "string - caption with relevant hashtags for Instagram",
    "linkedin": "string - professional caption for LinkedIn",
    "twitter": "string - short caption under 280 characters for X/Twitter",
    "facebook": "string - caption for Facebook"
  },
  "brollIdeas": ["string - b-roll shot idea", "..."]
}`;

function buildPrompt({ sourceText, inputType, platform, tone, audience, language }) {
  return `You are an expert video content strategist, scriptwriter, and SEO specialist.

TASK: Based on the SOURCE CONTENT below, generate a complete, ready-to-produce video content package.

SOURCE CONTENT TYPE: ${inputType}
SOURCE CONTENT:
"""
${sourceText}
"""

VIDEO REQUIREMENTS:
- Target platform: ${platform}
- Tone: ${tone}
- Target audience: ${audience}
- Output language: ${language} (write ALL text fields in this language, including scene titles and captions)
- If platform is "Shorts", "Reels", or "TikTok", keep total duration under 60 seconds and write a punchy, fast-paced script with 4-8 short scenes.
- If platform is "YouTube" (long-form), aim for 3-6 minutes with 6-12 well-paced scenes.

OUTPUT FORMAT - CRITICAL RULES:
1. Respond with PURE JSON ONLY. No markdown, no code fences, no commentary, no explanation before or after.
2. Match EXACTLY this JSON shape and field names (fill every field, do not omit any key):

${JSON_SHAPE}

3. "scenes" must be a non-empty array of scene objects, each with all four fields.
4. "seo.keywords" and "seo.tags" must be arrays of strings (5-10 items each).
5. "brollIdeas" must be an array of 4-8 short strings.
6. Do not include any field not listed above.`;
}

// Defensive JSON parse: Gemini is asked for pure JSON, but strip code fences just in case.
function safeParseJson(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new ApiError(502, 'AI response was not valid JSON. Please try generating again.');
  }
}

const REQUIRED_KEYS = [
  'title', 'hook', 'introduction', 'script', 'voiceOver', 'summary',
  'callToAction', 'duration', 'musicSuggestion', 'thumbnailPrompt',
  'subtitle', 'scenes', 'seo', 'captions', 'brollIdeas'
];

function validateShape(obj) {
  for (const key of REQUIRED_KEYS) {
    if (!(key in obj)) {
      throw new ApiError(502, `AI response is missing required field: "${key}". Please try again.`);
    }
  }
  if (!Array.isArray(obj.scenes) || obj.scenes.length === 0) {
    throw new ApiError(502, 'AI response has an invalid or empty "scenes" array.');
  }
}

const AIService = {
  /**
   * Makes exactly ONE Gemini API call and returns the fully-parsed,
   * validated video content package as a JS object.
   */
  async generateVideoPackage({ sourceText, inputType, platform, tone, audience, language }) {
    const prompt = buildPrompt({ sourceText, inputType, platform, tone, audience, language });
    const rawResponse = await GeminiProvider.generateJson(prompt);
    const parsed = safeParseJson(rawResponse);
    validateShape(parsed);
    return parsed;
  }
};

module.exports = AIService;
