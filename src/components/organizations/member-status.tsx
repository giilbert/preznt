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
  const { mutateAsync, isLoading } =
    trpc.organization.changeMemberStatus.useMutation();
  const { data: session } = useSession();
  const trpcContext = trpc.useContext();

  if (
    session?.user?.id === member.userId ||
    member.status === "OWNER" ||
    (member.status === "ADMIN" && organization.status !== "OWNER")
  )
    return <p>{member.status}</p>;

  return (
    <div className="flex items-center gap-3">
      {isLoading && <Spinner />}

      <select
        value={member.status}
        className="px-2 py-1 rounded"
        onChange={async (event) => {
          await mutateAsync({
            userId: member.userId,
            organizationId: organization.id,
            status: event.target.value as OrganizationStatus,
          }).catch(() => 0);

          await trpcContext.organization.getAllMembers.invalidate();
        }}
      >
        <option>ADMIN</option>
        <option>MEMBER</option>
      </select>
    </div>
  );
};
