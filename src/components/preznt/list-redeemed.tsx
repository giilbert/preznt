import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { Preznt, PrezntOnUser } from "@prisma/client";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card } from "../ui";

export const ListRedeemedPreznts: React.FC<{
  preznts: (Preznt & { redeemedAt: Date })[];
}> = ({ preznts }) => {
  const router = useRouter();

  return (
    <div>
      <table className="mt-2 w-full border-spacing-y-2 border-separate">
        <thead className="bg-background-secondary">
          <tr>
            <th className="w-max px-4 py-2 font-bold text-start text-gray-300">
              NAME
            </th>
            <th className="px-4 py-2 font-bold text-start w-96 text-gray-300">
              REDEEMED
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
                  slug: router.query.slug,
                },
              }}
            >
              <tr
                key={preznt.id}
                className="hover:bg-background-secondary transition-colors cursor-pointer"
              >
                <td className="font-mono pl-4 py-2">{preznt.name}</td>
                <td className="pl-4">
                  {Intl.DateTimeFormat(undefined, {
                    dateStyle: "short",
                    timeStyle: "medium",
                  }).format(preznt.redeemedAt)}
                </td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
};
