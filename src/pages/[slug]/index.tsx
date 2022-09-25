import { useRouter } from "next/router";
import { Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { OrganizationMembersList } from "@/components/organizations/members-list";
import { AttributesList } from "@/components/organizations/attributes-list";
import { RenderIfStatus } from "@/components/auth/render-if-status";
import { organizationRouter } from "@/server/trpc/router/organization";
import { OrganizationStatus } from "@prisma/client";
import { RedeemPreznt } from "@/components/preznt/redeem";
import { Layout } from "@/components/layout/layout";

const OrganizationPage: React.FC = () => {
  const { query } = useRouter();
  const {
    data: organization,
    status,
    error,
  } = trpc.organization.getBySlug.useQuery(
    { slug: query.slug as string },
    { enabled: !!query.slug }
  );

  if (status === "error") return <Text>Error: {error.message}</Text>;

  // TODO: put organizationId into context maybe?
  // is there a way to pass trpc response data through components?
  return (
    <Layout
      breadcrumbs={
        !!organization && [
          {
            name: organization.name,
            path: organization.slug,
          },
        ]
      }
    >
      {status === "loading" && <Text>Loading</Text>}
      {organization && (
        <>
          <RedeemPreznt />
          <hr className="my-4" />
          <AttributesList organizationId={organization.id} />
          <hr className="my-4" />
          <RenderIfStatus
            organizationId={organization.id}
            status={OrganizationStatus.ADMIN}
          >
            <Text>Id: {organization.id}</Text>
            <Text>Name: {organization.name}</Text>
            <Text>Join code: {organization.joinCode}</Text>
            <Text>Slug: {organization.slug}</Text>
            <Text>Private: {organization.private ? "Yes" : "No"}</Text>
            <hr className="my-4" />

            <CreatePreznt organizationId={organization.id} />
            <hr className="my-4" />

            <PrezntList organizationId={organization.id} />
            <hr />

            <OrganizationMembersList organizationId={organization.id} />
          </RenderIfStatus>
        </>
      )}
    </Layout>
  );
};

export default OrganizationPage;
