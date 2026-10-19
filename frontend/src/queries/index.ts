import { queryOptions } from "@tanstack/react-query";
import { apiEndpoints } from "@/endpoints";

export const apiQueries = {
  health: {
    get: () =>
      queryOptions({ queryKey: ["health"], queryFn: apiEndpoints.health.get }),
  },
};
