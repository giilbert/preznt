import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import { OrganizationSettingsEditor } from "./settings-editor";
import { SignUpFormEditor } from "./sign-up-form-editor";

const tabClasses =
  "md:text-start w-full bg-neutral-900 hover:bg-neutral-800 px-4 py-2 rounded transition-colors";

export const OrganizationSettings: React.FC = () => {
  const { id } = useOrganization();
  const organizationQuery = trpc.organization.getOrganizationAsAdmin.useQuery({
    organizationId: id,
  });
  const signUpFormFieldQuery =
    trpc.organization.signUpForm.getAllFields.useQuery({
      organizationId: id,
    });

  if (
    organizationQuery.status === "loading" ||
    signUpFormFieldQuery.status === "loading"
  )
    return <p>Loading</p>;
  if (
    organizationQuery.status === "error" ||
    signUpFormFieldQuery.status === "error"
  )
    return (
      <p>
        Error:{" "}
        {organizationQuery.error?.message ||
          signUpFormFieldQuery.error?.message}
      </p>
    );

  console.log("outer: ", signUpFormFieldQuery.data);

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
            <OrganizationSettingsEditor organization={organizationQuery.data} />
          </Tab.Panel>

          <Tab.Panel>
            <SignUpFormEditor fields={signUpFormFieldQuery.data} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
