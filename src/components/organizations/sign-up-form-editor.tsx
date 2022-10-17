import { useCallback, useEffect, useState } from "react";
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

type Question = {
  id: string;
  name: string;
  description: string;
};

/*

Mechanics of drag in drop in database:

DETECTING IF ITEM MOVES TO AN EARLIER / LATER POSITION:
  EARLIER -- from > to
  LATER   -- from < to

0  0          0  0
1 v1 <<<      1  3 <
2 v2   ^      2  1 <
3 v3 >>^      3  2 <
4  4          4  4
5  5          5  5

WHEN TO IS EARLIER THAN FROM
1. `from`'s index becomes `to`'s index
2. every index between the from (exclusive) and to (inclusive) is -= 1
   ex: 3 moved to the place of 1
     - 2 -> 1
     - 3 -> 2

WHEN TO IS LATER THAN FROM
0  0          0  0
1 ^1 >>v      1  2 <
2 ^2   v      2  3 <
3 ^3 <<<      3  1 <
4  4          4  4
5  5          5  5
except:
2. every index between from (INCLUSIVE) and to (EXCLUSIVE) is += 1
   ex: 1 moved to the place of 3
     - 1 -> 2
     - 2 -> 3

*/

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
  const [ref, enableAutoAnimate] = useAutoAnimate<HTMLDivElement>();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    enableAutoAnimate(true);

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(
          ({ id }) => id === (active.id as string)
        );
        const newIndex = items.findIndex(
          ({ id }) => id === (over?.id as string)
        );

        console.log(`index ${oldIndex} moved to ${newIndex}`);
        reorderField.mutate({
          organizationId: organization.id,
          fromIndex: oldIndex,
          toIndex: newIndex,
        });

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <div ref={ref} className="mb-12">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => enableAutoAnimate(false)}
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

const Question: React.FC<{ field: SignUpFieldWithId }> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="bg-background-secondary my-1 px-4 p-2"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Heading>{props.field.name}</Heading>
      {props.field.description}
    </div>
  );
};
