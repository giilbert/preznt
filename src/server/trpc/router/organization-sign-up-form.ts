import { editSignUpFieldSchema } from "@/schemas/organization";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { alphanumericNanoid } from "@/utils/alphanumeric-nanoid";
import { SignUpFieldType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const organizationSignUpFormRouter = t.router({
  getAllFields: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.signUpField.findMany({
        where: { organizationId: input.organizationId },
        orderBy: {
          order: "asc",
        },
      });
    }),

  createField: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await enforceOrganizationAdmin(ctx, input);

      const order = await ctx.prisma.signUpField.count({
        where: { organizationId: input.organizationId },
      });

      const id = nanoid();

      await ctx.prisma.signUpField.create({
        data: {
          organizationId: input.organizationId,
          order,
          attribute: `Untitled-${id}`,
          description: "",
          meta: {},
          name: `Untitled-${id}`,
          type: SignUpFieldType.TEXT,
        },
      });
    }),

  deleteField: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await enforceOrganizationAdmin(ctx, input);
      const toBeDeleted = await ctx.prisma.signUpField.findUnique({
        where: { organizationId_id: input },
      });

      if (!toBeDeleted) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.prisma.$transaction([
        ctx.prisma.signUpField.delete({
          where: { organizationId_id: input },
        }),
        ctx.prisma.signUpField.updateMany({
          where: {
            organizationId: input.organizationId,
            order: {
              gt: toBeDeleted.order,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        }),
      ]);
    }),

  updateField: authedProcedure
    .input(
      editSignUpFieldSchema.merge(
        z.object({
          id: z.string(),
          organizationId: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      await enforceOrganizationAdmin(ctx, input);
      // TODO
      await ctx.prisma.signUpField.update({
        where: {
          organizationId_id: {
            organizationId: input.organizationId,
            id: input.id,
          },
        },
        data: {
          attribute: input.attribute,
          description: input.description,
          meta: input.meta,
          name: input.name,
          type: input.type,
        },
      });
    }),

  reorder: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        fromIndex: z.number(),
        toIndex: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await enforceOrganizationAdmin(ctx, input);
      // item did not move, no change needed
      if (input.fromIndex === input.toIndex) return;

      console.log("!!!!!!!!!!!!!!!!!", input);

      const fromField = await ctx.prisma.signUpField.findFirst({
        where: { organizationId: input.organizationId, order: input.fromIndex },
      });
      if (!fromField)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "`from` field not found.",
        });

      const setToToFrom = ctx.prisma.signUpField.updateMany({
        where: { order: input.fromIndex, attribute: fromField.attribute },
        data: { order: input.toIndex },
      });

      const shiftOrders =
        input.fromIndex > input.toIndex
          ? // EARLIER
            ctx.prisma.signUpField.updateMany({
              where: {
                organizationId: input.organizationId,
                order: {
                  lt: input.fromIndex,
                  gte: input.toIndex,
                },
              },
              data: {
                order: {
                  increment: 1,
                },
              },
            })
          : // LATER
            ctx.prisma.signUpField.updateMany({
              where: {
                organizationId: input.organizationId,
                order: {
                  gt: input.fromIndex,
                  lte: input.toIndex,
                },
              },
              data: {
                order: {
                  decrement: 1,
                },
              },
            });

      await ctx.prisma.$transaction([shiftOrders, setToToFrom]);
    }),
});