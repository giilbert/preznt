// prepare some bleach for your eyes!

import { createPrezntSchema } from "@/schemas/preznt";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { alphanumericNanoid } from "@/utils/alphanumericNanoid";
import {
  OrganizationStatus,
  Preznt,
  PrezntOnUser,
  UserAttributeAction,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../context";
import { authedProcedure, t } from "../trpc";

type CompletePrezntType = Preznt & { actions: UserAttributeAction[] } & (
    | {
        hasRedeemed: false;
      }
    | (PrezntOnUser & {
        hasRedeemed: true;
      })
  );

const PER_PAGE = 16;

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

  // TODO: validate that the preznt is valid for the current time
  // TODO: test it more!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  redeem: authedProcedure
    .input(
      z.object({
        slug: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const preznt = await ctx.prisma.preznt.findFirst({
        where: {
          organization: { slug: input.slug },
          code: input.code,
        },
        include: {
          actions: true,
          creator: true,
        },
      });

      if (!preznt)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Preznt not found.",
        });

      let organizationMember = await ctx.prisma.organizationOnUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.user.id,
            organizationId: preznt?.organizationId,
          },
        },
      });

      const hasRedeemed =
        (await ctx.prisma.prezntOnUser.count({
          where: {
            prezntId: preznt.id,
            userId: ctx.user.id,
          },
        })) !== 0;
      if (hasRedeemed)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Preznt already redeemed",
        });

      let hasJoinedOrganization = false;
      // if the preznt does not allow the user to join the organization
      // and the user is not already in the organization, fail
      if (!preznt?.allowJoin && !organizationMember) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found.",
        });
        // if the preznt allows joins, then make the user join the organization
      } else if (preznt?.allowJoin && !organizationMember) {
        organizationMember = await ctx.prisma.organizationOnUser.create({
          data: {
            organizationId: preznt.organizationId,
            userId: ctx.user.id,
            status: OrganizationStatus.MEMBER,
          },
        });
        hasJoinedOrganization = true;
      }

      const attributes = await ctx.prisma.userAttribute.findMany({
        where: {
          OR: preznt.actions.map((action) => ({
            name: action.attribute,
            userId: organizationMember?.id,
          })),
        },
      });

      await ctx.prisma.$transaction(
        preznt.actions.map(({ attribute, value, defaultValue }) => {
          const change =
            attributes.find((a) => a.name === attribute)?.value || defaultValue;
          return ctx.prisma.userAttribute.upsert({
            where: {
              // the above checks enforce that a user is part / has joined an organization
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              userId_name: { userId: organizationMember!.id, name: attribute },
            },
            update: {
              value: value + change,
            },
            create: {
              name: attribute,
              value: value + defaultValue,
              // the above checks enforce that a user is part / has joined an organization
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              userId: organizationMember!.id,
            },
          });
        })
      );

      await ctx.prisma.prezntOnUser.create({
        data: {
          userId: ctx.user.id,
          prezntId: preznt.id,
        },
      });

      return {
        hasJoinedOrganization,
        preznt,
      };
    }),

  getByCode: authedProcedure
    .input(
      z.object({
        code: z.string(),
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);

      const preznt = await ctx.prisma.preznt.findUnique({
        where: {
          code_organizationId: input,
        },
        include: {
          redeemedBy: true,
          actions: true,
        },
      });

      if (!preznt) throw new TRPCError({ code: "NOT_FOUND" });

      return preznt;
    }),

  getByCodePublic: authedProcedure
    .input(
      z.object({
        code: z.string(),
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const organization = await ctx.prisma.organizationOnUser.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.user.id,
            organizationId: input.organizationId,
          },
        },
      });

      if (!organization) throw new TRPCError({ code: "UNAUTHORIZED" });

      const prezntRaw = await ctx.prisma.preznt.findUnique({
        where: { code_organizationId: input },
        include: {
          redeemedBy: {
            where: { userId: ctx.user.id },
          },
          actions: true,
        },
      });

      if (!prezntRaw) throw new TRPCError({ code: "NOT_FOUND" });

      const redeemed = prezntRaw.redeemedBy[0];
      const preznt = {
        ...prezntRaw,
        ...redeemed,
        hasRedeemed: !!redeemed,
      } as CompletePrezntType;

      return preznt;
    }),

  getPreznts: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
        page: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);

      return await ctx.prisma.preznt.findMany({
        where: { organizationId: input.organizationId },
        include: {
          creator: true,
          actions: true,
        },
        orderBy: {
          expires: "desc",
        },
        skip: PER_PAGE * input.page,
        take: PER_PAGE,
      });
    }),

  getNumberOfPrezntPages: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);
      return Math.ceil(
        (await ctx.prisma.preznt.count({
          where: { organizationId: input.organizationId },
        })) / PER_PAGE
      );
    }),

  getRedeemedPreznts: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      return (
        await ctx.prisma.user.findUnique({
          where: { id: ctx.user.id },
          include: {
            redeemedPreznts: {
              where: {
                preznt: {
                  organizationId: input.organizationId,
                },
              },
              include: { preznt: true },
            },
          },
        })
      )?.redeemedPreznts.map((p) => ({
        redeemedAt: p.redeemedAt,
        ...p.preznt,
      }));
    }),
});
