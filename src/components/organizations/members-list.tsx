import { trpc } from "@/utils/trpc";
import { Text } from "../ui";

export const OrganizationMembersList: React.FC<{
  organizationId: string;
}> = ({ organizationId }) => {
  const {
    data: members,
    status,
    error,
  } = trpc.organization.getAllMembers.useQuery({
    organizationId,
  });

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      <Text className="text-2xl">Members</Text>
      {members.map((member) => (
        <Text key={member.id}>{member.user.name}</Text>
      ))}
    </div>
  );
};
