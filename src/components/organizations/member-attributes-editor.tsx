import { debounce } from "@/utils/debounce";
import { trpc } from "@/utils/trpc";
import { OrganizationOnUser, UserAttribute } from "@prisma/client";
import clsx from "clsx";
import { Heading } from "../ui";
import { Spinner } from "../util/spinner";

const tableCellClasses = "border-2 border-neutral-800 px-6 py-2";

export const MemberAttributesEditor: React.FC<{
  member: OrganizationOnUser & { attributes: UserAttribute[] };
}> = ({ member }) => {
  return (
    <div className="w-full">
      <table className="w-full bg-background-secondary border-spacing-x-5 mt-2">
        <thead>
          <tr>
            <th className={clsx(tableCellClasses, "font-bold text-start")}>
              ATTRIBUTE
            </th>
            <th className={clsx(tableCellClasses, "font-bold text-start")}>
              VALUE
            </th>
          </tr>
        </thead>

        <tbody>
          {member.attributes.map((attribute) => (
            <tr key={attribute.name}>
              <td className={clsx(tableCellClasses, "font-mono")}>
                {attribute.name}
              </td>
              <td className={tableCellClasses}>
                <AttributeEditor member={member} attribute={attribute} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AttributeEditor: React.FC<{
  attribute: UserAttribute;
  member: OrganizationOnUser;
}> = ({ attribute, member }) => {
  const editMemberAttribute =
    trpc.organization.editMemberAttribute.useMutation();

  return (
    <div className="flex gap-2 items-center">
      <input
        className="px-2 py-1 rounded bg-neutral-850 hover:bg-neutral-800 focus:ring-2 ring-accent-primary transition-all"
        defaultValue={attribute.value}
        onChange={debounce(async (a: React.ChangeEvent<HTMLInputElement>) => {
          editMemberAttribute.mutate({
            organizationId: member.organizationId,
            userId: member.userId,
            name: attribute.name,
            value: a.target.value,
          });
        })}
      />

      <div
        className={editMemberAttribute.isLoading ? "opacity-100" : "opacity-0"}
      >
        <Spinner />
      </div>
    </div>
  );
};
