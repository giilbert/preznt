import {
  createOrganizationSchema,
  joinOrganizationSchema,
} from "@/schemas/organization";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { Organization, OrganizationStatus } from "@prisma/client";
import { z } from "zod";
import { t, authedProcedure } from "../trpc";
import { customAlphabet } from "nanoid";
import { Context } from "../context";
import { alphanumericNanoid } from "@/utils/alphanumericNanoid";
import { TRPCError } from "@trpc/server";
import { organizationMemberTabs } from "@/utils/tabs/organization";

const generateJoinCode = async (ctx: Context): Promise<string> => {
  // is there a better way to do this?
  const code = alphanumericNanoid(8);
  const organization = await ctx.prisma.organization.findUnique({
    where: { joinCode: code },
  });

  // code is taken
  if (organization) return await generateJoinCode(ctx);

  return code;
};

export const organizationRouter = t.router({
  getRelation: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const organizationMember = await ctx.prisma.organizationOnUser.findUnique(
        {
          where: {
            userId_organizationId: {
              userId: ctx.user.id,
              organizationId: input.organizationId,
            },
          },
        }
      );

      if (!organizationMember) throw new TRPCError({ code: "NOT_FOUND" });

      return organizationMember.status;
    }),

  getAllJoined: authedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.organizationOnUser.findMany({
      where: { userId: ctx.user.id },
      include: { organization: true },
    });
  }),

  create: authedProcedure
    .input(createOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.organizationOnUser.create({
        data: {
          status: OrganizationStatus.OWNER,
          user: {
            connect: { id: ctx.user.id },
          },
          organization: {
            create: { ...input, joinCode: await generateJoinCode(ctx) },
          },
        },
      });
    }),

  getBySlug: authedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const organizationMember = await ctx.prisma.organizationOnUser.findFirst({
        where: {
          userId: ctx.user.id,
          organization: {
            slug: input.slug,
          },
        },
        include: {
          organization: {
            select: {
              id: true,
              slug: true,
              name: true,
            },
          },
        },
      });

      if (!organizationMember) throw new TRPCError({ code: "NOT_FOUND" });

      return {
        ...organizationMember.organization,
        status: organizationMember.status,
      };
    }),

  getAllPreznts: t.procedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);

      console.log(input);

      return await ctx.prisma.preznt.findMany({
        where: { organizationId: input.organizationId },
        include: {
          creator: true,
          actions: true,
        },
      });
    }),

  joinOrganization: authedProcedure
    .input(joinOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.organizationOnUser.create({
        data: {
          status: OrganizationStatus.MEMBER,
          organization: {
            connect: { joinCode: input.joinCode },
          },
          user: {
            connect: { id: ctx.user.id },
          },
        },
      });
    }),

  getAllMembers: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);

      return await ctx.prisma.organizationOnUser.findMany({
        where: {
          organizationId: input.organizationId,
        },
        include: {
          attributes: true,
          user: true,
        },
      });
    }),

  getSelfAttributes: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const organizationMember = await ctx.prisma.organizationOnUser.findUnique(
        {
          where: {
            userId_organizationId: {
              organizationId: input.organizationId,
              userId: ctx.user.id,
            },
          },
          include: { attributes: true },
        }
      );

      if (!organizationMember) throw new TRPCError({ code: "NOT_FOUND" });

      return organizationMember.attributes;
    }),

  getOrganizationAsAdmin: authedProcedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await enforceOrganizationAdmin(ctx, input);

      const organization = await ctx.prisma.organization.findUnique({
        where: { id: input.organizationId },
      });

      if (!organization) throw new TRPCError({ code: "NOT_FOUND" });

      return organization;
    }),
});
