import type {
  Project,
  ProjectListRequestParams,
  ProjectListResponse,
} from "@/types/projects";

export const getMockProject = (body?: Partial<Project>): Project => {
  const id = body?.id ?? 1;

  return {
    id,
    title: `Mock Project ${id}`,
    subtitle: `Project ${id} subtitle`,
    description: `Project ${id} description.`,
    category: null,
    link: null,
    mediaType: null,
    mediaUrl: null,
    thumbnailUrl: null,
    sortOrder: 0,
    createdAt: new Date(),
    ...body,
  };
};

export const getMockProjectList = (
  params?: ProjectListRequestParams,
): ProjectListResponse => {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;

  return {
    page,
    limit,
    total: 100,
    results: Array(limit)
      .fill(null)
      .map((_, index) => getMockProject({ id: page * limit + index })),
  };
};
