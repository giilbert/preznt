import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { DialogWrapper, Heading, Text } from "@/components/ui";
import { useDisclosure } from "@/lib/use-disclosure";
import { InputField } from "../ui/input-field";
import { FormProvider } from "react-hook-form";

export const CreateOrganization: React.FC = () => {
  const form = useZodForm({
    schema: createOrganizationSchema,
  });
  const { organization } = trpc.useContext();
  const { mutate, isLoading, error } = trpc.organization.create.useMutation();
  const modalDisclosure = useDisclosure();

  return (
    <>
      <Button onClick={modalDisclosure.onOpen} variant="outline-secondary">
        Create Organization
      </Button>
      <DialogWrapper
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
      >
        <Heading className="mb-4">Create Organization</Heading>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              mutate(data, {
                async onSuccess() {
                  form.reset();
                  modalDisclosure.onClose();
                  await organization.getAllJoined.invalidate();
                },
              });
            })}
            className="md:w-screen md:max-w-2xl flex gap-2 flex-col"
          >
            <div className="flex flex-col gap-2">
              <InputField.Text name="name" label="Organization name" />
              <InputField.Text name="slug" label="Slug" />
              <InputField.Checkbox
                name="private"
                label="Private"
                tip="Users will be able to join your organization using an invite code or a Preznt, not from a sign up page."
              />

              <Button
                type="submit"
                className="mt-4 flex justify-center"
                loading={isLoading}
              >
                Create Organization
              </Button>

              {error && (
                <Text className="text-red-400">Error: {error.message}</Text>
              )}
            </div>
          </form>
        </FormProvider>
      </DialogWrapper>
    </>
  );
};
