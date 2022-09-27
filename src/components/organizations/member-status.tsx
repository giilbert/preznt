import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { OrganizationOnUser, OrganizationStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Spinner } from "../util/spinner";

export const MemberStatus: React.FC<{ member: OrganizationOnUser }> = ({
  member,
}) => {
  const organization = useOrganization();
  const { mutateAsync } = trpc.organization.changeMemberStatus.useMutation();
  const { data: session } = useSession();
  const trpcContext = trpc.useContext();
  const [loading, setLoading] = useState(false);

  if (session?.user?.id === member.userId) return <p>{member.status}</p>;

  return (
    <div className="flex items-center gap-3">
      {loading && <Spinner />}

      <select
        value={member.status}
        className="px-2 py-1 rounded"
        onChange={async (event) => {
          setLoading(true);

          await mutateAsync({
            userId: member.userId,
            organizationId: organization.id,
            status: event.target.value as OrganizationStatus,
          });

          await trpcContext.organization.getAllMembers.invalidate();

          setLoading(false);
        }}
      >
        <option>ADMIN</option>
        <option>MEMBER</option>
      </select>
    </div>
  );
};
