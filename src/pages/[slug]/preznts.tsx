import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { ListRedeemedPreznts } from "@/components/preznt/list-redeemed";
import { RedeemPreznt } from "@/components/preznt/redeem-form";
import { Button, Heading } from "@/components/ui";
import { useDisclosure } from "@/lib/use-disclosure";
import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { OrganizationStatus } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";

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
              <RedeemedPreznts />
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

const RedeemedPreznts: React.FC = () => {
  const organization = useOrganization();
  const {
    data: preznts,
    status,
    error,
  } = trpc.preznt.getRedeemedPreznts.useQuery({
    organizationId: organization.id,
  });
  const router = useRouter();

  if (status === "loading") return null;
  if (status === "error") return <p>Error: {error.message}</p>;

  return <ListRedeemedPreznts preznts={preznts} />;
};

export default OrganizationPrezntsPage;
