import { Heading, Text } from "@/components/ui";
import { AttributesList } from "@/components/organizations/attributes-list";
import { RenderIfStatus } from "@/components/auth/render-if-status";
import { OrganizationStatus } from "@prisma/client";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { NextPage } from "next";
import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { PrezntCalendars } from "@/components/organizations/preznts-calendar";

const OrganizationPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Overview">
      <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        <div className="mt-1.5">
          <Calendar />
        </div>
        <div className="lg:col-span-2">
          <AttributesList />
        </div>
      </div>
    </OrganizationWrapper>
  );
};

const Calendar: React.FC = () => {
  const organization = useOrganization();
  const prezntsQuery = trpc.preznt.getRedeemedPrezntsInMonth.useQuery({
    organizationId: organization.id,
  });

  if (prezntsQuery.status === "loading") return null;
  if (prezntsQuery.status === "error")
    return <p>An error occured: {prezntsQuery.error.message}</p>;

  return <PrezntCalendars preznts={prezntsQuery.data} />;
};

export default OrganizationPage;
