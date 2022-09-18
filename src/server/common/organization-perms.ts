import { OrganizationStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { Context } from "../trpc/context";

export const enforceOrganizationAdmin = async (
  ctx: Context,
  input: { organizationId: string }
) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const organization = await ctx.prisma.organizationOnUser.findFirst({
    where: {
      organizationId: input.organizationId,
      userId: ctx.session.user.id,
      status: { not: OrganizationStatus.MEMBER },
    },
  });

  if (!organization) throw new TRPCError({ code: "UNAUTHORIZED" });

  return organization;
};
