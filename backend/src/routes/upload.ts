import path from "path";
import fs from "node:fs/promises";
import { Router, type Response, type Request } from "express";
import { requireAdmin } from "../middleware/auth";
import { uploadFile } from "../middleware/upload";
import { generateThumbnail, getThumbnailFilename } from "../utils/upload";
import { HttpError } from "../utils/error";
import { uploadResponseSchema } from "../schemas/upload";
import {
  UPLOAD_DIR,
  UPLOAD_THUMBNAIL_DIR,
  UPLOAD_URL,
} from "../constants/upload";

const router = Router();

router.post(
  "/",
  requireAdmin,
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const thumbnail = await generateThumbnail(req.file);

    const response = uploadResponseSchema.parse({
      mediaType: req.file.mimetype,
      mediaUrl: path.join(UPLOAD_URL, req.file.filename),
      thumbnailUrl: thumbnail.url,
    });

    return res.status(200).json(response);
  },
);

router.delete(
  "/:filename",
  requireAdmin,
  async (req: Request, res: Response) => {
    let filename = req.params.filename;

    // Prevent path traversal and unexpected filenames
    if (
      !filename ||
      Array.isArray(filename) ||
      filename !== path.basename(filename)
    )
      throw new HttpError(400, "Invalid filename");

    filename = path.basename(filename);
    const filePath = path.join(UPLOAD_DIR, filename);
    const thumbnailPath = path.join(
      UPLOAD_THUMBNAIL_DIR,
      getThumbnailFilename(filename),
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        throw new HttpError(404, "Upload not found");
      throw error;
    }
    await fs.unlink(thumbnailPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });

    return res.status(204).send();
  },
);

export default router;
