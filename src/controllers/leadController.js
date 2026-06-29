import Lead from "../models/Lead.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/leads  — public (from any site form)
export const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required" });
  }
  const lead = await Lead.create(req.body);
  res.status(201).json({ message: "Thank you — our team will be in touch shortly.", lead });
});

// GET /api/leads  — admin, supports ?status= &type=
export const listLeads = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (type && type !== "All") filter.type = type;

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json({ count: leads.length, leads });
});

// PATCH /api/leads/:id  — admin (update status)
export const updateLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true }
  );
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json({ lead });
});

// DELETE /api/leads/:id  — admin
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json({ message: "Lead deleted", id: req.params.id });
});

// GET /api/leads/stats  — admin dashboard metrics
export const leadStats = asyncHandler(async (req, res) => {
  const [total, byStatus, byType] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
  ]);

  const statusMap = byStatus.reduce((a, c) => ({ ...a, [c._id]: c.count }), {});
  const typeMap = byType.reduce((a, c) => ({ ...a, [c._id]: c.count }), {});

  res.json({
    total,
    new: statusMap.New || 0,
    contacted: statusMap.Contacted || 0,
    closed: statusMap.Closed || 0,
    byType: typeMap,
  });
});
