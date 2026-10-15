import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { projectCreateSchema } from "../../src/schemas/projects";
import { createProject, deleteProject } from "../../src/queries/projects";

const url = "/api/projects/:id";
const adminApiKey = process.env.ADMIN_API_KEY;
const getProjectUrl = (id: number) => url.replace(":id", id.toString());
const adminDelete = (url: string) =>
  request(app).delete(url).set("Authorization", `Bearer ${adminApiKey}`);
const createTestProject = () =>
  createProject(projectCreateSchema.parse({ title: "created" }));

describe(`DELETE ${url}`, () => {
  beforeAll(() => {
    if (!adminApiKey) throw new Error("ADMIN_API_KEY is not configured");
  });

  it("rejects requests without admin authentication", async () => {
    await request(app).delete(url).expect(401);
  });

  it("deletes a project", async () => {
    const project = await createTestProject();

    try {
      await adminDelete(getProjectUrl(project.id)).expect(204);
    } finally {
      await deleteProject(project.id);
    }
  });

  it("rejects nonexistent projects", async () => {
    const nonexistentProjectId = 999999999;
    await adminDelete(getProjectUrl(nonexistentProjectId)).expect(404);
  });
});
