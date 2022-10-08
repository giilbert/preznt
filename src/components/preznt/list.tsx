import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { Card, Heading, Text } from "../ui";
import { SkeletonCard } from "../ui/skeletons";
import { TinyButton } from "../ui/tiny-button";

export const PrezntList: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const [page, setPage] = useState(0);
  const {
    data: prezntPages,
    status: prezntPagesStatus,
    error: prezntPagesError,
  } = trpc.preznt.getNumberOfPrezntPages.useQuery({
    organizationId: organization.id,
  });
  const {
    data: preznts,
    status,
    error,
  } = trpc.preznt.getPreznts.useQuery({
    organizationId: organization.id,
    page,
  });

  if (prezntPagesStatus === "loading" || status === "loading")
    return <SkeletonCard amount={5} />;
  if (prezntPagesStatus === "error" || status === "error")
    return <Text>Error: {error?.message || prezntPagesError?.message}</Text>;

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

      <div className="flex gap-4 justify-center items-center mb-4">
        <TinyButton onClick={() => page > 0 && setPage(page - 1)}>
          <FiArrowLeft />
        </TinyButton>

        <p>
          Page {page + 1} / {prezntPages}
        </p>

        <TinyButton onClick={() => page < prezntPages - 1 && setPage(page + 1)}>
          <FiArrowRight />
        </TinyButton>
      </div>
    </div>
  );
};
