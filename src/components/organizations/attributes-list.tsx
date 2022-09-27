import { trpc } from "@/utils/trpc";
import { Text, Heading } from "@/components/ui";
import { useOrganization } from "@/lib/use-organization";
import clsx from "clsx";

const tableCellClasses = "border-2 border-neutral-800 px-6 py-2";

export const AttributesList: React.FC = () => {
  const organization = useOrganization();
  const {
    data: attributes,
    status,
    error,
  } = trpc.organization.getSelfAttributes.useQuery({
    organizationId: organization.id,
  });

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      <Heading>Attributes</Heading>
      {attributes.length > 0 ? (
        <table className="bg-background-secondary border-spacing-x-5 mt-2">
          <thead>
            <tr>
              <th
                className={clsx(tableCellClasses, "font-bold w-48 text-start")}
              >
                ATTRIBUTE
              </th>
              <th className={clsx(tableCellClasses, "font-bold text-start")}>
                VALUE
              </th>
            </tr>
          </thead>

          {attributes.map((attribute) => (
            <tr key={attribute.name}>
              <td className={clsx(tableCellClasses, "font-mono")}>
                {attribute.name}
              </td>
              <td className={tableCellClasses}>{attribute.value}</td>
            </tr>
          ))}
        </table>
      ) : (
        <p className="text-gray-300">
          You don&apos;t have any attributes, get some by redeeming Preznts!
        </p>
      )}
    </div>
  );
};
