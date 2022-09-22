import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Text } from "../ui";

export const OrganizationMembersList: React.FC = () => {
  const router = useRouter();
  const { data: organization } = trpc.organization.getBySlug.useQuery({
    slug: router.query.slug as string,
  });
  const {
    data: members,
    status,
    error,
  } = trpc.organization.getAllMembers.useQuery(
    {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationId: organization!.id,
    },
    { enabled: !!organization }
  );

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
