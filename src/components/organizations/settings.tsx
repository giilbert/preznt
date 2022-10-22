import { useOrganization } from "@/lib/use-organization";
import { useWindow } from "@/lib/use-window";
import { trpc } from "@/utils/trpc";
import { Tab } from "@headlessui/react";
import Link from "next/link";
import { Heading } from "../ui";
import { ErrorMessage } from "../util/error-message";
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
  const window = useWindow();

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
      <ErrorMessage
        error={organizationQuery.error || signUpFormFieldQuery.error}
      />
    );

  const organization = organizationQuery.data;

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
            <Heading level="h1" className="mb-2">
              Info
            </Heading>

            <p className="text-lg">
              Invite Code:{" "}
              <span className="font-mono">{organization.joinCode}</span>
            </p>
            <p className="text-lg">
              Join Link:{" "}
              <span className="text-blue-500">{`${window?.location.origin}/join/${organization.slug}`}</span>
            </p>
            <hr />
            <OrganizationSettingsEditor organization={organization} />
          </Tab.Panel>

          <Tab.Panel>
            <Heading>Sign Up Form</Heading>
            <p>
              Users will be prompted to enter these values when they sign up.
            </p>
            <hr />
            <SignUpFormEditor fields={signUpFormFieldQuery.data} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
