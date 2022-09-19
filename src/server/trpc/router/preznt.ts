import { createPrezntSchema } from "@/schemas/preznt";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { authedProcedure, t } from "../trpc";

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
          creatorId: userId,
        },
      });
    }),
});
