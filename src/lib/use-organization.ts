import { Organization, OrganizationStatus } from "@prisma/client";
import { createContext, useContext } from "react";

export type PublicOrganization = Omit<Organization, "joinCode" | "private"> & {
  status: OrganizationStatus;
};

export const OrganizationContext = createContext<
  PublicOrganization | null | undefined
>(null);

export const useOrganization = () => {
  const organization = useContext(OrganizationContext);

  if (!organization)
    throw new Error(
      "Attempted to use useOrganization outside of an OrganizationContext or before organization has been loaded."
    );

  return organization;
};
