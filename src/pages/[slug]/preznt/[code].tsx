import { Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const PrezntPage: NextPage = () => {
  const { query } = useRouter();
  const { mutateAsync, status, error, data } = trpc.preznt.redeem.useMutation();

  useEffect(() => {
    if (status === "idle" && query.code && query.slug)
      mutateAsync({
        code: query.code as string,
        slug: query.slug as string,
      });
  }, [query]);

  return (
    <div className="m-4">
      {status === "loading" && <Text>Redeeming {query.code as string}</Text>}
      {status === "success" && <Text>Success! {JSON.stringify(data)}</Text>}
      {status === "error" && <Text>Error: {error.message}</Text>}
    </div>
  );
};

export default PrezntPage;
