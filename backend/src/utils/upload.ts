import fs from "node:fs/promises";
import path from "path";
import sharp from "sharp";
import {
  UPLOAD_DIR,
  UPLOAD_THUMBNAIL_DIR,
  UPLOAD_URL,
  UPLOAD_THUMBNAIL_URL,
} from "../constants/upload";

export const generateThumbnail = async (file: Express.Multer.File) => {
  const thumbnailFilename = `thumbnail-${file.filename}`;
  const thumbnailPath = path.join(UPLOAD_THUMBNAIL_DIR, thumbnailFilename);
  const thumbnailUrl = path.join(UPLOAD_THUMBNAIL_URL, thumbnailFilename);

  await sharp(file.path)
    .resize({ width: 600, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);

  return {
    filename: thumbnailFilename,
    path: thumbnailPath,
    url: thumbnailUrl,
  };
};

export const cleanupFiles = async (...filePaths: (string | undefined)[]) => {
  await Promise.all(
    filePaths
      .filter((filePath): filePath is string => Boolean(filePath))
      .map(async (filePath) => {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          // Ignore files that don't exist; log other failures.
          if ((error as NodeJS.ErrnoException).code !== "ENOENT")
            console.error(`Failed to delete file ${filePath}:`, error);
        }
      }),
  );
};

export const mediaUrlToPath = (url: string | null | undefined) => {
  if (!url) return undefined;

  // Only accept URLs belonging to our uploads directory.
  if (!url.startsWith(UPLOAD_URL)) throw new Error(`Invalid media URL: ${url}`);

  const fileName = path.basename(url);
  const filePath = path.resolve(UPLOAD_DIR, fileName);

  // Prevent path traversal outside UPLOAD_DIR.
  if (!filePath.startsWith(`${path.resolve(UPLOAD_DIR)}${path.sep}`))
    throw new Error(`Invalid media path: ${url}`);

  return filePath;
};
