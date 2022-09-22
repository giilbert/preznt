import { useZodForm } from "@/lib/use-zod-form";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui";
import { createPrezntSchema } from "@/schemas/preznt";
import { z } from "zod";
import { useCallback, useState } from "react";
import { KeyValueAction } from "@prisma/client";

type Action = z.infer<typeof createPrezntSchema>["actions"][0];

export const CreatePreznt: React.FC<{ organizationId: string }> = ({
  organizationId,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useZodForm({
    schema: createPrezntSchema.omit({ organizationId: true }),
    defaultValues: {
      actions: [],
    },
  });
  const { organization } = trpc.useContext();
  const { mutateAsync } = trpc.preznt.create.useMutation();

  const addAction = useCallback((action: Action) => {
    setValue("actions", [action, ...getValues("actions")]);
    // forces the form to rerender
    trigger("actions");
  }, []);

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

        <Text className="text-2xl">Actions</Text>
        <CreateAction actions={getValues("actions")} addAction={addAction} />

        <Button type="submit" className="mt-4">
          Create Preznt
        </Button>
      </div>
    </form>
  );
};

const CreateAction: React.FC<{
  actions: Action[];
  addAction: (action: Action) => void;
}> = ({ actions, addAction }) => {
  const [attribute, setAttribute] = useState("");
  const [action, setAction] = useState<KeyValueAction>("INCREMENT");
  const [value, setValue] = useState(0);
  const [defaultValue, setDefaultValue] = useState(0);

  // this cant be a form since a <form> inside a <form> is invalid DOM
  return (
    <div className="flex flex-col">
      {actions.map(({ attribute, action, value, defaultValue }, i) => (
        <Text key={i}>
          {attribute}: {action} {value}, default: {defaultValue}
        </Text>
      ))}

      <label htmlFor="attribute" className="text-gray-100">
        Attribute
      </label>
      <input
        id="attribute"
        className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        onChange={(e) => setAttribute(e.target.value)}
        value={attribute}
      />

      <label htmlFor="action" className="text-gray-100">
        Action
      </label>
      <select
        id="action"
        className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        onChange={(e) => setAction(e.target.value as KeyValueAction)}
        value={action}
      >
        <option>INCREMENT</option>
        <option>DECREMENT</option>
        <option>SET</option>
      </select>

      <label htmlFor="value" className="text-gray-100">
        Value
      </label>
      <input
        id="value"
        type="number"
        className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        onChange={(e) => setValue(parseFloat(e.target.value))}
        value={value}
      />

      <label htmlFor="default-value" className="text-gray-100">
        Default Value
      </label>
      <input
        id="default-value"
        type="number"
        className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
        onChange={(e) => setDefaultValue(parseFloat(e.target.value))}
        value={defaultValue}
      />

      <Button
        className="mt-4"
        color="secondary"
        type="button"
        onClick={() => {
          if (attribute !== "" && action && value != 0) {
            addAction({ attribute, action, value, defaultValue });

            setAttribute("");
            setAction("INCREMENT");
            setValue(0);
            setDefaultValue(0);
            console.log(attribute, action, value);
          }
        }}
      >
        Create Action
      </Button>
    </div>
  );
};
