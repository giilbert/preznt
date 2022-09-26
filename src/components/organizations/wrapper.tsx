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
}> = ({ selectedTab = "", breadcrumbs, children }) => {
  const { query } = useRouter();
  const {
    data: organization,
    status,
    error,
  } = trpc.organization.getBySlug.useQuery(
    { slug: query.slug as string },
    { enabled: !!query.slug }
  );

  return (
    <OrganizationContext.Provider value={organization}>
      <Layout
        breadcrumbs={
          !!organization && [
            {
              name: organization.name,
              path: organization.slug,
            },
            ...(breadcrumbs ? breadcrumbs : []),
          ]
        }
        tabs={
          organization?.status === OrganizationStatus.MEMBER
            ? organizationMemberTabs
            : organizationAdminTabs
        }
        selectedTab={selectedTab}
      >
        <>
          {status === "loading" && <Text>Loading</Text>}
          {organization && typeof children === "function"
            ? children(organization)
            : children}
        </>
      </Layout>
    </OrganizationContext.Provider>
  );
};
