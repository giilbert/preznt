import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(5, "Organization name must contain more than 5 characters.")
    .max(30, "Organization name must contain less than 30 characters."),
});
