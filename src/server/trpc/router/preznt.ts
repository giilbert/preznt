import { createPrezntSchema } from "@/schemas/preznt";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { alphanumericNanoid } from "@/utils/alphanumericNanoid";
import { Context } from "../context";
import { authedProcedure, t } from "../trpc";

const generateCode = async (
  ctx: Context,
  organizationId: string
): Promise<string> => {
  // is there a better way to do this?
  const code = alphanumericNanoid(8);
  const organization = await ctx.prisma.preznt.findUnique({
    where: {
      code_organizationId: {
        code,
        organizationId,
      },
    },
  });

  // code is taken
  if (organization) return await generateCode(ctx, organizationId);

  return code;
};
export const prezntRouter = t.router({
  create: authedProcedure
    .input(createPrezntSchema)
    .mutation(async ({ input, ctx }) => {
      const { userId } = await enforceOrganizationAdmin(ctx, input);

      await ctx.prisma.preznt.create({
        data: {
          ...input,
          actions: {
            createMany: {
              data: input.actions,
            },
          },
          code: await generateCode(ctx, input.organizationId),
          creatorId: userId,
        },
      });
    }),
});
