import { useCallback, useEffect, useRef, useState } from "react";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  DndContext,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { Button, Heading } from "../ui";
import { SignUpField, SignUpFieldType } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { FiMenu, FiPlus, FiTrash } from "react-icons/fi";
import { useOrganization } from "@/lib/use-organization";
import { TinyButton } from "../ui/tiny-button";
import { Spinner } from "../util/spinner";
import { useZodForm } from "@/lib/use-zod-form";
import { editSignUpFieldSchema } from "@/schemas/organization";
import { FormProvider, useFormContext } from "react-hook-form";
import { QuestionInputField } from "./sign-up-form-field-editor";
import clsx from "clsx";
import { debounce } from "@/utils/debounce";
import { z } from "zod";

type Question = {
  id: string;
  name: string;
  description: string;
};

type SignUpFieldWithId = SignUpField & { id: string };

export const SignUpFormEditor: React.FC<{
  fields: SignUpFieldWithId[];
}> = ({ fields: f }) => {
  const createField = trpc.organization.signUpForm.createField.useMutation();
  const reorderField = trpc.organization.signUpForm.reorder.useMutation();
  const trpcContext = trpc.useContext();
  const organization = useOrganization();
  const [fields, setFields] = useState<SignUpFieldWithId[]>(f);
  useEffect(() => {
    setFields(f);
  }, [f]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const [queue, setQueue] = useState<
    Parameters<typeof reorderField["mutate"]>[0][]
  >([]);

  useEffect(() => {
    if (reorderField.status === "loading") return;
    const next = queue.shift();
    if (next) {
      reorderField.mutate(next);
    }
  }, [queue, reorderField, queue.length, reorderField.status]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(
          ({ id }) => id === (active.id as string)
        );
        const newIndex = items.findIndex(
          ({ id }) => id === (over?.id as string)
        );

        setQueue((old) => [
          ...old,
          {
            organizationId: organization.id,
            fromIndex: oldIndex,
            toIndex: newIndex,
          },
        ]);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <div className="mb-12">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[
          restrictToVerticalAxis,
          restrictToWindowEdges,
          restrictToParentElement,
        ]}
      >
        <SortableContext items={fields} strategy={verticalListSortingStrategy}>
          {fields.map((field) => (
            <Field key={field.name} field={field} />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        className="w-full h-12 mt-2"
        variant="outline-secondary"
        loading={createField.isLoading}
        onClick={async () => {
          await createField
            .mutateAsync({
              organizationId: organization.id,
            })
            .catch(() => 0);
          await trpcContext.organization.signUpForm.getAllFields.invalidate();
        }}
      >
        <FiPlus className="mr-2" /> Add field
      </Button>
    </div>
  );
};

const inputClasses =
  "px-3 py-1 rounded w-full ring-accent-primary focus:ring-2";

const Field: React.FC<{ field: SignUpFieldWithId }> = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });
  const deleteField = trpc.organization.signUpForm.deleteField.useMutation();
  const updateField = trpc.organization.signUpForm.updateField.useMutation();
  const organization = useOrganization();
  const trpcContext = trpc.useContext();
  const form = useZodForm({
    schema: editSignUpFieldSchema,
    defaultValues: field,
  });

  useEffect(() => {
    type Fields = z.infer<typeof editSignUpFieldSchema>;
    const { unsubscribe } = form.watch(
      debounce(({ type, description, attribute, name }: Partial<Fields>) => {
        updateField.mutate({
          organizationId: organization.id,
          id: field.id,
          type: type as SignUpFieldType,
          description: description as string,
          attribute: attribute as string,
          name: name as string,
        });
      })
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-background-secondary my-1 px-4 p-2 rounded flex gap-4"
      ref={setNodeRef}
      style={style}
    >
      <p {...attributes} {...listeners} className="mt-2">
        <FiMenu size="20" />
      </p>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            console.log(values);
          })}
          className="w-full flex flex-col gap-2"
        >
          <div className="flex gap-1">
            <input
              {...form.register("name")}
              className={inputClasses}
              placeholder="Name"
            />
            <select
              className={clsx(inputClasses, "w-min")}
              {...form.register("type")}
            >
              {Object.keys(SignUpFieldType).map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>

          <textarea
            {...form.register("description")}
            className={clsx(inputClasses, "h-24 resize-none")}
            placeholder="Description"
          />

          <QuestionInputField />

          <div className="flex items-center gap-2">
            <p>Attribute</p>
            <input
              {...form.register("attribute")}
              className={clsx(inputClasses)}
              placeholder="Name"
            />
          </div>
        </form>
      </FormProvider>

      <button
        className="w-8 h-8 flex justify-center items-center rounded ml-auto bg-red-500 hover:bg-red-600 transition-colors"
        onClick={async () => {
          await deleteField.mutateAsync({
            organizationId: organization.id,
            id: field.id,
          });
          await trpcContext.organization.signUpForm.getAllFields.invalidate();
        }}
      >
        {deleteField.isLoading ? <Spinner /> : <FiTrash />}
      </button>
    </div>
  );
};
