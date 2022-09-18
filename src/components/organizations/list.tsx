import { trpc } from "@/utils/trpc";
import { Text } from "../ui";

export const OrganizationList: React.FC = () => {
  const {
    data: organizations,
    status,
    error,
  } = trpc.organization.getAll.useQuery();

  if (status === "loading") return <p>Loading organizations</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  console.log(organizations);

  return (
    <div>
      <Text className="font-bold text-2xl">Joined organizations</Text>
      {organizations.map(({ organization }) => (
        <Text key={organization.id}>- {organization.name}</Text>
      ))}
    </div>
  );
};
