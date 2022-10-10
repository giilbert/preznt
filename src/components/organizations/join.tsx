import { useZodForm } from "@/lib/use-zod-form";
import { joinOrganizationSchema } from "@/schemas/organization";
import { Button, Text, DialogWrapper, Heading } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { useDisclosure } from "@/lib/use-disclosure";
import { Fragment } from "react";
import { Modal } from "../ui/modal";
import { InputField } from "../ui/input-field";
import { FormProvider } from "react-hook-form";

export const JoinOrganization: React.FC = () => {
  const form = useZodForm({
    schema: joinOrganizationSchema,
  });
  const { mutate, isLoading, error } =
    trpc.organization.joinOrganization.useMutation();
  const { organization } = trpc.useContext();
  const modalDisclosure = useDisclosure();

  return (
    <>
      <Button onClick={modalDisclosure.onOpen}>Join Organization</Button>
      <DialogWrapper
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
      >
        <Heading className="mb-4">Join Organization</Heading>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              console.log(data);
              mutate(data);
              organization.getAllJoined.invalidate();
              form.reset();
            })}
            className="flex flex-col gap-4 w-96"
          >
            <InputField.Text
              name="joinCode"
              label="Join Code"
              tip="You should be given this by an organization's admin."
            />

            <Button
              type="submit"
              className="flex justify-center"
              loading={isLoading}
            >
              Join
            </Button>
            <Text className="text-red-400">{error?.message}</Text>
          </form>
        </FormProvider>
      </DialogWrapper>
    </>
  );
};
