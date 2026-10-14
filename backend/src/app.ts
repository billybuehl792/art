import express from "express";
import cors from "cors";
import projects from "./routes/projects";
import upload from "./routes/upload";
import { errorHandler } from "./utils/error";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/projects", projects);
app.use("/upload", upload);

app.use(errorHandler);

export default app;
