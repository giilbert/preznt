import { useOrganization } from "@/lib/use-organization";
import { OrganizationStatus } from "@prisma/client";

const hierarchy: Record<OrganizationStatus | "NONE", number> = {
  NONE: -1,
  MEMBER: 0,
  ADMIN: 1,
  OWNER: 2,
};

export const RenderIfStatus: React.FC<{
  // (status greater than)
  status: OrganizationStatus;
  children: React.ReactNode | ((higher: boolean) => React.ReactNode);
}> = ({ status, children }) => {
  const organization = useOrganization();

  const isHighEnough = hierarchy[organization.status] >= hierarchy[status];

  if (typeof children === "function") return <>{children(isHighEnough)}</>;

  if (isHighEnough) return <>{children}</>;

  return null;
};
