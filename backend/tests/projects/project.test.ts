import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";

const url = "/api/projects/:id";
const getProjectUrl = (id: number) => url.replace(":id", id.toString());

describe(`GET ${url}`, () => {
  it("returns a project by ID", async () => {
    const existingProjectId = 1;

    const response = await request(app)
      .get(getProjectUrl(existingProjectId))
      .expect(200);

    expect(response.body.id).toBe(existingProjectId);
  });

  it("returns 404 for a nonexistent project", async () => {
    const nonexistentProjectId = 999999999;
    await request(app).get(getProjectUrl(nonexistentProjectId)).expect(404);
  });
});
