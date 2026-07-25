const ProjectService = require('../services/project.service');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/projects/generate - the single AI-call endpoint
const generate = asyncHandler(async (req, res) => {
  const { inputType, topic, url, text, platform, tone, audience, language } = req.body;
  const file = req.file; // present only when inputType === 'file'

  const project = await ProjectService.generate({
    userId: req.user.id,
    inputType,
    topic,
    url,
    text,
    file,
    platform,
    tone,
    audience,
    language
  });

  res.status(201).json({ success: true, data: { project } });
});

// GET /api/projects
const list = asyncHandler(async (req, res) => {
  const { search, favourites, sortBy, order } = req.query;
  const projects = ProjectService.list(req.user.id, {
    search,
    favouritesOnly: favourites === 'true',
    sortBy,
    order
  });
  res.status(200).json({ success: true, data: { projects } });
});

// GET /api/projects/stats
const stats = asyncHandler(async (req, res) => {
  const data = ProjectService.stats(req.user.id);
  res.status(200).json({ success: true, data });
});

// GET /api/projects/:id
const getById = asyncHandler(async (req, res) => {
  const project = ProjectService.getById(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { project } });
});

// PATCH /api/projects/:id/rename
const rename = asyncHandler(async (req, res) => {
  const project = ProjectService.rename(req.params.id, req.user.id, req.body.title);
  res.status(200).json({ success: true, data: { project } });
});

// PATCH /api/projects/:id/favourite
const toggleFavourite = asyncHandler(async (req, res) => {
  const project = ProjectService.toggleFavourite(req.params.id, req.user.id);
  res.status(200).json({ success: true, data: { project } });
});

// POST /api/projects/:id/duplicate
const duplicate = asyncHandler(async (req, res) => {
  const project = ProjectService.duplicate(req.params.id, req.user.id);
  res.status(201).json({ success: true, data: { project } });
});

// DELETE /api/projects/:id
const remove = asyncHandler(async (req, res) => {
  ProjectService.remove(req.params.id, req.user.id);
  res.status(200).json({ success: true, message: 'Project deleted.' });
});

module.exports = { generate, list, stats, getById, rename, toggleFavourite, duplicate, remove };
