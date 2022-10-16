import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import { OrganizationSettingsEditor } from "./settings-editor";

const tabClasses =
  "md:text-start w-full bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded transition-colors";

export const OrganizationSettings: React.FC = () => {
  const { id } = useOrganization();
  const {
    status,
    data: organization,
    error,
  } = trpc.organization.getOrganizationAsAdmin.useQuery({ organizationId: id });

  if (status === "loading") return <p>Loading</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  return (
    <div className="md:flex gap-2">
      <Tab.Group>
        <Tab.List
          as="div"
          className="flex md:flex-col gap-2 md:bg-background-primary w-full md:w-96 md:px-3 py-1 rounded items-start text-lg"
        >
          <Tab className={tabClasses}>Settings</Tab>
          <Tab className={tabClasses}>Sign Up Form</Tab>
        </Tab.List>

        <Tab.Panels as="div" className="w-full">
          <Tab.Panel className="w-full">
            <OrganizationSettingsEditor organization={organization} />
          </Tab.Panel>

          <Tab.Panel>
            <p>Sign up form</p>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
