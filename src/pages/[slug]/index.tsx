import { useRouter } from "next/router";
import { Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";

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

  return (
    <div className="flex justify-center mt-4">
      <main className="w-5/6 max-w-4xl">
        <Text>Id: {organization.id}</Text>
        <Text>Name: {organization.name}</Text>
        <Text>Slug: {organization.slug}</Text>
        <Text>Private: {organization.private ? "Yes" : "No"}</Text>
      </main>
    </div>
  );
};

export default OrganizationPage;
