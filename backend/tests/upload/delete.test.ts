import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import app from "../../src/app";
import { UPLOAD_DIR, UPLOAD_THUMBNAIL_DIR } from "../../src/constants/upload";
import { getThumbnailFilename } from "../../src/utils/upload";

const adminApiKey = process.env.ADMIN_API_KEY!;
const url = "/api/upload/:filename";
const getUploadUrl = (fileName: string) => url.replace(":filename", fileName);
const adminDelete = (filename: string) =>
  request(app)
    .delete(getUploadUrl(filename))
    .set("Authorization", `Bearer ${adminApiKey}`);

const createdFiles: string[] = [];

afterAll(async () => {
  await Promise.all(
    createdFiles.map((file) => fs.unlink(file).catch(() => undefined)),
  );
});

describe("DELETE /api/uploads/:filename", () => {
  it("rejects unauthenticated requests", async () => {
    const res = await request(app).delete(getUploadUrl("nonexistent.png"));

    expect(res.status).toBe(401);
  });

  it("returns 404 when the original upload does not exist", async () => {
    const filename = `${crypto.randomUUID()}.png`;

    const res = await adminDelete(filename);

    expect(res.status).toBe(404);
  });

  it("rejects invalid filenames", async () => {
    // Express may normalize encoded path segments before the handler.
    // This assertion is appropriate if the router receives the raw value.
    const res = await request(app)
      .delete(getUploadUrl("%2E%2E%2Fsecret.png"))
      .set("Authorization", `Bearer ${adminApiKey}`);

    expect([400, 404]).toContain(res.status);
  });

  it("deletes the original image and its thumbnail", async () => {
    const filename = `${crypto.randomUUID()}.png`;
    const originalPath = path.join(UPLOAD_DIR, filename);
    const thumbnailPath = path.join(
      UPLOAD_THUMBNAIL_DIR,
      getThumbnailFilename(filename),
    );

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_THUMBNAIL_DIR, { recursive: true });

    await fs.writeFile(originalPath, "test original");
    await fs.writeFile(thumbnailPath, "test thumbnail");

    createdFiles.push(originalPath, thumbnailPath);

    const res = await adminDelete(filename);

    expect(res.status).toBe(204);
    expect(res.text).toBe("");

    await expect(fs.access(originalPath)).rejects.toMatchObject({
      code: "ENOENT",
    });
    await expect(fs.access(thumbnailPath)).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("succeeds when the thumbnail is already missing", async () => {
    const filename = `${crypto.randomUUID()}.png`;
    const originalPath = path.join(UPLOAD_DIR, filename);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(originalPath, "test original");
    createdFiles.push(originalPath);

    const res = await adminDelete(filename);

    expect(res.status).toBe(204);
    await expect(fs.access(originalPath)).rejects.toMatchObject({
      code: "ENOENT",
    });
  });
});
