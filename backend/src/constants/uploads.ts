import path from "path";

const PROJECT_ROOT = path.resolve(__dirname, "../../..");

export const UPLOAD_DIR = path.join(PROJECT_ROOT, "uploads");
export const UPLOAD_THUMBNAIL_DIR = path.join(UPLOAD_DIR, "thumbnails");

export const UPLOAD_URL = "/uploads";
export const UPLOAD_THUMBNAIL_URL = `${UPLOAD_URL}/thumbnails`;
