import { Router, type Response, type Request } from "express";
import {
  createProject,
  updateProject,
  getProjects,
  getProjectsCount,
  deleteProject,
  getProject,
  reorderProject,
} from "../queries/projects";
import { HttpError } from "../utils/errors";
import { idSchema } from "../schemas/basic";
import {
  projectCreateSchema,
  projectListRequestParamsSchema,
  projectListResponseSchema,
  projectListReorderSchema,
  projectUpdateSchema,
} from "../schemas/projects";

const projectsRouter = Router();

projectsRouter.get("/", async (req: Request, res: Response) => {
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

projectsRouter.post("/", async (req: Request, res: Response) => {
  const body = projectCreateSchema.parse(req.body);

  const project = await createProject(body);

  res.status(201).json(project);
});

projectsRouter.get("/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);

  const project = await getProject(projectId);
  if (!project) throw new HttpError(404, "Project not found");

  res.status(200).json(project);
});

projectsRouter.patch("/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);
  const body = projectUpdateSchema.parse(req.body);

  const project = await updateProject(projectId, body);

  res.status(200).json(project);
});

projectsRouter.delete("/:id", async (req: Request, res: Response) => {
  const id = idSchema.parse(req.params.id);
  await deleteProject(id);

  res.sendStatus(204);
});

projectsRouter.patch("/reorder", async (req: Request, res: Response) => {
  const body = projectListReorderSchema.parse(req.body);
  await reorderProject(body);

  res.sendStatus(204);
});

export default projectsRouter;
