import { Popover, Transition } from "@headlessui/react";
import { Placement } from "@popperjs/core";
import { Preznt, PrezntOnUser } from "@prisma/client";
import clsx from "clsx";
import moment from "moment";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { usePopper } from "react-popper";
import { Heading } from "../ui";
import { transitionClasses } from "../ui/transition";

type RedeemedPreznt = PrezntOnUser & { preznt: Preznt };

const range = (max: number) =>
  Array(max)
    .fill(0)
    .map((_, i) => i);
const daysOfTheWeekClasses = "text-center bg-neutral-800 rounded";

export const PrezntCalendars: React.FC<{
  preznts: RedeemedPreznt[];
  size?: "sm";
  showDays?: boolean;
  decoration?: boolean;
}> = ({ preznts, size, showDays = true, decoration }) => {
  // groups preznts by day
  const prezntsData = useMemo(() => {
    const map = new Map<number, RedeemedPreznt[]>();
    preznts.forEach((preznt) => {
      const date = preznt.preznt.expires.getDate();
      const current = map.get(date) || [];
      current.push(preznt);
      map.set(date, current);
    });

    return map;
  }, [preznts]);

  const padding = moment().startOf("month").day();
  const daysInMonth = moment().daysInMonth();

  return (
    <>
      {!decoration && (
        <Heading level="h3" className="mb-2">
          Preznts in {moment().format("MMMM")}
        </Heading>
      )}
      <div
        className={clsx(
          "grid grid-cols-7",
          size === "sm" && "max-w-sm",
          size === "sm" ? "gap-2" : "gap-1"
        )}
      >
        {showDays && (
          <>
            <p className={daysOfTheWeekClasses}>Sun</p>
            <p className={daysOfTheWeekClasses}>Mon</p>
            <p className={daysOfTheWeekClasses}>Tue</p>
            <p className={daysOfTheWeekClasses}>Wed</p>
            <p className={daysOfTheWeekClasses}>Thu</p>
            <p className={daysOfTheWeekClasses}>Fri</p>
            <p className={daysOfTheWeekClasses}>Sat</p>
          </>
        )}

        {range(padding).map((i) => (
          <div key={`pad-${i}`} />
        ))}
        {range(daysInMonth).map((i) => {
          const preznts = prezntsData.get(i);
          const hasMainPreznt = preznts?.some(({ preznt }) => preznt.main);

          return (
            <CalendarCell
              preznts={preznts || []}
              hasMainPreznt={hasMainPreznt || false}
              hasAnyPreznts={(preznts || []).length !== 0}
              day={i + 1}
              decoration={decoration || false}
              key={i}
            />
          );
        })}
      </div>
    </>
  );
};

const CalendarCell: React.FC<{
  hasMainPreznt: boolean;
  hasAnyPreznts: boolean;
  decoration: boolean;
  day: number;
  preznts: RedeemedPreznt[];
}> = ({ hasMainPreznt, hasAnyPreznts, day, preznts, decoration }) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 12],
        },
      },
    ],
  });
  const router = useRouter();

  return (
    <Popover
      className={clsx(
        "group aspect-square rounded",
        !hasMainPreznt && hasAnyPreznts && "bg-orange-400",
        hasMainPreznt && "bg-green-600",
        !hasMainPreznt && !hasAnyPreznts && "bg-neutral-850"
      )}
    >
      {!decoration && preznts.length > 0 ? (
        <Popover.Button ref={setReferenceElement} className="w-full h-full">
          {day}
        </Popover.Button>
      ) : (
        <p className="w-full h-full flex justify-center items-center">
          <span
            className={clsx(
              hasAnyPreznts ? "text-foreground-primary" : "text-neutral-500"
            )}
          >
            {day}
          </span>
        </p>
      )}

      <Transition {...transitionClasses}>
        <Popover.Panel
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="px-8 py-1 rounded bg-background-primary border border-neutral-800 w-56"
        >
          <ul className="list-disc">
            {preznts.map(({ preznt, redeemedAt }) => (
              <Link
                key={preznt.id}
                href={{
                  pathname: "/[slug]/preznt/[code]",
                  query: {
                    code: preznt.code,
                    slug: router.query.slug,
                  },
                }}
              >
                <a>
                  <li>
                    <b>{preznt.name}</b>
                    <span className="ml-1 text-neutral-300">
                      {moment(redeemedAt).format("HH:mm")}
                    </span>
                  </li>
                </a>
              </Link>
            ))}
          </ul>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
