import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { z } from "zod";
import { Button } from "@/components/ui/button";

export const CreateOrganization: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useZodForm({
    schema: createOrganizationSchema,
  });
  const { mutateAsync } = trpc.organization.create.useMutation();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        await mutateAsync(data);
      })}
    >
      <label htmlFor="organization-name">Organization Name</label>
      <input
        {...register("name")}
        id="organization-name"
        className="bg-neutral-200 px-3 py-2 ml-2"
      />
      <p className="text-red-500">{errors.name?.message}</p>

      <Button type="submit">Create Organization</Button>
    </form>
  );
};
