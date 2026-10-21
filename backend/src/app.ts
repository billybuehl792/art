import express from "express";
import cors from "cors";
import projects from "./routes/projects";
import upload from "./routes/upload";
import { errorHandler } from "./utils/error";
import { UPLOAD_DIR } from "./constants/upload";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projects);
app.use("/api/upload", upload);

app.use("/uploads", express.static(UPLOAD_DIR));

app.use(errorHandler);

export default app;
