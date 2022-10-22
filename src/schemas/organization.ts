import { SignUpFieldType } from "@prisma/client";
import { z } from "zod";

const RESERVED_SLUGS = ["design", "api"];
const MAX_FILE_SIZE = 1024 * 1024 * 4 * (4 / 3); // 4 mb in base64

export const createOrganizationSchema = z.object({
  header: z.string().max(MAX_FILE_SIZE),
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
  private: z.preprocess((a) => Boolean(a), z.boolean()),
});

export const joinOrganizationSchema = z.object({
  joinCode: z.string(),
});

export const editOrganizationSchema = z.object({
  name: z.string(),
  organizationId: z.string(),
  header: z.string().max(MAX_FILE_SIZE).optional(),
  private: z.boolean(),
});

export const editSignUpFieldSchema = z.object({
  attribute: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(SignUpFieldType),
  // TODO:
  meta: z.any(),
});
