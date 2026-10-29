import type { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { UnsupportedFileTypeError } from "./utils";
import { MAX_FILE_SIZE, UPLOAD_DIR, ALLOWED_FILE_TYPES } from "./constants";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.slice("Bearer ".length);

  if (token !== process.env.ADMIN_API_KEY)
    return res.status(401).json({ error: "Unauthorized" });

  next();
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

export const uploadFile = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype))
      return cb(new UnsupportedFileTypeError());
    cb(null, true);
  },
});
