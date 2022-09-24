import { createPrezntSchema } from "@/schemas/preznt";
import { enforceOrganizationAdmin } from "@/server/common/organization-perms";
import { alphanumericNanoid } from "@/utils/alphanumericNanoid";
import { OrganizationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
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

      console.log(attributes, preznt.actions, ctx.user);

      await ctx.prisma.$transaction(
        preznt.actions.map(({ attribute, value, defaultValue }) => {
          const change =
            attributes.find((a) => a.name === attribute)?.value || defaultValue;
          console.log(attribute, attributes, value, change);
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

      return {
        hasJoinedOrganization,
      };
    }),
});
