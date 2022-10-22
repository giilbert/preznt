import { fieldsToZod } from "@/lib/fields-to-zod";
import { editSignUpFieldSchema } from "@/schemas/organization";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { OrganizationStatus, SignUpFieldType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { authedProcedure, t } from "../trpc";

export const organizationSignUpFormRouter = t.router({
  getOrganizationSignUpForm: authedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: { slug: input.slug },
        include: {
          signUpFields: {
            orderBy: {
              order: "asc",
            },
          },
          users: {
            where: { userId: ctx.user.id },
          },
        },
      });

      if (!organization) throw new TRPCError({ code: "NOT_FOUND" });

      if (organization.private) {
        const organizationOnUser =
          await ctx.prisma.organizationOnUser.findUnique({
            where: {
              userId_organizationId: {
                userId: ctx.user.id,
                organizationId: organization.id,
              },
            },
          });

        if (!organizationOnUser)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Organization is private.",
          });
      }

      return organization;
    }),

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

      await ctx.prisma.signUpField.create({
        data: {
          organizationId: input.organizationId,
          order,
          attribute: `untitled-${order + 1}`,
          description: "",
          meta: {},
          name: `Untitled ${order + 1}`,
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

  completeSignUp: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const organization = await ctx.prisma.organization.findUnique({
        where: {
          id: input.organizationId,
        },
        include: {
          signUpFields: true,
        },
      });
      if (!organization)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization does not exist.",
        });

      const maybeOrganizationMember =
        await ctx.prisma.organizationOnUser.findUnique({
          where: {
            userId_organizationId: {
              userId: ctx.user.id,
              organizationId: input.organizationId,
            },
          },
        });

      const organizationMember = maybeOrganizationMember
        ? maybeOrganizationMember
        : await ctx.prisma.organizationOnUser.create({
            data: {
              userId: ctx.user.id,
              organizationId: organization.id,
              status: OrganizationStatus.MEMBER,
            },
          });

      if (organizationMember.hasSignedUp)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You've already signed up.",
        });

      const signUpSchema = fieldsToZod(organization.signUpFields);
      const safeParse = signUpSchema.safeParse(input.data);

      if (!safeParse.success)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Fields does not fit sign up form schema.",
        });

      await ctx.prisma.$transaction([
        ...Object.entries(safeParse.data).map(([attribute, value]) =>
          ctx.prisma.userAttribute.create({
            data: {
              organizationId: organization.id,
              userId: ctx.user.id,
              name: attribute,
              // TODO: more field types
              value: value.toString(),
            },
          })
        ),
        ctx.prisma.organizationOnUser.update({
          where: {
            userId_organizationId: {
              userId: organizationMember.userId,
              organizationId: organization.id,
            },
          },
          data: {
            hasSignedUp: true,
          },
        }),
      ]);
    }),
});
