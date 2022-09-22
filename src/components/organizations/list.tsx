import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Text } from "../ui";

export const OrganizationList: React.FC = () => {
  const {
    data: organizations,
    status,
    error,
  } = trpc.organization.getAllJoined.useQuery();

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      <Text className="font-bold text-2xl">Joined organizations</Text>
      {organizations.map(({ organization }) => (
        <Link href={`/${organization.slug}`} key={organization.id}>
          <Text key={organization.id} className="mb-2">
            - {organization.name}
          </Text>
        </Link>
      ))}
    </div>
  );
};
