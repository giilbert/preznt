import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { RedeemPreznt } from "@/components/preznt/redeem";
import { OrganizationStatus } from "@prisma/client";
import { NextPage } from "next";

const OrganizationPrezntsPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Preznts">
      <RedeemPreznt />

      <RenderIfStatus status={OrganizationStatus.ADMIN}>
        <CreatePreznt />
        <PrezntList />
      </RenderIfStatus>
    </OrganizationWrapper>
  );
};

export default OrganizationPrezntsPage;
