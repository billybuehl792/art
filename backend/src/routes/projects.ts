import { Router, type Response, type Request } from "express";
import { z } from "zod";
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
  projectCreateBodySchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectUpdateBodySchema,
} from "../schemas/projects";
import { requireAdmin } from "../middleware/auth";

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

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await createProject(
      projectCreateBodySchema.parse(req.body),
    );

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Invalid project", details: error.issues });
    }

    console.error("Failed to create project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

router.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await updateProject(
      idSchema.parse(req.params.id),
      projectUpdateBodySchema.parse(req.body),
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    return res.status(200).json(project);
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: "Invalid project", details: error.issues });

    console.error("Failed to update project:", error);

    return res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await deleteProject(idSchema.parse(req.params.id));

    if (!project) return res.status(404).json({ error: "Project not found" });

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
