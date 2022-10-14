import clsx from "clsx";
import { forwardRef } from "react";

interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  clickable?: boolean;
  href?: string;
}

export const Card = forwardRef<HTMLDivElement, ICardProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "bg-neutral-850 px-4 py-2 w-full rounded",
        props.clickable &&
          "hover:bg-neutral-800 transition-colors cursor-pointer",
        props.className
      )}
    >
      {props.children}
    </div>
  );
});

Card.displayName = "Card";
