import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { DialogWrapper, Text } from "@/components/ui";
import { useDisclosure } from "@/lib/use-disclosure";

export const CreateOrganization: React.FC = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({
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
        <form
          onSubmit={handleSubmit(async (data) => {
            console.log(data);
            await mutateAsync(data);
            await organization.getAllJoined.invalidate();
            reset();
          })}
          className="w-96"
        >
          <div className="flex flex-col gap-2 max-w-xl">
            <label htmlFor="organization-name" className="text-gray-100">
              Organization Name
            </label>
            <input
              {...register("name")}
              autoComplete="off"
              id="organization-name"
              className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
            />
            <Text className="text-red-400">{errors.name?.message}</Text>

            <label htmlFor="organization-slug" className="text-gray-100">
              Slug
            </label>
            <input
              {...register("slug")}
              autoComplete="off"
              id="organization-slug"
              className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
            />
            <Text className="text-red-400">{errors.slug?.message}</Text>

            <div>
              <label htmlFor="private" className="text-gray-100 mr-2">
                Private
              </label>
              <input
                {...register("private")}
                type="checkbox"
                autoComplete="off"
                id="private"
                className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
              />
              <Text className="text-red-400">{errors.private?.message}</Text>
            </div>

            <Button type="submit" className="mt-4 flex justify-center">
              Create Organization
            </Button>
          </div>
        </form>
      </DialogWrapper>
    </>
  );
};
