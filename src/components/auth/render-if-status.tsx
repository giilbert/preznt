import { trpc } from "@/utils/trpc";
import { OrganizationStatus } from "@prisma/client";

const hierarchy: Record<OrganizationStatus, number> = {
  MEMBER: 0,
  ADMIN: 1,
  OWNER: 2,
};

export const RenderIfStatus: React.FC<{
  organizationId: string;
  // (status greater than)
  status: OrganizationStatus;
  children: React.ReactNode | ((higher: boolean) => React.ReactNode);
}> = ({ status, organizationId, children }) => {
  const { data, status: queryStatus } = trpc.organization.getRelation.useQuery({
    organizationId,
  });

  if (queryStatus === "loading") return null;
  if (queryStatus === "error") return null;

  const isHighEnough = hierarchy[data] >= hierarchy[status];

  if (typeof children === "function") return <>{children(isHighEnough)}</>;

  if (isHighEnough) return <>{children}</>;

  return null;
};
