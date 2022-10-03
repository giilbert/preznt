import { useZodForm } from "@/lib/use-zod-form";
import { trpc } from "@/utils/trpc";
import { Text, DialogWrapper, Button, Heading } from "@/components/ui";
import { Action, createPrezntSchema } from "@/schemas/preznt";
import { z } from "zod";
import { PropsWithChildren, useCallback, useState } from "react";
import { KeyValueAction } from "@prisma/client";
import { useOrganization } from "@/lib/use-organization";
import { Disclosure, useDisclosure } from "@/lib/use-disclosure";
import { FiPlus, FiX } from "react-icons/fi";
import { TinyButton } from "../ui/tiny-button";
import { CreateAction } from "./create-action";
import { ListActions } from "./list-actions";
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
  const [createActionActive, setCreateActionActive] = useState(false);
  const { organization } = trpc.useContext();
  const { mutateAsync, isLoading } = trpc.preznt.create.useMutation();

  const addAction = useCallback(
    (action: Action) => {
      setValue("actions", [action, ...getValues("actions")]);
      setCreateActionActive(false);
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
          <ListActions actions={getValues("actions")} />
          {createActionActive ? (
            <CreateAction addAction={addAction} />
          ) : (
            <TinyButton onClick={() => setCreateActionActive(true)}>
              <FiPlus />
            </TinyButton>
          )}

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
