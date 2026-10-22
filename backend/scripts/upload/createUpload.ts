import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import FormData from "form-data";
import axios from "axios";
import { pathToFileURL } from "node:url";
import mime from "mime-types";
import { apiEndpoints } from "../endpoints";

export const uploadFileFromPath = async (filePath: string) => {
  if (!filePath) throw new Error("Please provide a file path.");

  const stats = await fs.promises.stat(filePath).catch(() => null);
  if (!stats?.isFile()) throw new Error(`Not a valid file: ${filePath}`);

  const fileStream = fs.createReadStream(filePath);

  return await apiEndpoints.upload.post(fileStream);
};

export const uploadFilesFromDir = async (dirPath: string) => {
  if (!(await fs.promises.stat(dirPath).catch(() => null))?.isDirectory())
    throw new Error(`Upload directory does not exist: ${dirPath}`);

  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  const filePaths = entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(dirPath, entry.name));

  const uploads = await Promise.all(
    filePaths.map((filePath) =>
      uploadFileFromPath(filePath).catch((error: Error) =>
        console.error(error.message),
      ),
    ),
  );

  return uploads.filter((upload) => !!upload);
};

const main = async (filePath: string) => {
  const res = await uploadFileFromPath(filePath);
  console.log(JSON.stringify(res.data, null, 2));
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const filePath = process.argv[2];
  main(filePath).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
