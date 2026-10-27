import express from "express";
import cors from "cors";
import projects from "./routes/projects";
import upload from "./routes/upload";
import { errorHandler } from "./utils/error";
import { UPLOAD_DIR } from "./constants/upload";

const adminApp = express();

adminApp.use(cors());
adminApp.use(express.json());

adminApp.get("/admin/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

adminApp.use("/admin/api/projects", projects);
adminApp.use("/admin/api/upload", upload);

adminApp.use("/admin/uploads", express.static(UPLOAD_DIR));

adminApp.use(errorHandler);

export default adminApp;
