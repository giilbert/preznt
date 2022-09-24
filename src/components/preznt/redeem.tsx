import { useZodForm } from "@/lib/use-zod-form";
import { z } from "zod";
import { Button, Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";

export const RedeemPreznt: React.FC = () => {
  const { query } = useRouter();
  const { mutateAsync } = trpc.preznt.redeem.useMutation();
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

        await mutateAsync({
          ...data,
          slug: query.slug as string,
        });
        reset();
      })}
    >
      <Text className="text-2xl">Redeem preznt</Text>
      <div className="flex gap-2 max-w-xl">
        <label htmlFor="code" className="text-gray-100">
          Code
        </label>
        <input
          {...register("code")}
          autoComplete="off"
          id="code"
          className="bg-neutral-800 px-3 py-1 text-gray-100 rounded"
        />
        <Text className="text-red-400">{errors.code?.message}</Text>

        <Button type="submit" size="sm">
          Redeem
        </Button>
      </div>
    </form>
  );
};
