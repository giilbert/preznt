import clsx from "clsx";
import { forwardRef, HTMLAttributes, PropsWithChildren } from "react";

export const Card = forwardRef<
  HTMLDivElement,
  PropsWithChildren<HTMLAttributes<HTMLDivElement>>
>(({ children, className, ...rest }, ref) => {
  return (
    <div
      className={clsx(
        "border border-gray-500 text-gray-300 px-6 py-4",
        className
      )}
      {...rest}
      ref={ref}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
