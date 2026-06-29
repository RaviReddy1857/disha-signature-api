import News from "../models/News.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/news  — public (published only unless ?all=true from admin)
export const listNews = asyncHandler(async (req, res) => {
  const filter = req.query.all === "true" ? {} : { published: true };
  const items = await News.find(filter).sort({ createdAt: -1 });
  res.json({ count: items.length, news: items });
});

// GET /api/news/:slug — public
export const getNews = asyncHandler(async (req, res) => {
  const item = await News.findOne({ slug: req.params.slug });
  if (!item) return res.status(404).json({ message: "Article not found" });
  res.json({ news: item });
});

// POST /api/news — admin
export const createNews = asyncHandler(async (req, res) => {
  const item = await News.create(req.body);
  res.status(201).json({ news: item });
});

// PUT /api/news/:id — admin
export const updateNews = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) return res.status(404).json({ message: "Article not found" });
  res.json({ news: item });
});

// DELETE /api/news/:id — admin
export const deleteNews = asyncHandler(async (req, res) => {
  const item = await News.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: "Article not found" });
  res.json({ message: "Article deleted", id: req.params.id });
});
