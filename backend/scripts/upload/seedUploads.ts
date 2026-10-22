import "dotenv/config";

import path from "node:path";
import { pathToFileURL } from "node:url";
import { uploadFilesFromDir } from "./createUpload";
import { DEFAULT_TEST_DATA_DIR } from "../constants";

const main = async (dirPath: string) => {
  const res = await uploadFilesFromDir(dirPath);

  console.log(
    `Uploaded Files:\n`,
    JSON.stringify(
      res.map(({ data }) => data),
      null,
      2,
    ),
  );
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const uploadDirPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : DEFAULT_TEST_DATA_DIR;

  main(uploadDirPath).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
