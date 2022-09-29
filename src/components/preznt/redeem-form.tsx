import { useZodForm } from "@/lib/use-zod-form";
import { z } from "zod";
import { Button, Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const RedeemPreznt: React.FC = () => {
  const { query } = useRouter();
  const { mutate, error } = trpc.preznt.redeem.useMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: z.object({ code: z.string() }),
  });

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        if (!query.slug)
          throw new Error(
            "put this inside a route with an organization slug in its path"
          );

        mutate({
          ...data,
          slug: query.slug as string,
        });
        reset();
      })}
      className="mb-2"
    >
      <div className="flex gap-1 max-w-xl">
        <input
          {...register("code")}
          autoComplete="off"
          className="bg-neutral-800 px-3 py-1 text-gray-100 rounded"
          placeholder="Code"
        />

        <Button type="submit" size="sm">
          Redeem
        </Button>
      </div>

      <Text className="text-red-400">{errors.code?.message}</Text>
      <Text className="text-red-400">{error?.message}</Text>
    </form>
  );
};
