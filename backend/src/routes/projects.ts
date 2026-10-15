import { Router, type Response, type Request } from "express";
import { requireAdmin } from "../middleware/auth";
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
  projectCreateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectUpdateSchema,
} from "../schemas/projects";
import { HttpError } from "../utils/error";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
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

router.get("/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);
  const project = await getProject(projectId);
  if (!project) throw new HttpError(404, "Project not found");

  return res.status(200).json(project);
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  const body = projectCreateSchema.parse(req.body);
  const project = await createProject(body);

  res.status(201).json(project);
});

router.patch("/:id", requireAdmin, async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);
  const body = projectUpdateSchema.parse(req.body);
  const project = await updateProject(projectId, body);

  return res.status(200).json(project);
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  const deleted = await deleteProject(id);

  if (!deleted) throw new HttpError(404, "Project not found");

  return res.status(204).send();
});

export default router;
