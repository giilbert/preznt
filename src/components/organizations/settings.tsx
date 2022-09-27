import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";

export const OrganizationSettings: React.FC = () => {
  const { id } = useOrganization();
  const {
    status,
    data: organization,
    error,
  } = trpc.organization.getOrganizationAsAdmin.useQuery({ organizationId: id });

  if (status === "loading") return <p>Loading</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  return (
    <>
      <p>Id: {organization.id}</p>
      <p>Name: {organization.name}</p>
      <p>Join code: {organization.joinCode}</p>
      <p>Slug: {organization.slug}</p>
      <p>Private: {organization.private ? "Yes" : "No"}</p>
    </>
  );
};
