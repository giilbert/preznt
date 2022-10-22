import { SignUpField, SignUpFieldType } from "@prisma/client";
import { z } from "zod";

const runtimeEnum = (variants: string[]) => {
  return z
    .string()
    .refine(variants.includes, "Variant is not included in fields.");
};

export const fieldsToZod = (fields: SignUpField[]) => {
  const transformed = fields.map((field) => [
    field.attribute,
    {
      [SignUpFieldType.NONE]: z.never(),
      [SignUpFieldType.TEXT]: z.string().min(1),
      [SignUpFieldType.EMAIL]: z.string().email(),
      [SignUpFieldType.SCALE]: runtimeEnum(field.meta as string[]),
      [SignUpFieldType.CHECKBOXES]: runtimeEnum(field.meta as string[]),
      [SignUpFieldType.NUMBER]: z.number(),
    }[field.type] || z.never(),
  ]);

  return z.object(Object.fromEntries(transformed));
};
