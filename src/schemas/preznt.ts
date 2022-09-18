import { KeyValueAction } from "@prisma/client";
import { z } from "zod";

// makes it work with forms
// which booleans are "true" and "false" strings
const dumbFormBoolean = z.preprocess((a) => Boolean(a), z.boolean());

export const userAttributeAction = z.object({
  action: z.nativeEnum(KeyValueAction),
  value: z.number(),
});

export const createPrezntSchema = z.object({
  name: z
    .string()
    .min(5, "Preznt name must contain more than 5 characters.")
    .max(50, "Preznt name must contain less than 50 characters."),
  main: z.boolean(),
  expires: z.date(),
  actions: z.array(userAttributeAction),
  organizationId: z.string(),
});
