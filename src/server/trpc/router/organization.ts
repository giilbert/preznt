import {
  createOrganizationSchema,
  joinOrganizationSchema,
} from "@/schemas/organization";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { OrganizationStatus } from "@prisma/client";
import { z } from "zod";
import { t, authedProcedure } from "../trpc";
import { customAlphabet } from "nanoid";
import { Context } from "../context";

const alphabetNumericNanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
);

const generateJoinCode = async (ctx: Context): Promise<string> => {
  // is there a better way to do this?
  const code = alphabetNumericNanoid(8);
  const organization = await ctx.prisma.organization.findUnique({
    where: { joinCode: code },
  });

  // code is taken
  if (organization) return await generateJoinCode(ctx);

  return code;
};

export const organizationRouter = t.router({
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

  getBySlug: t.procedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const maybePrivateOrganization = await ctx.prisma.organization.findFirst({
        where: {
          private: false,
          slug: input.slug,
        },
      });
      if (maybePrivateOrganization) return maybePrivateOrganization;

      return await ctx.prisma.organization.findFirst({
        where: {
          private: true,
          users: {
            some: { userId: ctx.session?.user?.id },
          },
        },
      });
    }),

  getAllPreznts: t.procedure
    .input(
      z.object({
        organizationId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      enforceOrganizationAdmin(ctx, input);

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
});
