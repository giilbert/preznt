import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { Heading } from "../ui";
import { Spinner } from "../util/spinner";
import { ListActions } from "./list-actions";

export const RedeemPrezntPage: React.FC = () => {
  const { query } = useRouter();
  const organization = useOrganization();
  const prezntQuery = trpc.preznt.getByCodePublic.useQuery({
    code: query.code as string,
    organizationId: organization.id,
  });
  const redeemPreznt = trpc.preznt.redeem.useMutation();
  const ctx = trpc.useContext();

  const doRedeemPreznt = useCallback(async () => {
    await redeemPreznt.mutateAsync({
      code: query.code as string,
      slug: query.slug as string,
    });
    await ctx.preznt.getByCodePublic.invalidate();
  }, [ctx.preznt.getByCodePublic, query.code, query.slug, redeemPreznt]);

  useEffect(() => {
    if (
      redeemPreznt.isIdle &&
      query.code &&
      query.slug &&
      prezntQuery.data &&
      !prezntQuery.data.hasRedeemed
    ) {
      doRedeemPreznt().catch(() => 0);
    }
  }, [query, redeemPreznt, doRedeemPreznt, prezntQuery.data]);

  if (prezntQuery.status === "loading") return <p>Loading</p>;
  if (prezntQuery.status === "error")
    return <p>Error {prezntQuery.error.message}</p>;

  const preznt = prezntQuery.data;

  return (
    <div>
      <Heading level="h1">{preznt.name}</Heading>
      {preznt.hasRedeemed && (
        <p className="text-green-400 text-lg">
          <FiCheck className="inline-block mr-1 -mt-1" />
          Redeemed on{" "}
          {Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "medium",
          }).format(preznt.redeemedAt)}
        </p>
      )}
      {redeemPreznt.status === "loading" && (
        <div className="flex gap-2 items-center">
          <Spinner />
          <p className="text-green-400 text-lg">Redeeming Preznt..</p>
        </div>
      )}
      {redeemPreznt.status === "error" && (
        <p className="text-red-400">
          <FiX className="inline-block mr-1 -mt-1" />
          Error occured redeeming Preznt: {redeemPreznt.error.message}
        </p>
      )}

      <hr className="border-gray-800 my-3" />

      <Heading level="h3">Actions</Heading>
      {preznt.actions.length !== 0 ? (
        <ListActions actions={preznt.actions} />
      ) : (
        <p className="text-neutral-400">This preznt has no actions</p>
      )}
    </div>
  );
};
