import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    project: { type: String, default: "" }, // project name (free text — survives project deletion)
    message: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Enquiry", "Site Visit", "Brochure", "Newsletter", "Career"],
      default: "Enquiry",
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Closed"],
      default: "New",
    },
    // optional extra fields used by site-visit / career forms
    preferredDate: { type: String, default: "" },
    preferredTime: { type: String, default: "" },
    role: { type: String, default: "" }, // career applications
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
