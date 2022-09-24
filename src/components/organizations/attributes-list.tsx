import { trpc } from "@/utils/trpc";
import { Text } from "@/components/ui";

export const AttributesList: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const { data, status, error } = trpc.organization.getSelfAttributes.useQuery({
    organizationId,
  });

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      <Text>Attributes displayed in the form of JSON.stringify: </Text>
      <Text>{JSON.stringify(data)}</Text>
    </div>
  );
};
