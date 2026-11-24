import { Router, type Response, type Request } from "express";
import { getProjects, getProjectsCount, getProject } from "../queries/projects";
import { HttpError } from "../utils/errors";
import { idSchema } from "../schemas/basic";
import {
  projectListRequestParamsSchema,
  projectListResponseSchema,
} from "../schemas/projects";

const projectsRouter = Router();

projectsRouter.get("/", async (req: Request, res: Response) => {
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
      results,
    }),
  );
});

projectsRouter.get("/:id", async (req: Request, res: Response) => {
  const projectId = idSchema.parse(req.params.id);

  const project = await getProject(projectId);
  if (!project) throw new HttpError(404, "Project not found");

  res.status(200).json(project);
});

export default projectsRouter;
