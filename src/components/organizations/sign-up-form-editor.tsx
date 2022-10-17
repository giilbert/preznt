import { useCallback, useState } from "react";
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
import { Heading } from "../ui";

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

export const SignUpFormEditor: React.FC = () => {
  const [fields, setFields] = useState<Question[]>([
    {
      id: "one",
      name: "one",
      description: "asdasd",
    },
    {
      id: "two",
      name: "two",
      description: "Asdasdzx",
    },
    {
      id: "three",
      name: "three",
      description: "asdsa",
    },
    {
      id: "four",
      name: "four",
      description: "poewpo",
    },
  ]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

        console.log(`index ${oldIndex} moved to ${newIndex}`);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  return (
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
  );
};

const Question: React.FC<{ field: Question }> = (props) => {
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
