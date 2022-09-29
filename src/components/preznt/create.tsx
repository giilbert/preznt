import { useZodForm } from "@/lib/use-zod-form";
import { trpc } from "@/utils/trpc";
import { Text, DialogWrapper, Button, Heading } from "@/components/ui";
import { createPrezntSchema } from "@/schemas/preznt";
import { z } from "zod";
import { PropsWithChildren, useCallback, useState } from "react";
import { KeyValueAction } from "@prisma/client";
import { useOrganization } from "@/lib/use-organization";
import { Disclosure, useDisclosure } from "@/lib/use-disclosure";
import { FiPlus, FiX } from "react-icons/fi";
import { TinyButton } from "../ui/tiny-button";

type Action = z.infer<typeof createPrezntSchema>["actions"][0];

export const CreatePreznt: React.FC<Disclosure> = (modalDisclosure) => {
  const { id: organizationId } = useOrganization();
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
  const { mutateAsync, isLoading } = trpc.preznt.create.useMutation();

  const addAction = useCallback(
    (action: Action) => {
      setValue("actions", [action, ...getValues("actions")]);
      // forces the form to rerender
      trigger("actions");
    },
    [getValues, setValue, trigger]
  );

  return (
    <>
      <DialogWrapper {...modalDisclosure}>
        <div className="flex items-center">
          <Heading level="h2" className="pb-2">
            Create Preznt
          </Heading>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            await mutateAsync({
              ...data,
              organizationId,
            });
            await organization.getAllPreznts.invalidate();
            modalDisclosure.onClose();
          })}
          className="md:w-screen md:max-w-2xl flex gap-2 flex-col"
        >
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
            type="datetime-local"
            id="expires"
            className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
          />
          <Text className="text-red-400">{errors.expires?.message}</Text>

          <div>
            <label htmlFor="main" className="text-gray-100 mr-3">
              Show on calendar
            </label>
            <input
              {...register("main")}
              type="checkbox"
              id="main"
              className="scale-150"
            />
          </div>

          <Text className="text-red-400">{errors.main?.message}</Text>

          <div>
            <label htmlFor="allow-join" className="text-gray-100 mr-3">
              Allow users to join the organization using this Preznt
            </label>
            <input
              {...register("allowJoin")}
              type="checkbox"
              id="allow-join"
              className="scale-150"
            />
          </div>
          <Text className="text-red-400">{errors.allowJoin?.message}</Text>

          <hr className="border-gray-800 my-2" />

          <Heading level="h2">Actions</Heading>
          <CreateAction actions={getValues("actions")} addAction={addAction} />

          <Button
            type="submit"
            className="mt-4 text-center"
            loading={isLoading}
          >
            Create Preznt
          </Button>
        </form>
      </DialogWrapper>
    </>
  );
};

const CreateAction: React.FC<{
  actions: Action[];
  addAction: (action: Action) => void;
}> = ({ actions, addAction }) => {
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
      {actions.map(({ attribute, action, value, defaultValue }, i) => (
        <Text className="mt-2" key={i}>
          <DarkBg>{action}</DarkBg> <DarkBg>{attribute}</DarkBg> by{" "}
          <DarkBg>{value}</DarkBg>, defaulting to{" "}
          <DarkBg>{defaultValue}</DarkBg>
        </Text>
      ))}

      <hr className="border-gray-800 my-4" />

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
          placeholder="Attribute"
          id="attribute"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded font-mono w-32"
          {...register("attribute")}
        />

        <label htmlFor="value" className="text-gray-100 mr-1">
          by
        </label>
        <input
          id="value"
          type="number"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded w-24"
          {...register("value", { valueAsNumber: true })}
        />

        <label htmlFor="default-value" className="text-gray-100 mr-1">
          or default to
        </label>
        <input
          id="default-value"
          type="number"
          className="bg-neutral-800 px-3 py-2 text-gray-100 rounded w-24"
          {...register("defaultValue", { valueAsNumber: true })}
        />

        <TinyButton
          type="button"
          onClick={handleSubmit((data) => {
            addAction(data);
            reset();
          })}
        >
          <FiPlus />
        </TinyButton>
      </div>

      {Object.values(errors).map((err) => (
        <Text key={err.ref?.name} className="text-red-400">
          {err.ref?.name}: {err.message}
        </Text>
      ))}
    </div>
  );
};

const DarkBg: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  <span className="px-2 py-1 bg-gray-800 rounded">{children}</span>
);
