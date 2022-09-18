import { createOrganizationSchema } from "@/schemas/organization";
import { OrganizationStatus } from "@prisma/client";
import { z } from "zod";
import { t, authedProcedure } from "../trpc";

export const organizationRouter = t.router({
  getAll: authedProcedure.query(async ({ ctx }) => {
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
            create: input,
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
      let maybePrivateOrganization = await ctx.prisma.organization.findFirst({
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
});
