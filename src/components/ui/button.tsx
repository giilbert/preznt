import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";

const buttonColors = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "",
  danger: "",
};

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof buttonColors;
}

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IButtonProps>
>(({ color = "primary", className, children, ...others }, ref) => {
  return (
    <button
      className={`${clsx(
        buttonColors[color]
      )} mt-2 px-4 py-2 cursor-pointer rounded ${className}`}
      ref={ref}
      {...others}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
