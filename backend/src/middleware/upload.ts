import multer from "multer";
import path from "path";
import { UnsupportedFileTypeError } from "../utils/error";
import {
  MAX_FILE_SIZE,
  UPLOAD_DIR,
  ALLOWED_FILE_TYPES,
} from "../constants/upload";

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
