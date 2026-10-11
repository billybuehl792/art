import { Router, type Response, type Request } from "express";
import { requireAdmin } from "../middleware/auth";
import { uploadFile } from "../middleware/upload";
import { cleanupFiles, generateThumbnail } from "../utils/upload";

const router = Router();

router.post(
  "/",
  requireAdmin,
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    let thumbnailPath: string | undefined;

    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      if (!req.file.mimetype.startsWith("image/"))
        return res.status(400).json({ error: "File is not an image" });

      const thumbnail = await generateThumbnail(req.file);
      thumbnailPath = thumbnail.path;

      return res.status(200).json({
        mediaType: "image",
        mediaUrl: `/uploads/${req.file.filename}`,
        thumbnailUrl: thumbnail.url,
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
      await cleanupFiles(req.file?.path, thumbnailPath);

      return res.status(500).json({ error: "Failed to upload image" });
    }
  },
);

export default router;
