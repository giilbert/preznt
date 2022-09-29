import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { Heading } from "../ui";

export const PrezntInfo: React.FC = () => {
  const { query } = useRouter();
  const organization = useOrganization();
  const {
    status,
    data: preznt,
    error,
  } = trpc.preznt.getByCode.useQuery({
    code: query.code as string,
    organizationId: organization.id,
  });

  if (status === "loading") return <p>Loading..</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  return (
    <div>
      <Heading>{preznt.name}</Heading>
      <p className="text-gray-300">
        Expires{" "}
        {Intl.DateTimeFormat(undefined, {
          dateStyle: "short",
          timeStyle: "medium",
        }).format(preznt.expires)}
      </p>
      <p>
        Code: <span className="font-mono">{preznt.code}</span>
      </p>
      [WIP!]
    </div>
  );
};
