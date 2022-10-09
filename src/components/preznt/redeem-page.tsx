import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Heading } from "../ui";
import { ListActions } from "./list-actions";

export const RedeemPrezntPage: React.FC = () => {
  const { query } = useRouter();
  const organization = useOrganization();
  const prezntQuery = trpc.preznt.getByCode.useQuery({
    code: query.code as string,
    organizationId: organization.id,
  });
  const redeemPreznt = trpc.preznt.redeem.useMutation();

  useEffect(() => {
    if (
      redeemPreznt.isIdle &&
      query.code &&
      query.slug &&
      prezntQuery.data &&
      !prezntQuery.data.hasRedeemed
    ) {
      console.log(prezntQuery.data);
      redeemPreznt.mutate({
        code: query.code as string,
        slug: query.slug as string,
      });
    }
  }, [query, redeemPreznt, prezntQuery.data]);

  if (prezntQuery.status === "loading") return <p>Loading</p>;
  if (prezntQuery.status === "error")
    return <p>Error {prezntQuery.error.message}</p>;

  // if (redeemPreznt.status === "loading") return <p>Redeeming</p>;

  const { preznt, hasRedeemed } = prezntQuery.data;

  return (
    <div>
      <Heading>{preznt.name}</Heading>
      {hasRedeemed && (
        <p className="text-green-400">
          Redeemed on{" "}
          {Intl.DateTimeFormat(undefined, {
            dateStyle: "short",
            timeStyle: "medium",
          }).format(preznt.expires)}
        </p>
      )}
      {redeemPreznt.status === "loading" && (
        <p className="text-green-400">Redeeming Preznt..</p>
      )}
      {redeemPreznt.status === "error" && (
        <p className="text-red-400">
          Error occured redeeming Preznt: {redeemPreznt.error.message}
        </p>
      )}

      {preznt.actions.length !== 0 ? (
        <ListActions actions={preznt.actions} />
      ) : (
        <p className="text-neutral-400">This preznt has no actions</p>
      )}
    </div>
  );
};
