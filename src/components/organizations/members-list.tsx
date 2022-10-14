import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
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
    <>
      {members.map((member) => (
        <Link
          key={member.user.email}
          passHref
          href={{
            pathname: "/[slug]/member/[id]",
            query: {
              slug: organization.slug,
              id: member.userId,
            },
          }}
        >
          <a>
            <Card className="mb-2 flex gap-4 items-center" clickable>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.user.image || ""}
                className="rounded-full w-10 h-10"
                alt=""
              />
              <p className="font-bold">{member.user.name}</p>
              <p className="text-neutral-300">{member.user.email}</p>
            </Card>
          </a>
        </Link>
      ))}
    </>
  );
};
