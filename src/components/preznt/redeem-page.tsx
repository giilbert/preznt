import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const RedeemPrezntPage: React.FC = () => {
  const { query } = useRouter();
  const { mutateAsync, status, error, data } = trpc.preznt.redeem.useMutation();

  useEffect(() => {
    if (status === "idle" && query.code && query.slug)
      mutateAsync({
        code: query.code as string,
        slug: query.slug as string,
      });
  }, [query, mutateAsync, status]);

  return <div>{status}</div>;
};
