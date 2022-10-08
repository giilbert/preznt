import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const RedeemPrezntPage: React.FC = () => {
  const { query } = useRouter();
  const { mutate, status, error, data, reset } =
    trpc.preznt.redeem.useMutation();

  useEffect(() => {
    if (query.code && query.slug) {
      mutate({
        code: query.code as string,
        slug: query.slug as string,
      });
    }

    return () => {
      reset();
    };
  }, [query, mutate, reset]);

  return <div>{status}</div>;
};
