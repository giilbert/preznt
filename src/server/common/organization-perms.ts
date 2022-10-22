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

  const organizationMember = await ctx.prisma.organizationOnUser.findFirst({
    where: {
      organizationId: input.organizationId,
      userId: ctx.session.user.id,
      status: { not: OrganizationStatus.MEMBER },
    },
    include: { organization: true },
  });

  if (!organizationMember) throw new TRPCError({ code: "UNAUTHORIZED" });

  return organizationMember;
};
