import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { Text } from "../ui";

export const PrezntList: React.FC = () => {
  const organization = useOrganization();
  const {
    data: preznts,
    status,
    error,
  } = trpc.organization.getAllPreznts.useQuery({
    organizationId: organization.id,
  });

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div className="mt-4">
      <Text className="font-bold text-2xl">Preznts</Text>
      {preznts.map((preznt) => (
        // TODO: actual UI
        <div key={preznt.id} className="mb-2">
          <Text>{preznt.name}</Text>
          <Text>Created by {preznt.creator.name}</Text>
          <Text>Actions: {JSON.stringify(preznt.actions)}</Text>
          <Text>Code: {preznt.code}</Text>
          <Text>Link: {`${window.location.href}/preznt/${preznt.code}`}</Text>
        </div>
      ))}
    </div>
  );
};
