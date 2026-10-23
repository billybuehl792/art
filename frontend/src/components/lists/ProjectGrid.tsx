import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
  useMediaQuery,
  type StackProps,
} from "@mui/material";
import { apiQueries } from "@/queries";
import { sxArray } from "@/utils/sx";
import { styled } from "@mui/material/styles";
import type { Project } from "@/types/projects";

const StyledImageListItem = styled(ImageListItem)(({ theme }) => {
  const durationShort = `${theme.transitions.duration.shorter}ms`;
  const durationStandard = `${theme.transitions.duration.standard}ms`;
  const ease = theme.transitions.easing.easeInOut;
  const transitionOpacity = `opacity ${durationStandard} ${ease}`;

  return {
    "& img": {
      opacity: 1,
      transition: transitionOpacity,
    },
    "& .MuiImageListItemBar-root": {
      opacity: 0,
      top: 0,
      background: "none",
      textAlign: "center",
      transition: transitionOpacity,
      "& .MuiImageListItemBar-title": {
        transition: `transform ${durationStandard} ${ease}`,
        transform: "translateY(20px)",
      },
    },
    "&:hover": {
      cursor: "pointer",
      "& img": { opacity: 0.25 },
      "& .MuiImageListItemBar-root": {
        opacity: 1,
        transition: `${transitionOpacity} ${durationShort}`,
        "& .MuiImageListItemBar-title": {
          transform: "translateY(0px)",
        },
      },
    },
  };
});

const srcset = (image: string, size: number, rows = 1, cols = 1) => ({
  src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
  srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
});

const ProjectGrid: React.FC<Omit<StackProps, "children">> = (props) => {
  /** Values */

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isSm = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  /** Queries */

  const projectListQuery = useInfiniteQuery(apiQueries.projects.get());

  /** Data */

  const hasNextPage = projectListQuery.hasNextPage;
  const fetchNextPage = projectListQuery.fetchNextPage;
  const isFetchingNextPage = projectListQuery.isFetchingNextPage;

  const projects =
    projectListQuery.data?.pages.flatMap((page) => page.data.results) ?? [];

  /** Callbacks */

  const handleProjectOnClick = (project: Project) => {
    console.log(project);
  };

  /** Effects */

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "400px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Stack spacing={2} {...props}>
      <ImageList
        cols={isSm ? 1 : 3}
        rowHeight="auto"
        gap={1}
        sx={sxArray({ overflow: "visible" })}
      >
        {projects.map((project) => (
          <StyledImageListItem
            key={project.id}
            onClick={() => handleProjectOnClick(project)}
          >
            <ImageListItemBar title={project.title} />
            <img
              {...srcset(project.mediaUrl ?? "", 200)}
              alt={project.title}
              loading="lazy"
            />
          </StyledImageListItem>
        ))}
      </ImageList>
      <Box ref={sentinelRef}>{isFetchingNextPage && "Loading..."}</Box>
    </Stack>
  );
};

export default ProjectGrid;
