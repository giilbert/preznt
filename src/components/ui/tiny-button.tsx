import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";

export const TinyButton = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>
>(({ children, className, ...rest }, ref) => {
  return (
    <button
      className={clsx(
        "w-8 h-8 bg-gray-600 flex justify-center items-center rounded hover:bg-gray-700",
        className
      )}
      {...rest}
      ref={ref}
    >
      {children}
    </button>
  );
});

TinyButton.displayName = "TinyButton";
