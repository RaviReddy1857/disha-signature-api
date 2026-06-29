import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ["Launch", "Award", "Milestone", "Sustainability", "Press", "Blog", "Community", "Lifestyle"],
      default: "Press",
    },
    date: { type: String, default: "" }, // display date e.g. "12 Jun 2026"
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

newsSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

export default mongoose.model("News", newsSchema);
