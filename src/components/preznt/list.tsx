import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Text } from "../ui";

export const PrezntList: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const {
    data: preznts,
    status,
    error,
  } = trpc.organization.getAllPreznts.useQuery({
    organizationId,
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
        </div>
      ))}
    </div>
  );
};
