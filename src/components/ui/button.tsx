import clsx from "clsx";
import { ButtonHTMLAttributes, forwardRef, PropsWithChildren } from "react";

const buttonColors = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white active:bg-blue-700",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white active:bg-gray-700",
  danger: "bg-red-500 hover:bg-red-600 text-white active:bg-red-700",
  confirm: "bg-green-500 hover:bg-green-600 text-white active:bg-green-700",
};

const buttonSize = {
  sm: "px-3 py-0.5",
  md: "px-5 py-2",
  lg: "px-8 py-2 text-lg",
};

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof buttonColors;
  size?: keyof typeof buttonSize;
}

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<IButtonProps>
>(({ color = "primary", size = "md", className, children, ...others }, ref) => {
  return (
    <button
      className={`${clsx(
        buttonColors[color],
        buttonSize[size],
        "cursor-pointer",
        "rounded",
        "font-bold",
        "transition-all",
        className
      )}`}
      ref={ref}
      {...others}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
