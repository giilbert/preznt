import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { PrezntInfo } from "@/components/preznt/info";
import { RedeemPrezntPage } from "@/components/preznt/redeem-page";
import { OrganizationStatus } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";

const PrezntPage: NextPage = () => {
  const { query } = useRouter();

  return (
    <OrganizationWrapper
      selectedTab="Preznts"
      breadcrumbs={[
        {
          name: query.code as string,
          path: "/[slug]/preznt/[code]",
        },
      ]}
    >
      <RenderIfStatus status={OrganizationStatus.ADMIN}>
        {(isAdmin) => (isAdmin ? <PrezntInfo /> : <RedeemPrezntPage />)}
      </RenderIfStatus>
    </OrganizationWrapper>
  );
};

export default PrezntPage;
