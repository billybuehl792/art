import { projectSchema } from "@/schemas/projects";
import type { Project } from "@/types/projects";

export const getMockProject = (body?: Partial<Project>) => {
  const id = body?.id ?? 1;

  return projectSchema.parse({
    id,
    title: `Mock Project ${id}`,
    subtitle: `Mock Project ${id} Subtitle`,
    description: `Mock Project ${id} Description`,
    category: null,
    link: null,
    mediaType: null,
    mediaUrl: null,
    thumbnailUrl: null,
    priority: 1,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...body,
  });
};
