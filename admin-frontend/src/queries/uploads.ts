import { mutationOptions } from "@tanstack/react-query";
import { uploadEndpoints } from "@/endpoints/uploads";
import { UPLOADS_KEY } from "@/constants/uploads";

export const uploadQueries = {
  uploads: {
    post: () =>
      mutationOptions({
        mutationKey: [...UPLOADS_KEY, "post"],
        mutationFn: uploadEndpoints.uploads.post,
      }),
    delete: () =>
      mutationOptions({
        mutationKey: [...UPLOADS_KEY, "delete"],
        mutationFn: uploadEndpoints.uploads.delete,
      }),
  },
};
