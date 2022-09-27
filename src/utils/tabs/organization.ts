import { Tab } from "@/components/layout/navbar";

export const organizationAdminTabs: Tab[] = [
  {
    name: "Overview",
    path: "/[slug]",
  },
  {
    name: "Preznts",
    path: "/[slug]/preznts",
  },
  {
    name: "Members",
    path: "/[slug]/members",
  },
  {
    name: "Settings",
    path: "/[slug]/settings",
  },
];

export const organizationMemberTabs: Tab[] = [
  {
    name: "Overview",
    path: "/[slug]",
  },
  {
    name: "Preznts",
    path: "/[slug]/preznts",
  },
];
