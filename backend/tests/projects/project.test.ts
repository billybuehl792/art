import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { createProject, deleteProject } from "../../src/queries/projects";
import { projectCreateSchema } from "../../src/schemas/projects";

const url = "/api/projects/:id";
const getProjectUrl = (id: number) => url.replace(":id", id.toString());
const createTestProject = () =>
  createProject(projectCreateSchema.parse({ title: "created" }));

describe(`GET ${url}`, () => {
  it("returns a project by ID", async () => {
    const project = await createTestProject();

    try {
      const response = await request(app)
        .get(getProjectUrl(project.id))
        .expect(200);
      expect(response.body.id).toBe(project.id);
    } finally {
      try {
        await deleteProject(project.id);
      } catch (error) {
        console.error(`Error cleaning up project ${project.id}:`, error);
      }
    }
  });

  it("returns 404 for a nonexistent project", async () => {
    const nonexistentProjectId = 999999999;
    await request(app).get(getProjectUrl(nonexistentProjectId)).expect(404);
  });
});
