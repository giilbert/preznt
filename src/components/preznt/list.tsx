import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Card, Heading, Text } from "../ui";

export const PrezntList: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const {
    data: prezntsRaw,
    status,
    error,
  } = trpc.organization.getAllPreznts.useQuery({
    organizationId: organization.id,
  });
  const preznts = useMemo(() => {
    if (!prezntsRaw) return null;
    return prezntsRaw.sort((a, b) => b.expires.getTime() - a.expires.getTime());
  }, [prezntsRaw]);

  if (!preznts || status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      <table className="mt-2 w-full border-spacing-y-2 border-separate">
        <thead className="bg-background-secondary">
          <tr>
            <th className="w-max px-4 py-2 font-bold text-start text-gray-300">
              NAME
            </th>
            <th className="px-4 py-2 font-bold text-start w-96 text-gray-300">
              EXPIRES
            </th>
          </tr>
        </thead>

        <tbody>
          {preznts.map((preznt) => (
            <Link
              key={preznt.id}
              href={{
                pathname: "/[slug]/preznt/[code]",
                query: {
                  code: preznt.code,
                  ...router.query,
                },
              }}
            >
              <tr className="hover:bg-background-secondary transition-colors cursor-pointer">
                <td className="font-mono pl-4 py-2">{preznt.name}</td>
                <td
                  className={clsx(
                    "pl-4",
                    // green text if the preznt is still active, grayed out if it is not
                    moment(preznt.expires).isAfter(moment())
                      ? "text-green-400"
                      : "text-gray-400"
                  )}
                >
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "short",
                    timeStyle: "medium",
                  }).format(preznt.expires)}
                </td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};
