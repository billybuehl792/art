import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { projectCreateSchema } from "../../src/schemas/projects";
import { deleteProject } from "../../src/queries/projects";

const url = "/api/projects";
const adminApiKey = process.env.ADMIN_API_KEY;
const adminPost = (url: string) =>
  request(app).post(url).set("Authorization", `Bearer ${adminApiKey}`);

describe(`POST ${url}`, () => {
  beforeAll(() => {
    if (!adminApiKey) throw new Error("ADMIN_API_KEY is not configured");
  });

  it("rejects requests without admin authentication", async () => {
    const payload = projectCreateSchema.parse({ title: "create" });
    await request(app).post(url).send(payload).expect(401);
  });

  it("creates a project", async () => {
    const payload = projectCreateSchema.parse({ title: "create" });
    const response = await adminPost(url).send(payload).expect(201);
    expect(response.body.id).toBeDefined();

    try {
      expect(response.body).toMatchObject({ title: payload.title });
    } finally {
      await deleteProject(response.body.id);
    }
  });

  it("rejects invalid input", async () => {
    await adminPost(url).send({}).expect(400);
  });
});
