import { verifyToken } from "../utils/token.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Verifies the Bearer token, attaches req.user. Rejects otherwise.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Not authorized — user no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized — token invalid or expired" });
  }
});

// Restrict to specific roles, e.g. restrictTo("admin")
export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden — insufficient permissions" });
    }
    next();
  };
