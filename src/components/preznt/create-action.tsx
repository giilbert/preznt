import { useZodForm } from "@/lib/use-zod-form";
import type { Action } from "@/schemas/preznt";
import { KeyValueAction } from "@prisma/client";
import clsx from "clsx";
import { FiPlus } from "react-icons/fi";
import { z } from "zod";
import { Button } from "../ui";
import { TinyButton } from "../ui/tiny-button";

const inputClasses =
  "bg-neutral-800 px-3 py-2 text-gray-100 rounded font-mono ring-accent-primary focus:ring-2";

export const CreateAction: React.FC<{
  addAction: (action: Action) => void;
}> = ({ addAction }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useZodForm({
    schema: z.object({
      attribute: z.string().min(1),
      action: z.nativeEnum(KeyValueAction),
      value: z.number(),
      defaultValue: z.number(),
    }),
    defaultValues: {
      defaultValue: 0,
      value: 0,
    },
  });

  // this cant be a form since a <form> inside a <form> is invalid DOM
  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center flex-wrap">
        <select
          id="action"
          className="bg-neutral-800 px-3 py-3 text-gray-100 rounded"
          {...register("action")}
        >
          <option>INCREMENT</option>
          <option>DECREMENT</option>
          <option>SET</option>
        </select>

        <input
          placeholder="attribute name"
          id="attribute"
          className={clsx(inputClasses, "w-36")}
          {...register("attribute")}
        />

        <label htmlFor="value" className="text-gray-100 mr-1">
          by
        </label>
        <input
          id="value"
          type="number"
          className={clsx(inputClasses, "w-20")}
          {...register("value", { valueAsNumber: true })}
        />

        <label htmlFor="default-value" className="text-gray-100 mr-1">
          or default to
        </label>
        <input
          id="default-value"
          type="number"
          className={clsx(inputClasses, "w-20")}
          {...register("defaultValue", { valueAsNumber: true })}
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit((data) => {
          addAction(data);
          reset();
        })}
        variant="outline-secondary"
        size="sm"
        className="flex items-center w-min mt-2"
      >
        <FiPlus className="mr-2" /> Add action
      </Button>

      {Object.values(errors).map((err) => (
        <p key={err.ref?.name} className="text-red-400">
          {err.ref?.name}: {err.message}
        </p>
      ))}
    </div>
  );
};
