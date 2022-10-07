import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { Card, Heading, Text } from "../ui";
import { SkeletonCard } from "../ui/skeletons";
import { MemberStatus } from "./member-status";

export const OrganizationMembersList: React.FC = () => {
  const organization = useOrganization();
  const {
    data: members,
    status,
    error,
  } = trpc.organization.getAllMembers.useQuery({
    organizationId: organization.id,
  });

  if (status === "loading") return <SkeletonCard amount={10} />;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      {members.map((member) => (
        <Card key={member.id} className="mt-2 flex">
          <p>{member.user.name}</p>
          <div className="ml-auto">
            <MemberStatus member={member} />
          </div>
        </Card>
      ))}
    </div>
  );
};
