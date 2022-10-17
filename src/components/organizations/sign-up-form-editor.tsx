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
import { SignUpField } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { FiPlus } from "react-icons/fi";
import { useOrganization } from "@/lib/use-organization";
import { useAutoAnimate } from "@formkit/auto-animate/react";
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
  }, [queue.length, reorderField.status]);

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
            <Question key={field.name} field={field} />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        className="w-full h-12"
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

const Question: React.FC<{ field: SignUpFieldWithId }> = ({ field }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-background-secondary my-1 px-4 p-2 rounded"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Heading level="h3">{field.name}</Heading>
      {field.description && <p>{field.description}</p>}
    </div>
  );
};
