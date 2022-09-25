import { useZodForm } from "@/lib/use-zod-form";
import { joinOrganizationSchema } from "@/schemas/organization";
import { Button, Text, DialogWrapper, Heading } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { useDisclosure } from "@/lib/use-disclosure";
import { Fragment } from "react";
import { Modal } from "../ui/modal";

export const JoinOrganization: React.FC = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: joinOrganizationSchema,
  });
  const { mutateAsync } = trpc.organization.joinOrganization.useMutation();
  const { organization } = trpc.useContext();
  const modalDisclosure = useDisclosure();

  return (
    <>
      <Button onClick={modalDisclosure.onOpen}>Join Organization</Button>
      <DialogWrapper
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
      >
        <Heading className="mb-4">Join an Organization</Heading>
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            await mutateAsync(data);
            organization.getAllJoined.invalidate();
            reset();
          })}
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="join-code" className="text-gray-100 mr-2">
              Join Code
            </label>
            <input
              {...register("joinCode")}
              autoComplete="off"
              id="join-code"
              className="bg-neutral-800 px-3 py-1 text-gray-100 rounded"
            />
            <Text className="text-red-400">{errors.joinCode?.message}</Text>
          </div>

          <Button type="submit" className="flex justify-center">
            Join
          </Button>
        </form>
      </DialogWrapper>
    </>
  );
};
