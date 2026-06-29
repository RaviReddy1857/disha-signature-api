import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import User from "../models/User.js";
import Project from "../models/Project.js";
import News from "../models/News.js";
import Lead from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
// seed data.json lives in ../seed/
const data = JSON.parse(readFileSync(join(__dirname, "../seed/data.json"), "utf-8"));

const sampleLeads = [
  { name: "Rajesh Menon", email: "rajesh.m@gmail.com", phone: "+91 98480 22113", project: "Disha Central Park", type: "Site Visit", status: "New" },
  { name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+91 99012 44567", project: "Disha Windsor Gardens", type: "Enquiry", status: "Contacted" },
  { name: "Sandeep Reddy", email: "sandeep.r@yahoo.com", phone: "+91 90087 65521", project: "Disha Park West", type: "Brochure", status: "New" },
  { name: "Aisha Khan", email: "aisha.k@gmail.com", phone: "+971 50 332 1144", project: "Disha Central Park", type: "Enquiry", status: "New" },
  { name: "Vikram Joshi", email: "vikram.j@gmail.com", phone: "+91 98765 09876", project: "Disha Windsor Gardens", type: "Site Visit", status: "Closed" },
];

// POST /api/seed?key=SECRET   or   GET /api/seed?key=SECRET&force=true
// Protected by SEED_SECRET env var. Refuses to run if data already exists
// unless ?force=true is passed (so it can't accidentally wipe live data).
export const runSeed = asyncHandler(async (req, res) => {
  const provided = req.query.key || req.headers["x-seed-key"];
  const secret = process.env.SEED_SECRET;

  if (!secret) {
    return res.status(503).json({ message: "Seeding disabled: SEED_SECRET is not set on the server." });
  }
  if (provided !== secret) {
    return res.status(401).json({ message: "Invalid or missing seed key." });
  }

  const force = req.query.force === "true";
  const existingProjects = await Project.countDocuments();
  if (existingProjects > 0 && !force) {
    return res.status(409).json({
      message: `Database already has ${existingProjects} projects. Pass &force=true to wipe and re-seed.`,
    });
  }

  // Wipe + reseed
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    News.deleteMany({}),
    Lead.deleteMany({}),
  ]);

  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || "Disha Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@dishadwellings.com",
    password: process.env.SEED_ADMIN_PASSWORD || "disha@2025",
    role: "admin",
  });

  const featuredSlugs = new Set(["disha-central-park", "disha-windsor-gardens", "disha-park-west"]);
  const projects = data.projects.map((p) => ({ ...p, featured: featuredSlugs.has(p.slug) }));
  await Project.insertMany(projects);

  const news = data.news.map((n) => ({ ...n, published: true }));
  await News.insertMany(news);

  await Lead.insertMany(sampleLeads);

  res.json({
    message: "✅ Seed complete.",
    adminEmail: admin.email,
    projects: projects.length,
    news: news.length,
    leads: sampleLeads.length,
  });
});
