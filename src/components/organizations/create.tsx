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
  const { mutateAsync } = trpc.organization.create.useMutation();
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
              console.log(data);
              await mutateAsync(data);
              await organization.getAllJoined.invalidate();
              form.reset();
            })}
            className="w-96"
          >
            <div className="flex flex-col gap-2 max-w-xl">
              <InputField.Text name="name" label="ORGANIZATION NAME" />
              <InputField.Text name="slug" />
              <InputField.Checkbox name="private" />

              <Button type="submit" className="mt-4 flex justify-center">
                Create Organization
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogWrapper>
    </>
  );
};
