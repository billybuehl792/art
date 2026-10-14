import type { ErrorRequestHandler } from "express";
import { z } from "zod";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class UnsupportedFileTypeError extends Error {
  constructor() {
    super("Unsupported file type. Please upload a JPEG, PNG, or WebP image.");
    this.name = "UnsupportedFileTypeError";
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof UnsupportedFileTypeError)
    return res.status(415).json({ error: error.message });

  if (error instanceof z.ZodError)
    return res
      .status(400)
      .json({ error: "Invalid request", details: error.issues });

  if (error instanceof HttpError)
    return res.status(error.status).json({ error: error.message });

  res.status(500).json({ error: "Internal server error" });
};
