import { Text } from "@/components/ui";
import { AttributesList } from "@/components/organizations/attributes-list";
import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationStatus } from "@prisma/client";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { NextPage } from "next";

const OrganizationPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Overview">
      {(organization) => (
        <>
          <AttributesList />
        </>
      )}
    </OrganizationWrapper>
  );
};

export default OrganizationPage;
