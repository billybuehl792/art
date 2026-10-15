import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { UPLOAD_DIR, UPLOAD_THUMBNAIL_DIR } from "../../src/constants/upload";

const adminApiKey = process.env.ADMIN_API_KEY!;
const url = "/api/upload";
const adminPost = () =>
  request(app).post(url).set("Authorization", `Bearer ${adminApiKey}`);

let png: Buffer;
const createdFiles: string[] = [];

beforeAll(async () => {
  png = await sharp({
    create: {
      width: 1,
      height: 1,
      channels: 4,
      background: { r: 255, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
});

afterAll(async () => {
  await Promise.all(
    createdFiles.map((file) => fs.unlink(file).catch(() => undefined)),
  );
});

describe(`POST ${url}`, () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).post(url);

    expect(res.status).toBe(401);
  });

  it("rejects requests without a file", async () => {
    const res = await adminPost();

    expect(res.status).toBe(400);
  });

  it("uploads an image and returns its URLs", async () => {
    const res = await adminPost().attach("file", png, {
      filename: "test.png",
      contentType: "image/png",
    });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      mediaType: "image",
      mediaUrl: expect.any(String),
      thumbnailUrl: expect.any(String),
    });

    const originalPath = path.join(
      UPLOAD_DIR,
      path.basename(res.body.mediaUrl),
    );
    const thumbnailPath = path.join(
      UPLOAD_THUMBNAIL_DIR,
      path.basename(res.body.thumbnailUrl),
    );

    createdFiles.push(originalPath, thumbnailPath);

    await expect(fs.access(originalPath)).resolves.toBeUndefined();
    await expect(fs.access(thumbnailPath)).resolves.toBeUndefined();
  });
});
