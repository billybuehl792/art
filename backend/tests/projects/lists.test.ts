import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";

const url = "/api/projects";

describe(`GET ${url}`, () => {
  it("can reach the endpoint", async () => {
    await request(app).get(url).expect(200);
  });

  it("returns a paginated list of projects", async () => {
    const response = await request(app).get(url).expect(200);

    expect(response.body).toMatchObject({
      page: 1,
      limit: 10,
      total: expect.any(Number),
      results: expect.any(Array),
    });
  });

  it("accepts pagination parameters", async () => {
    const response = await request(app)
      .get(url)
      .query({ page: 2, limit: 5 })
      .expect(200);

    expect(response.body.page).toBe(2);
    expect(response.body.limit).toBe(5);
    expect(response.body.results.length).toBeLessThanOrEqual(5);
  });

  it("rejects an invalid page", async () => {
    const response = await request(app)
      .get(url)
      .query({ page: -1 })
      .expect(400);

    expect(response.body).toBeDefined();
  });
});
