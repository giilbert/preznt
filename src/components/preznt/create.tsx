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
import { FormProvider } from "react-hook-form";
import { InputField } from "../ui/input-field";

export const CreatePreznt: React.FC<Disclosure> = (modalDisclosure) => {
  const { id: organizationId } = useOrganization();
  const form = useZodForm({
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
      form.setValue("actions", [action, ...form.getValues("actions")]);
      setCreateActionActive(false);
      // forces the form to rerender
      form.trigger("actions");
    },
    [form]
  );

  return (
    <DialogWrapper {...modalDisclosure}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            if (stage === "general") {
              setStage("actions");
            } else if (stage === "actions") {
              await mutateAsync({
                ...data,
                organizationId,
              });
              await preznt.getPreznts.invalidate();

              modalDisclosure.onClose();
              form.reset();
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

              <InputField.Text name="name" />
              <InputField.Date name="expires" />
              <InputField.Checkbox name="main" label="SHOW ON CALENDAR" />
              <InputField.Checkbox name="allowJoin" label="ALLOW JOIN" />

              <Button className="mt-4 text-center w-min" type="submit">
                Next
              </Button>
            </>
          )}

          {stage === "actions" && (
            <>
              <Heading level="h2">Actions</Heading>
              <ListActions actions={form.getValues("actions")} />
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
                    form.trigger("expires");
                  }}
                >
                  Go Back
                </Button>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </DialogWrapper>
  );
};
