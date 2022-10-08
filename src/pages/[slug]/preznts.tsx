import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { ListRedeemedPreznts } from "@/components/preznt/list-redeemed";
import { RedeemPreznt } from "@/components/preznt/redeem-form";
import { Button, Heading } from "@/components/ui";
import { useDisclosure } from "@/lib/use-disclosure";
import { OrganizationStatus } from "@prisma/client";
import { NextPage } from "next";

const OrganizationPrezntsPage: NextPage = () => {
  const createPrezntDisclosure = useDisclosure();

  return (
    <OrganizationWrapper selectedTab="Preznts">
      <RenderIfStatus status={OrganizationStatus.ADMIN}>
        {(status) =>
          status ? (
            <div>
              <Button
                size="sm"
                className="mr-auto h-min"
                onClick={createPrezntDisclosure.onOpen}
              >
                Create Preznt
              </Button>
            </div>
          ) : (
            <>
              <div className="flex">
                <Heading className="mr-auto">Redeemed Preznts</Heading>
                <RedeemPreznt />
              </div>
              <ListRedeemedPreznts />
            </>
          )
        }
      </RenderIfStatus>

      <RenderIfStatus status={OrganizationStatus.ADMIN}>
        <CreatePreznt {...createPrezntDisclosure} />
        <PrezntList />
      </RenderIfStatus>
    </OrganizationWrapper>
  );
};

export default OrganizationPrezntsPage;
