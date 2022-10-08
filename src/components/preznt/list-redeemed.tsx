import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import moment from "moment";
import { Card } from "../ui";

export const ListRedeemedPreznts: React.FC = () => {
  const organization = useOrganization();
  const {
    data: preznts,
    status,
    error,
  } = trpc.organization.getRedeemedPreznts.useQuery({
    organizationId: organization.id,
  });

  if (status === "loading") return null;
  if (status === "error") return <p>Error: {error.message}</p>;

  return (
    <div>
      {preznts ? (
        <table className="mt-2 w-full border-spacing-y-2 border-separate">
          <thead className="bg-background-secondary">
            <tr>
              <th className="w-max px-4 py-2 font-bold text-start text-gray-300">
                NAME
              </th>
              <th className="px-4 py-2 font-bold text-start w-96 text-gray-300">
                REDEEEMED
              </th>
            </tr>
          </thead>

          <tbody>
            {preznts.map((preznt) => (
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
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nothing here..</p>
      )}
    </div>
  );
};
