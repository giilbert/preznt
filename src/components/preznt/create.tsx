import { useZodForm } from "@/lib/use-zod-form";
import { createOrganizationSchema } from "@/schemas/organization";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui";
import { createPrezntSchema } from "@/schemas/preznt";
import { z } from "zod";
import { useRouter } from "next/router";

export const CreatePreznt: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const { query } = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useZodForm({
    schema: createPrezntSchema.omit({ organizationId: true }),
  });
  const { organization } = trpc.useContext();
  const { mutateAsync } = trpc.preznt.create.useMutation();

  // TODO
  setValue("actions", []);

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        await mutateAsync({
          ...data,
          organizationId,
        });
        organization.getAllPreznts.invalidate();
        reset();
      })}
    >
      <div className="flex flex-col gap-2 max-w-xl">
        <label htmlFor="name" className="text-gray-100">
          Name
        </label>
        <input
          {...register("name")}
          autoComplete="off"
          id="name"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        />
        <Text className="text-red-400">{errors.name?.message}</Text>

        <label htmlFor="expires" className="text-gray-100">
          Expires
        </label>
        <input
          {...register("expires", { valueAsDate: true })}
          autoComplete="off"
          type="date"
          id="expires"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        />
        <Text className="text-red-400">{errors.expires?.message}</Text>

        <label htmlFor="main" className="text-gray-100">
          Main
        </label>
        <input
          {...register("main")}
          type="checkbox"
          id="main"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        />
        <Text className="text-red-400">{errors.main?.message}</Text>

        <Button type="submit" className="mt-4">
          Create Preznt
        </Button>
      </div>
    </form>
  );
};
