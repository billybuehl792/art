import React, { type ReactNode } from "react";
import { Breadcrumbs, Stack, Tab, Tabs } from "@mui/material";
import SearchField from "@/components/fields/SearchField";
import Link from "@/components/links/Link";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/layout/PageHeader";
import type { ProjectListRequest } from "@/types/projects";

export interface ProjectListPageHeaderProps extends Partial<PageHeaderProps> {
  params: ProjectListRequest["params"];
  breadcrumbs?: ReactNode[];
  onSearch?: (search: string) => void;
  onTabChange?: (tab: ProjectListRequest["params"]["category"]) => void;
}

const TABS = [
  { value: null, label: "All" },
  { value: "art", label: "Art" },
  { value: "dev", label: "Dev" },
];

const ProjectListPageHeader: React.FC<ProjectListPageHeaderProps> = ({
  params,
  breadcrumbs,
  onSearch,
  onTabChange,
  ...props
}) => {
  return (
    <PageHeader
      title={<Breadcrumbs>{breadcrumbs?.map((crumb) => crumb)}</Breadcrumbs>}
      endContent={<Link to="/projects/create">Create</Link>}
      bottomContent={
        <Stack spacing={1}>
          <SearchField
            value={params?.search || ""}
            onChange={(value) => onSearch?.(value)}
          />
          <Tabs
            value={params?.category ?? null}
            onChange={(_event, value) => onTabChange?.(value)}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.label}
                value={tab.value}
                label={tab.label}
                disabled={!onTabChange}
              />
            ))}
          </Tabs>
        </Stack>
      }
      {...props}
    />
  );
};

export default ProjectListPageHeader;
