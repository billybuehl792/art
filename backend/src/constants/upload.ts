import path from "path";

export const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");
export const UPLOAD_THUMBNAIL_DIR = path.join(UPLOAD_DIR, "thumbnails");
export const UPLOAD_URL = "/uploads";
export const UPLOAD_THUMBNAIL_URL = `${UPLOAD_URL}/thumbnails`;

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500 MB

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];
