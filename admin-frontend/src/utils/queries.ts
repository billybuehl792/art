import type { InfiniteData } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export function reorderInfiniteData<
  T,
  TPage extends AxiosResponse<{ results: T[] }>,
>(data: InfiniteData<TPage>, items: T[]): InfiniteData<TPage> {
  let offset = 0;

  return {
    ...data,
    pages: data.pages.map((page) => {
      const results = items.slice(offset, offset + page.data.results.length);
      offset += page.data.results.length;
      return { ...page, data: { ...page.data, results } };
    }),
  };
}
