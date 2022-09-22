import { useZodForm } from "@/lib/use-zod-form";
import { joinOrganizationSchema } from "@/schemas/organization";
import { Button, Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";

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

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        console.log(data);
        await mutateAsync(data);
        organization.getAll.invalidate();
        reset();
      })}
    >
      <div className="flex gap-2 max-w-xl">
        <label htmlFor="join-code" className="text-gray-100">
          Join Code
        </label>
        <input
          {...register("joinCode")}
          autoComplete="off"
          id="join-code"
          className="bg-neutral-800 px-3 py-1 text-gray-100 rounded"
        />
        <Text className="text-red-400">{errors.joinCode?.message}</Text>

        <Button type="submit" size="sm">
          Join
        </Button>
      </div>
    </form>
  );
};
