import "dotenv/config";
import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import News from "../models/News.js";
import Lead from "../models/Lead.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(__dirname, "data.json"), "utf-8"));

const sampleLeads = [
  { name: "Rajesh Menon", email: "rajesh.m@gmail.com", phone: "+91 98480 22113", project: "Disha Azure Heights", type: "Site Visit", status: "New" },
  { name: "Priya Nair", email: "priya.nair@outlook.com", phone: "+91 99012 44567", project: "Disha Emerald Villas", type: "Enquiry", status: "Contacted" },
  { name: "Sandeep Reddy", email: "sandeep.r@yahoo.com", phone: "+91 90087 65521", project: "Disha Grand Meadows", type: "Brochure", status: "New" },
  { name: "Aisha Khan", email: "aisha.k@gmail.com", phone: "+971 50 332 1144", project: "Disha Signature Square", type: "Enquiry", status: "New" },
  { name: "Vikram Joshi", email: "vikram.j@gmail.com", phone: "+91 98765 09876", project: "Disha Riverfront Residences", type: "Site Visit", status: "Closed" },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing collections…");
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    News.deleteMany({}),
    Lead.deleteMany({}),
  ]);

  // ─── Admin user ───────────────────────────────
  const admin = await User.create({
    name: process.env.SEED_ADMIN_NAME || "Disha Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@dishasignature.com",
    password: process.env.SEED_ADMIN_PASSWORD || "disha@2025",
    role: "admin",
  });
  console.log(`✓ Admin created: ${admin.email}`);

  // ─── Projects ─────────────────────────────────
  const featuredSlugs = new Set([
    "disha-azure-heights",
    "disha-emerald-villas",
    "disha-signature-square",
  ]);
  const projects = data.projects.map((p) => ({
    ...p,
    featured: featuredSlugs.has(p.slug),
  }));
  await Project.insertMany(projects);
  console.log(`✓ ${projects.length} projects seeded`);

  // ─── News ─────────────────────────────────────
  const news = data.news.map((n) => ({ ...n, published: true }));
  await News.insertMany(news);
  console.log(`✓ ${news.length} news articles seeded`);

  // ─── Sample leads ─────────────────────────────
  await Lead.insertMany(sampleLeads);
  console.log(`✓ ${sampleLeads.length} sample leads seeded`);

  console.log("\n✅ Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
