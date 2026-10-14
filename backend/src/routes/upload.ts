import path from "path";
import { Router, type Response, type Request } from "express";
import { requireAdmin } from "../middleware/auth";
import { uploadFile } from "../middleware/upload";
import { generateThumbnail } from "../utils/upload";
import { HttpError } from "../utils/error";
import { UPLOAD_URL } from "../constants/upload";

const router = Router();

router.post(
  "/",
  requireAdmin,
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const thumbnail = await generateThumbnail(req.file);

    return res.status(200).json({
      mediaType: "image",
      mediaUrl: path.join(UPLOAD_URL, req.file.filename),
      thumbnailUrl: thumbnail.url,
    });
  },
);

export default router;
