const Project = require('../models/Project');
const AIService = require('./AIService');
const ApiError = require('../utils/ApiError');
const { extractFromUrl, extractFromFile } = require('../utils/extractText');

const ProjectService = {
  /**
   * Resolves the raw source text based on inputType, then makes the
   * single Gemini call, then persists the full result to SQLite.
   */
  async generate({ userId, inputType, topic, url, text, file, platform, tone, audience, language }) {
    let sourceText;
    let sourceContent; // what we store/display as the original input reference

    switch (inputType) {
      case 'topic':
        if (!topic || !topic.trim()) throw new ApiError(400, 'Topic is required.');
        sourceText = topic.trim();
        sourceContent = topic.trim();
        break;

      case 'url':
        if (!url || !url.trim()) throw new ApiError(400, 'Blog URL is required.');
        sourceText = await extractFromUrl(url.trim());
        sourceContent = url.trim();
        break;

      case 'text':
        if (!text || !text.trim()) throw new ApiError(400, 'Plain text is required.');
        sourceText = text.trim();
        sourceContent = text.trim().slice(0, 300);
        break;

      case 'file':
        if (!file) throw new ApiError(400, 'A .txt file upload is required.');
        sourceText = extractFromFile(file.path);
        sourceContent = file.originalname;
        break;

      default:
        throw new ApiError(400, 'Invalid inputType.');
    }

    const result = await AIService.generateVideoPackage({
      sourceText,
      inputType,
      platform,
      tone,
      audience,
      language
    });

    const project = Project.create({
      userId,
      title: result.title || 'Untitled Video Project',
      inputType,
      sourceContent,
      platform,
      tone,
      audience,
      language,
      resultJson: JSON.stringify(result)
    });

    return ProjectService.serialize(project);
  },

  list(userId, query) {
    const projects = Project.findAllByUser(userId, query);
    return projects.map((p) => ProjectService.serialize(p, { includeResult: false }));
  },

  getById(id, userId) {
    const project = Project.findById(id, userId);
    if (!project) throw new ApiError(404, 'Project not found.');
    return ProjectService.serialize(project);
  },

  rename(id, userId, title) {
    if (!title || !title.trim()) throw new ApiError(400, 'Title is required.');
    const project = Project.rename(id, userId, title.trim());
    if (!project) throw new ApiError(404, 'Project not found.');
    return ProjectService.serialize(project);
  },

  toggleFavourite(id, userId) {
    const project = Project.toggleFavourite(id, userId);
    if (!project) throw new ApiError(404, 'Project not found.');
    return ProjectService.serialize(project);
  },

  duplicate(id, userId) {
    const project = Project.duplicate(id, userId);
    if (!project) throw new ApiError(404, 'Project not found.');
    return ProjectService.serialize(project);
  },

  remove(id, userId) {
    const project = Project.findById(id, userId);
    if (!project) throw new ApiError(404, 'Project not found.');
    Project.delete(id, userId);
  },

  stats(userId) {
    return Project.stats(userId);
  },

  // Converts the DB row (with result_json string) into an API-friendly object
  serialize(project, { includeResult = true } = {}) {
    const base = {
      id: project.id,
      title: project.title,
      inputType: project.input_type,
      sourceContent: project.source_content,
      platform: project.platform,
      tone: project.tone,
      audience: project.audience,
      language: project.language,
      isFavourite: !!project.is_favourite,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    };
    if (includeResult) {
      base.result = JSON.parse(project.result_json);
    }
    return base;
  }
};

module.exports = ProjectService;
