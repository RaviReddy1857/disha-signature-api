import mongoose from "mongoose";

const floorPlanSchema = new mongoose.Schema(
  { name: String, area: String, price: String },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  { q: String, a: String },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, default: "" },
    city: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Residential", "Commercial", "Villas", "Plots"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed", "Upcoming"],
      required: true,
    },
    startingPrice: { type: String, default: "" },
    priceValue: { type: Number, default: 0 }, // lakhs, for sorting
    rera: { type: String, default: "" },
    hero: { type: String, default: "" }, // CSS gradient string
    accent: { type: String, default: "#C9A24B" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    unitTypes: { type: [String], default: [] },
    totalArea: { type: String, default: "" },
    possession: { type: String, default: "" },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    gallery: { type: [String], default: [] }, // gradient strings or Cloudinary URLs
    floorPlans: { type: [floorPlanSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
    mapQuery: { type: String, default: "" },
    brochureUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ name: "text", location: "text", city: "text" });

export default mongoose.model("Project", projectSchema);
