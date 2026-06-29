import Project from "../models/Project.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/projects  — public, supports ?type= &status= &search= &sort=
export const listProjects = asyncHandler(async (req, res) => {
  const { type, status, search, sort } = req.query;
  const filter = {};

  if (type && type !== "All") filter.type = type;
  if (status && status !== "All") filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  let query = Project.find(filter);

  if (sort === "price-asc") query = query.sort({ priceValue: 1 });
  else if (sort === "price-desc") query = query.sort({ priceValue: -1 });
  else query = query.sort({ featured: -1, createdAt: -1 });

  const projects = await query.exec();
  res.json({ count: projects.length, projects });
});

// GET /api/projects/:slug  — public
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ project });
});

// POST /api/projects  — admin
export const createProject = asyncHandler(async (req, res) => {
  const body = { ...req.body };
  if (!body.slug && body.name) {
    body.slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  const project = await Project.create(body);
  res.status(201).json({ project });
});

// PUT /api/projects/:id  — admin
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ project });
});

// DELETE /api/projects/:id  — admin
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted", id: req.params.id });
});
