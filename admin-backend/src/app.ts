import path from "path";
import express from "express";
import cors from "cors";
import type { Response, Request } from "express";
import { uploadFile } from "./middleware";
import {
  createProject,
  updateProject,
  getProjects,
  getProjectsCount,
  deleteProject,
  getProject,
} from "./queries";
import {
  HttpError,
  cleanupFiles,
  errorHandler,
  generateThumbnail,
  getThumbnailFilename,
} from "./utils";
import {
  idSchema,
  filenameSchema,
  projectCreateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectUpdateSchema,
  uploadResponseSchema,
  authRequestSchema,
} from "./schemas";
import { UPLOAD_DIR, UPLOAD_THUMBNAIL_DIR, UPLOAD_URL } from "./constants";

const app = express();

app.use(cors());
app.use(express.json());

/** Health  */

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

/** Auth */

app.get("/api/auth", async (req: Request, res: Response) => {
  const { username, password } = authRequestSchema.parse(req.body);
});

/** Projects */

app.get("/api/projects", async (req: Request, res: Response) => {
  const params = projectListRequestParamsSchema.parse(req.query);

  const [results, total] = await Promise.all([
    getProjects(params),
    getProjectsCount(params),
  ]);

  const response = projectListResponseSchema.parse({
    page: params.page,
    limit: params.limit,
    total,
    results,
  });

  res.json(response);
});

app.get("/api/projects/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);
  const project = await getProject(projectId);
  if (!project) throw new HttpError(404, "Project not found");

  return res.status(200).json(project);
});

app.post("/api/projects", async (req: Request, res: Response) => {
  const body = projectCreateSchema.parse(req.body);
  const project = await createProject(body);

  res.status(201).json(project);
});

app.patch("/api/projects/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);
  const body = projectUpdateSchema.parse(req.body);
  const project = await updateProject(projectId, body);

  return res.status(200).json(project);
});

app.delete("/api/projects/:id", async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const deleted = await deleteProject(id);

  if (!deleted) throw new HttpError(404, "Project not found");

  return res.status(204).send();
});

/** Uploads */

app.post(
  "/api/uploads",
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

app.delete("api/uploads/:filename", async (req: Request, res: Response) => {
  const filename = filenameSchema.parse(req.params);

  const filePath = path.join(UPLOAD_DIR, filename);
  const thumbnailPath = path.join(
    UPLOAD_THUMBNAIL_DIR,
    getThumbnailFilename(filename),
  );

  await cleanupFiles(filePath, thumbnailPath);

  return res.status(204).send();
});

app.use("/uploads", express.static(UPLOAD_DIR));

app.use(errorHandler);

export default app;
