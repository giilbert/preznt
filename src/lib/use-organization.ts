import { Organization } from "@prisma/client";
import { createContext, useContext } from "react";

export const OrganizationContext = createContext<
  Organization | null | undefined
>(null);

export const useOrganization = () => {
  const organiation = useContext(OrganizationContext);

  if (!organiation)
    throw new Error(
      "Attempted to use useOrganization outside of an OrganizationContext or before organization has been loaded."
    );

  return organiation;
};
