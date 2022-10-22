import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { DialogWrapper, Heading, Text } from "@/components/ui";
import { useDisclosure } from "@/lib/use-disclosure";
import { InputField } from "../ui/input-field";
import { FormProvider } from "react-hook-form";
import { useEffect } from "react";

const apple = /[^A-Za-z]/g;

export const CreateOrganization: React.FC = () => {
  const form = useZodForm({
    schema: createOrganizationSchema,
  });
  const { organization } = trpc.useContext();
  const { mutate, isLoading, error } = trpc.organization.create.useMutation();
  const modalDisclosure = useDisclosure();

  const name = form.watch("name");
  if (!form.getFieldState("slug").isTouched) {
    form.setValue("slug", (name || "").toLowerCase().replace(apple, "-"));
  }

  return (
    <>
      <Button onClick={modalDisclosure.onOpen} variant="outline-secondary">
        Create Organization
      </Button>
      <DialogWrapper
        isOpen={modalDisclosure.isOpen}
        onClose={() => {
          form.reset();
          modalDisclosure.onClose();
        }}
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
              <InputField.Image
                name="header"
                label="Header"
                tip="A 5:1 ratio image users will see on the sign up form and on the organization's card."
                aspectRatio="5/1"
              />
              <InputField.Text name="name" label="Organization name" />
              <InputField.Text
                name="slug"
                label="Slug"
                tip="You won't be able to change this after creating the organization."
              />
              <InputField.Checkbox
                name="private"
                label="Private"
                tip="Users will only be able to join your organization using an invite code or a Preznt, not from a sign up page."
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
