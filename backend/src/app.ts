import express from "express";
import cors from "cors";
import projectsRouter from "./routes/projects";
import { errorHandler } from "./utils/errors";
import { UPLOAD_DIR } from "./constants/uploads";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projectsRouter);
app.use("/uploads", express.static(UPLOAD_DIR));

app.use(errorHandler);

export default app;
