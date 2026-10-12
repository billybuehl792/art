import { Router, type Response, type Request } from "express";
import path from "path";
import { z } from "zod";
import { requireAdmin } from "../middleware/auth";
import { uploadFile } from "../middleware/upload";
import {
  createProject,
  updateProject,
  getProjects,
  getProjectsCount,
  deleteProject,
  getProject,
} from "../queries/projects";
import {
  idSchema,
  projectCreateFormSchema,
  projectCreateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectUpdateFormSchema,
  projectUpdateSchema,
} from "../schemas/projects";
import {
  cleanupFiles,
  generateThumbnail,
  mediaUrlToPath,
} from "../utils/upload";
import { HttpError } from "../utils/error";
import { UPLOAD_URL } from "../constants/upload";

const router = Router();

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await getProject(idSchema.parse(req.params.id));
    if (!project) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: "Invalid project ID", details: error.issues });

    console.error("Failed to fetch project:", error);

    return res.status(500).json({ error: "Failed to fetch project" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const params = projectListRequestParamsSchema.parse(req.query);
    const [results, total] = await Promise.all([
      getProjects(params),
      getProjectsCount(params),
    ]);

    res.json(
      projectListResponseSchema.parse({
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
        results,
      }),
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid request parameters", details: error.issues });
    }

    console.error("Failed to fetch projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post(
  "/",
  requireAdmin,
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    let thumbnailPath: string | undefined;

    try {
      const body = projectCreateFormSchema.parse(req.body);
      let createData = projectCreateSchema.parse(body);

      if (req.file) {
        if (!req.file.mimetype.startsWith("image/"))
          throw new HttpError(400, "Image uploads only for now");

        const thumbnail = await generateThumbnail(req.file);

        thumbnailPath = thumbnail.path;
        createData.mediaType = "image";
        createData.mediaUrl = path.join(UPLOAD_URL, req.file.filename);
        createData.thumbnailUrl = thumbnail.url;
      }

      const project = await createProject(createData);

      res.status(201).json(project);
    } catch (error) {
      await cleanupFiles(req.file?.path, thumbnailPath);

      if (error instanceof HttpError)
        return res.status(error.status).json({ error: error.message });

      if (error instanceof z.ZodError)
        return res
          .status(400)
          .json({ error: "Invalid project", details: error.issues });

      console.error("Failed to create project:", error);

      res.status(500).json({ error: "Failed to create project" });
    }
  },
);

router.patch(
  "/:id",
  requireAdmin,
  uploadFile.single("file"),
  async (req: Request, res: Response) => {
    let newThumbnailPath: string | undefined;

    try {
      const projectId = idSchema.parse(req.params.id);
      const body = projectUpdateFormSchema.parse(req.body);

      const existingProject = await getProject(projectId);
      if (!existingProject) throw new HttpError(404, "Project not found");

      let updateData = projectUpdateSchema.parse(body);

      if (req.file) {
        if (!req.file.mimetype.startsWith("image/"))
          throw new HttpError(400, "Image uploads only for now");

        const thumbnail = await generateThumbnail(req.file);
        newThumbnailPath = thumbnail.path;
        updateData.mediaUrl = path.join(UPLOAD_URL, req.file.filename);
        updateData.thumbnailUrl = thumbnail.url;
        updateData.mediaType = "image";
      }

      const project = await updateProject(projectId, updateData);
      if (!project) throw new HttpError(404, "Project not found");

      // Remove old media only after the database update succeeds.
      if (req.file)
        await cleanupFiles(
          mediaUrlToPath(existingProject.mediaUrl),
          mediaUrlToPath(existingProject.thumbnailUrl),
        );

      return res.status(200).json(project);
    } catch (error) {
      await cleanupFiles(req.file?.path, newThumbnailPath);

      if (error instanceof HttpError)
        return res.status(error.status).json({ error: error.message });

      if (error instanceof z.ZodError)
        return res
          .status(400)
          .json({ error: "Invalid project", details: error.issues });

      console.error("Failed to update project:", error);

      return res.status(500).json({ error: "Failed to update project" });
    }
  },
);

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const projectId = idSchema.parse(req.params.id);

    const project = await getProject(projectId);
    if (!project) return res.status(404).json({ error: "Project not found" });

    await deleteProject(projectId);
    await cleanupFiles(
      mediaUrlToPath(project.mediaUrl),
      mediaUrlToPath(project.thumbnailUrl),
    );

    return res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: "Invalid project ID", details: error.issues });

    console.error("Failed to delete project:", error);

    return res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
