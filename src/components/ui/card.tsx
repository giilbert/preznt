import clsx from "clsx";
import { forwardRef } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "bg-background-secondary border-accent-stroke border px-4 py-2 rounded",
        props.className
      )}
    >
      {props.children}
    </div>
  );
});

Card.displayName = "Card";
