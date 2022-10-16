import { useOrganization } from "@/lib/use-organization";
import { useZodForm } from "@/lib/use-zod-form";
import { editOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { Organization } from "@prisma/client";
import { FormProvider } from "react-hook-form";
import { Button } from "../ui";
import { InputField } from "../ui/input-field";

export const OrganizationSettingsEditor: React.FC<{
  organization: Organization;
}> = ({ organization }) => {
  const form = useZodForm({
    schema: editOrganizationSchema.omit({ organizationId: true }),
    defaultValues: organization,
  });
  const editOrganizationSettings =
    trpc.organization.editOrganizationSettings.useMutation();
  const { id } = useOrganization();
  const trpcContext = trpc.useContext();

  return (
    <FormProvider {...form}>
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={form.handleSubmit(async (values) => {
          await editOrganizationSettings
            .mutateAsync({
              organizationId: id,
              ...values,
            })
            .catch(() => 0);

          await trpcContext.organization.getBySlug.invalidate({
            slug: organization.slug,
          });
        })}
      >
        <InputField.Image
          name="header"
          label="Header"
          aspectRatio="5/1"
          defaultName="headerUrl"
        />
        <InputField.Text name="name" label="Organization Name" />
        <InputField.Checkbox
          name="private"
          label="Private"
          tip="When private, users will only be able to join your organization using a join code or a Preznt. Users will not be able to join using your organization's sign up form."
        />

        <Button
          type="submit"
          className="w-min"
          loading={editOrganizationSettings.isLoading}
        >
          Save
        </Button>
      </form>
    </FormProvider>
  );
};
