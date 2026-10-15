import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import {
  projectCreateSchema,
  projectUpdateSchema,
} from "../../src/schemas/projects";
import { createProject, deleteProject } from "../../src/queries/projects";

const url = "/api/projects/:id";
const adminApiKey = process.env.ADMIN_API_KEY;
const getProjectUrl = (id: number) => url.replace(":id", id.toString());
const adminPatch = (url: string) =>
  request(app).patch(url).set("Authorization", `Bearer ${adminApiKey}`);
const createTestProject = () =>
  createProject(projectCreateSchema.parse({ title: "created" }));

describe(`PATCH ${url}`, () => {
  beforeAll(() => {
    if (!adminApiKey) throw new Error("ADMIN_API_KEY is not configured");
  });

  it("rejects requests without admin authentication", async () => {
    const payload = projectUpdateSchema.parse({ title: "updated" });
    await request(app).patch(getProjectUrl(1)).send(payload).expect(401);
  });

  it("updates a project", async () => {
    const project = await createTestProject();

    const payload = projectUpdateSchema.parse({ title: "updated" });
    const response = await adminPatch(getProjectUrl(project.id))
      .send(payload)
      .expect(200);

    expect(response.body.id).toBeDefined();

    try {
      expect(response.body).toMatchObject({ title: payload.title });
    } finally {
      await deleteProject(response.body.id);
    }
  });

  it("rejects invalid input", async () => {
    const project = await createTestProject();
    await adminPatch(getProjectUrl(project.id)).send({}).expect(400);
    await deleteProject(project.id);
  });
});
