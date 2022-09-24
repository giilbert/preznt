import { useRouter } from "next/router";
import { Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { CreatePreznt } from "@/components/preznt/create";
import { PrezntList } from "@/components/preznt/list";
import { OrganizationMembersList } from "@/components/organizations/members-list";
import { AttributesList } from "@/components/organizations/attributes-list";

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

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;
  if (!organization) return <Text>Organization not found</Text>;

  // TODO: put organizationId into context maybe?
  // is there a way to pass trpc response data through components?
  return (
    <div className="flex justify-center mt-4">
      <main className="w-5/6 max-w-4xl">
        <Text>Id: {organization.id}</Text>
        <Text>Name: {organization.name}</Text>
        <Text>Join code: {organization.joinCode}</Text>
        <Text>Slug: {organization.slug}</Text>
        <Text>Private: {organization.private ? "Yes" : "No"}</Text>
        <hr className="my-4" />

        <AttributesList organizationId={organization.id} />
        <hr className="my-4" />

        <CreatePreznt organizationId={organization.id} />
        <hr className="my-4" />

        <PrezntList organizationId={organization.id} />
        <hr />

        <OrganizationMembersList organizationId={organization.id} />
      </main>
    </div>
  );
};

export default OrganizationPage;
