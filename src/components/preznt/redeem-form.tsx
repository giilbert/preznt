import { useZodForm } from "@/lib/use-zod-form";
import { z } from "zod";
import { Button, Text } from "@/components/ui";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import ReactConfetti from "react-confetti";
import { useState } from "react";

export const RedeemPreznt: React.FC = () => {
  const { query } = useRouter();
  const { mutateAsync, error, isLoading } = trpc.preznt.redeem.useMutation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: z.object({ code: z.string() }),
  });
  const { preznt } = trpc.useContext();
  const [doConfetti, setDoConfetti] = useState(false);

  return (
    <>
      {doConfetti && <ReactConfetti numberOfPieces={800} recycle={false} />}
      <form
        onSubmit={handleSubmit(async (data) => {
          if (!query.slug)
            throw new Error(
              "put this inside a route with an organization slug in its path"
            );

          await mutateAsync({
            ...data,
            slug: query.slug as string,
          }).catch(() => 0);

          await preznt.getRedeemedPreznts.invalidate();

          setDoConfetti(true);
          setTimeout(() => setDoConfetti(false), 8000);

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

          <Button type="submit" size="sm" loading={isLoading}>
            Redeem
          </Button>
        </div>

        <Text className="text-red-400">{errors.code?.message}</Text>
        <Text className="text-red-400">{error?.message}</Text>
      </form>
    </>
  );
};
