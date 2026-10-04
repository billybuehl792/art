import { Router, type Response } from "express";
import { z } from "zod";
import {
  createProject,
  getProjects,
  getProjectsCount,
} from "../queries/projects";
import {
  projectCreateBodySchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
} from "../schemas/projects";
import type {
  ProjectCreateRequest,
  ProjectListRequest,
} from "../types/projects";

const router = Router();

router.get("/", async (req: ProjectListRequest, res: Response) => {
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

router.post("/", async (req: ProjectCreateRequest, res: Response) => {
  try {
    const params = projectCreateBodySchema.parse(req.body);
    const project = await createProject(params);

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

export default router;
