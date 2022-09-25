import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { OrganizationStatus } from "@prisma/client";

const hierarchy: Record<OrganizationStatus, number> = {
  MEMBER: 0,
  ADMIN: 1,
  OWNER: 2,
};

export const RenderIfStatus: React.FC<{
  // (status greater than)
  status: OrganizationStatus;
  children: React.ReactNode | ((higher: boolean) => React.ReactNode);
}> = ({ status, children }) => {
  const { id } = useOrganization();
  const { data, status: queryStatus } = trpc.organization.getRelation.useQuery({
    organizationId: id,
  });

  if (queryStatus === "loading") return null;
  if (queryStatus === "error") return null;

  const isHighEnough = hierarchy[data] >= hierarchy[status];

  if (typeof children === "function") return <>{children(isHighEnough)}</>;

  if (isHighEnough) return <>{children}</>;

  return null;
};
