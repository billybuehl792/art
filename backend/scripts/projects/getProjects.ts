import "dotenv/config";

import { pathToFileURL } from "node:url";
import { apiEndpoints } from "../endpoints";

const main = async () => {
  const res = await apiEndpoints.projects.get();
  console.log(JSON.stringify(res.data, null, 2));
};

if (import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
