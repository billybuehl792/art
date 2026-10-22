import "dotenv/config";

import { pathToFileURL } from "node:url";
import { apiEndpoints } from "../endpoints";
import { idSchema } from "../../src/schemas/basic";

const main = async (id: number) => {
  const res = await apiEndpoints.projects.project(id).get();
  console.log(JSON.stringify(res.data, null, 2));
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const id = idSchema.parse(process.argv[2]);
  main(id).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
