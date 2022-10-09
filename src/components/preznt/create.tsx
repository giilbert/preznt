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
import { Controller } from "react-hook-form";
import moment from "moment";
export const CreatePreznt: React.FC<Disclosure> = (modalDisclosure) => {
  const { id: organizationId } = useOrganization();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    getValues,
    trigger,
    control,
    watch,
    formState: { errors },
  } = useZodForm({
    schema: createPrezntSchema.omit({ organizationId: true }),
    defaultValues: {
      actions: [],
    },
  });
  const [createActionActive, setCreateActionActive] = useState(false);
  const { preznt } = trpc.useContext();
  const { mutateAsync, isLoading } = trpc.preznt.create.useMutation();
  const [stage, setStage] = useState<"general" | "actions">("general");
  const addAction = useCallback(
    (action: Action) => {
      setValue("actions", [action, ...getValues("actions")]);
      setCreateActionActive(false);
      // forces the form to rerender
      trigger("actions");
    },
    [getValues, setValue]
  );

  console.log(getValues());

  /*
        <form onSubmit={handleSubmit(async (data) => { await mutateAsync({
              ...data,
              organizationId,
            });
            await preznt.getPreznts.invalidate();
            modalDisclosure.onClose();
          })}
          className="md:w-screen md:max-w-2xl flex gap-2 flex-col"
        >
  */

  console.log(moment(watch("expires")).format("YYYY-MM-DDThh:mm"));

  return (
    <DialogWrapper {...modalDisclosure}>
      <form
        onSubmit={handleSubmit(async (data) => {
          if (stage === "general") {
            setStage("actions");
          } else if (stage === "actions") {
            await mutateAsync({
              ...data,
              organizationId,
            });
            await preznt.getPreznts.invalidate();

            modalDisclosure.onClose();
            reset();
          }
        })}
        className="md:w-screen md:max-w-2xl flex gap-2 flex-col"
      >
        {stage === "general" && (
          <>
            <div className="flex items-center">
              <Heading level="h2" className="pb-2">
                Create Preznt
              </Heading>
            </div>
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
            <Controller
              name="expires"
              control={control}
              render={({ field }) => (
                <input
                  value={
                    watch("expires")
                      ? moment(watch("expires")).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) => {
                    console.log(e.target.value);
                    field.onChange(new Date(e.target.value as string));
                  }}
                  autoComplete="off"
                  type="datetime-local"
                  id="expires"
                  className="bg-neutral-800 px-3 py-2 text-gray-100 rounded"
                />
              )}
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
                // value={getValues("allowJoin")}
                type="checkbox"
                id="allow-join"
                className="scale-150"
              />
            </div>
            <Text className="text-red-400">{errors.allowJoin?.message}</Text>

            <Button className="mt-4 text-center w-min" type="submit">
              Next
            </Button>
          </>
        )}

        {stage === "actions" && (
          <>
            <Heading level="h2">Actions</Heading>
            <ListActions actions={getValues("actions")} />
            {createActionActive ? (
              <CreateAction addAction={addAction} />
            ) : (
              <TinyButton onClick={() => setCreateActionActive(true)}>
                <FiPlus />
              </TinyButton>
            )}

            <div className="flex gap-2">
              <Button type="submit" className="text-center w-min">
                Submit
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="text-center w-min"
                onClick={() => {
                  setStage("general");
                  trigger("expires");
                }}
              >
                Go Back
              </Button>
            </div>
          </>
        )}
      </form>
    </DialogWrapper>
  );
};
