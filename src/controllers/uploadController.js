import multer from "multer";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Store file in memory; we stream it to Cloudinary.
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: (req, file, cb) => {
    const ok = /image\/(jpe?g|png|webp|gif)|application\/pdf|video\/mp4/.test(file.mimetype);
    cb(ok ? null : new Error("Unsupported file type"), ok);
  },
});

function streamToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `disha-signature/${folder}`, resource_type: "auto" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}

// POST /api/uploads  (admin) — field name: "file", optional ?folder=
export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file provided" });

  if (!isCloudinaryConfigured()) {
    return res.status(503).json({
      message:
        "Cloudinary is not configured. Add CLOUDINARY_* env vars to enable uploads.",
    });
  }

  const folder = req.query.folder || "media";
  const result = await streamToCloudinary(req.file.buffer, folder);

  res.status(201).json({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    bytes: result.bytes,
  });
});
