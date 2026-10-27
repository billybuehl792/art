import { Router, type Response, type Request } from "express";
import { requireAdmin } from "../../middleware/auth";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../../queries/projects";
import { idSchema } from "../../schemas/basic";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "../../schemas/projects";
import { HttpError } from "../../utils/error";

const adminProjectsRouter = Router();

adminProjectsRouter.get("/", async (req: Request, res: Response) => {
  res.json({ page: 1, limit: 21, total: 0, results: [] });
});

adminProjectsRouter.post(
  "/",
  requireAdmin,
  async (req: Request, res: Response) => {
    const body = projectCreateSchema.parse(req.body);
    const project = await createProject(body);

    res.status(201).json(project);
  },
);

adminProjectsRouter.patch(
  "/:id",
  requireAdmin,
  async (req: Request, res: Response) => {
    const projectId = idSchema.parse(req.params.id);
    const body = projectUpdateSchema.parse(req.body);
    const project = await updateProject(projectId, body);

    return res.status(200).json(project);
  },
);

adminProjectsRouter.delete(
  "/:id",
  requireAdmin,
  async (req: Request, res: Response) => {
    const id = idSchema.parse(req.params.id);
    const deleted = await deleteProject(id);

    if (!deleted) throw new HttpError(404, "Project not found");

    return res.status(204).send();
  },
);

export default adminProjectsRouter;
