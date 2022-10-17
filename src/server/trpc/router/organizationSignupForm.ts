import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const organizationSignUpFormRouter = t.router({
  // TODO: TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST
  reorder: authedProcedure
    .input(
      z.object({
        fromIndex: z.number(),
        toIndex: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // item did not move, no change needed
      if (input.fromIndex === input.toIndex) return;

      const setToToFrom = ctx.prisma.signUpField.updateMany({
        where: { order: input.toIndex },
        data: { order: input.fromIndex },
      });

      const shiftOrders =
        input.fromIndex > input.toIndex
          ? // EARLIER
            ctx.prisma.signUpField.updateMany({
              where: {
                order: {
                  lt: input.fromIndex,
                  gte: input.toIndex,
                },
              },
              data: {
                order: {
                  decrement: 1,
                },
              },
            })
          : // LATER
            ctx.prisma.signUpField.updateMany({
              where: {
                order: {
                  lte: input.fromIndex,
                  gt: input.toIndex,
                },
              },
              data: {
                order: {
                  increment: 1,
                },
              },
            });

      await ctx.prisma.$transaction([setToToFrom, shiftOrders]);
    }),
});
