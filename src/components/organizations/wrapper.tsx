import { OrganizationContext } from "@/lib/use-organization";
import {
  organizationAdminTabs,
  organizationMemberTabs,
} from "@/utils/tabs/organization";
import { trpc } from "@/utils/trpc";
import { Organization, OrganizationStatus } from "@prisma/client";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode } from "react";
import { Layout } from "../layout/layout";
import { Text } from "@/components/ui";
import { Breadcrumb } from "../layout/navbar";

export const OrganizationWrapper: React.FC<{
  selectedTab?: string;
  breadcrumbs?: Breadcrumb[];
  children: ReactNode | ((organization: Organization) => ReactNode);
  requiresAdmin?: boolean;
}> = ({ requiresAdmin = false, selectedTab = "", breadcrumbs, children }) => {
  const router = useRouter();
  const {
    data: organization,
    status,
    error,
  } = trpc.organization.getBySlug.useQuery(
    { slug: router.query.slug as string },
    { enabled: !!router.query.slug }
  );

  if (
    (status === "success" &&
      organization.status === OrganizationStatus.MEMBER &&
      requiresAdmin) ||
    status === "error"
  )
    router.push("/");

  return (
    <OrganizationContext.Provider value={organization}>
      <Layout
        breadcrumbs={
          !!organization && [
            {
              name: organization.name,
              path: `/[slug]`,
            },
            ...(breadcrumbs ? breadcrumbs : []),
          ]
        }
        tabs={
          organization?.status === OrganizationStatus.ADMIN ||
          organization?.status === OrganizationStatus.OWNER
            ? organizationAdminTabs
            : organizationMemberTabs
        }
        selectedTab={selectedTab}
      >
        <>
          {status === "loading" && <Text>Loading</Text>}
          {organization &&
            (typeof children === "function"
              ? children(organization)
              : children)}
        </>
      </Layout>
    </OrganizationContext.Provider>
  );
};
