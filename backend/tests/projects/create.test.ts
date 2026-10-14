import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { projectCreateSchema } from "../../src/schemas/projects";

const url = "/api/projects";
const adminApiKey = process.env.ADMIN_API_KEY!;

describe(`POST ${url}`, () => {
  beforeAll(() => {
    if (!adminApiKey) throw new Error("ADMIN_API_KEY is not configured");
  });

  const createPayload = projectCreateSchema.parse({
    title: "Test Project",
    subtitle: "integration test project",
    description: "A project created during testing",
  });

  it("rejects requests without admin authentication", async () => {
    await request(app).post(url).send(createPayload).expect(401);
  });

  it("creates a project", async () => {
    const response = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${adminApiKey}`)
      .send(createPayload)
      .expect(201);

    expect(response.body).toMatchObject({
      title: createPayload.title,
      description: createPayload.description,
    });

    expect(response.body.id).toBeDefined();
  });

  it("rejects invalid input", async () => {
    await request(app)
      .post(url)
      .set("Authorization", `Bearer ${adminApiKey}`)
      .send({})
      .expect(400);
  });
});
