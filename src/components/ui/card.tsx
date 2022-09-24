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
        "bg-background-secondary border-accent-stroke border-2 p-4 rounded-md",
        props.className
      )}
    >
      {props.children}
    </div>
  );
});
