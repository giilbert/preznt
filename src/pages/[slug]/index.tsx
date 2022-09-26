import { useRouter } from "next/router";
import { Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { OrganizationMembersList } from "@/components/organizations/members-list";
import { AttributesList } from "@/components/organizations/attributes-list";
import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationStatus } from "@prisma/client";
import { RedeemPreznt } from "@/components/preznt/redeem";
import { Layout } from "@/components/layout/layout";
import { OrganizationContext, useOrganization } from "@/lib/use-organization";
import Link from "next/link";
import {
  organizationAdminTabs,
  organizationMemberTabs,
} from "@/utils/tabs/organization";
import { OrganizationWrapper } from "@/components/organizations/wrapper";

const OrganizationPage: React.FC = () => {
  return (
    <OrganizationWrapper selectedTab="Overview">
      {(organization) => (
        <>
          <Link href="/[slug]/asdasd">adasd</Link>
          <RedeemPreznt />
          <hr className="my-4" />
          <AttributesList />
          <hr className="my-4" />

          <RenderIfStatus status={OrganizationStatus.ADMIN}>
            <Text>Id: {organization.id}</Text>
            <Text>Name: {organization.name}</Text>
            <Text>Join code: {organization.joinCode}</Text>
            <Text>Slug: {organization.slug}</Text>
            <Text>Private: {organization.private ? "Yes" : "No"}</Text>
            <hr className="my-4" />

            <CreatePreznt />
            <hr className="my-4" />

            <PrezntList />
            <hr />

            <OrganizationMembersList />
          </RenderIfStatus>
        </>
      )}
    </OrganizationWrapper>
  );
};

export default OrganizationPage;
