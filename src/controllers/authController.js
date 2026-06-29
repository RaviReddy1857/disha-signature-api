import User from "../models/User.js";
import { signToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signToken({ id: user._id, role: user.role });
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me  (protected)
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
