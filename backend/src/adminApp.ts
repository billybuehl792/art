import express from "express";
import cors from "cors";
import upload from "./routes/upload";
import { errorHandler } from "./utils/error";
import { UPLOAD_DIR } from "./constants/upload";
import adminProjectsRouter from "./routes/admin/projects";

const adminApp = express();

adminApp.use(cors());
adminApp.use(express.json());

adminApp.get("/admin/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

adminApp.use("/admin/api/projects", adminProjectsRouter);
// adminApp.use("/api/upload", upload);

// adminApp.use("/uploads", express.static(UPLOAD_DIR));

adminApp.use(errorHandler);

export default adminApp;
