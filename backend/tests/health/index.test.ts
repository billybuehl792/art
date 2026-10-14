import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";

const url = "/api/health";

describe(`GET ${url}`, () => {
  it("returns a 200 status and a JSON response", async () => {
    const response = await request(app).get(url).expect(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});
