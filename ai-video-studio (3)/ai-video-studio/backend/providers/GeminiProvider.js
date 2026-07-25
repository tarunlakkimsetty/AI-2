const { GoogleGenerativeAI } = require('@google/generative-ai');
const {
  geminiApiKey,
  geminiModel,
  geminiTemperature,
  geminiMaxTokens
} = require('../config/env');
const ApiError = require('../utils/ApiError');

if (!geminiApiKey) {
  console.warn('[GeminiProvider] WARNING: GEMINI_API_KEY is not set. AI generation will fail.');
}

const genAI = new GoogleGenerativeAI(geminiApiKey || 'missing-key');

/**
 * GeminiProvider - thin wrapper around the Gemini 2.5 Flash SDK.
 * This is the ONLY place in the app that talks to the AI API.
 * Enforces: single call, JSON-only response, fixed temperature.
 */
const GeminiProvider = {
  async generateJson(prompt) {
    const model = genAI.getGenerativeModel({
      model: geminiModel,
      generationConfig: {
        temperature: geminiTemperature,
        maxOutputTokens: geminiMaxTokens,
        responseMimeType: 'application/json'
      }
    });

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text;
    } catch (err) {
      throw new ApiError(502, `Gemini API request failed: ${err.message}`);
    }
  }
};

module.exports = GeminiProvider;
