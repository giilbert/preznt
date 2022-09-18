import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui";

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

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        await mutateAsync(data);
        await organization.getAll.invalidate();
        reset();
      })}
    >
      <label htmlFor="organization-name" className="text-gray-100">
        Organization Name
      </label>
      <input
        {...register("name")}
        id="organization-name"
        className="bg-neutral-800 px-3 py-2 ml-2 text-gray-100 rounded"
      />
      <Text>{errors.name?.message}</Text>

      <Button type="submit" className="mt-4">
        Create Organization
      </Button>
    </form>
  );
};
