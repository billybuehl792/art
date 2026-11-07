import path from "path";
import { Router, type Response, type Request } from "express";
import { uploadFile } from "../middleware/uploads";
import { filenameSchema } from "../schemas/basic";
import { uploadResponseSchema } from "../schemas/uploads";
import { HttpError } from "../utils/errors";
import {
  cleanupFiles,
  generateThumbnail,
  getThumbnailFilename,
} from "../utils/uploads";
import {
  UPLOAD_DIR,
  UPLOAD_THUMBNAIL_DIR,
  UPLOAD_THUMBNAIL_URL,
  UPLOAD_URL,
} from "../constants/uploads";

const uploadsRouter = Router();

uploadsRouter.post(
  "/",
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) throw new HttpError(400, "No file uploaded");

    const thumbnail = await generateThumbnail(req.file, UPLOAD_THUMBNAIL_DIR);

    const response = uploadResponseSchema.parse({
      mediaType: req.file?.mimetype,
      mediaUrl: req.file ? path.join(UPLOAD_URL, req.file.filename) : undefined,
      thumbnailUrl: thumbnail
        ? path.join(UPLOAD_THUMBNAIL_URL, thumbnail.filename)
        : undefined,
    });

    return res.status(200).json(response);
  },
);

uploadsRouter.delete("/:filename", async (req: Request, res: Response) => {
  const filename = filenameSchema.parse(req.params.filename);

  const filePath = path.join(UPLOAD_DIR, filename);
  const thumbnailPath = path.join(
    UPLOAD_THUMBNAIL_DIR,
    getThumbnailFilename(filename),
  );

  await cleanupFiles(filePath, thumbnailPath);

  return res.status(204).send();
});

export default uploadsRouter;
