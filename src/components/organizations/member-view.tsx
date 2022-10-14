import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import { Breadcrumb } from "../layout/navbar";
import { Card } from "../ui";
import { MemberStatus } from "./member-status";

export const MemberView: React.FC<{
  setBreadcrumb: (breadcrumb: Breadcrumb) => void;
}> = ({ setBreadcrumb }) => {
  const router = useRouter();
  const organization = useOrganization();
  const memberQuery = trpc.organization.getMemberById.useQuery({
    organizationId: organization.id,
    userId: router.query.id as string,
  });

  useEffect(() => {
    const user = memberQuery.data?.user;
    if (user) {
      setBreadcrumb({
        name: user.name || `Member ${user.id}`,
        path: `/[slug]/member/[id]`,
      });
    }
  }, [memberQuery.data?.user, setBreadcrumb]);

  if (memberQuery.status === "loading") return <p>Loading</p>;
  if (memberQuery.status === "error") return <p>Error</p>;

  const { user } = memberQuery.data;

  return (
    <>
      <Card
        key={user.email}
        className="bg-neutral-800 w-[32rem] flex gap-4 items-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image || ""} className="rounded-full w-10 h-10" alt="" />
        <p className="font-bold mr-auto">{user.name}</p>

        <MemberStatus member={memberQuery.data} />
      </Card>
    </>
  );
};
