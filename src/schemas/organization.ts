import { z } from "zod";

const RESERVED_SLUGS = ["design", "api"];

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(5, "Organization name must contain more than 5 characters.")
    .max(50, "Organization name must contain less than 50 characters."),
  slug: z
    .string()
    .min(5, "Organization slug must contain more than 5 characters")
    .max(20, "Organization slug must contain less than 20 characters.")
    .refine((slug) => !RESERVED_SLUGS.includes(slug), {
      message: "Slug is reserved.",
    }),
});
