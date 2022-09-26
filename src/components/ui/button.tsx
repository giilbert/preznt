import React, { forwardRef, Fragment } from "react";
import NextLink from "next/link";
import { Url } from "url";
import clsx from "clsx";
import { Spinner } from "../util/spinner";

const sizes = {
  sm: "py-1 px-4 rounded",
  md: "py-2 px-6 rounded",
  lg: "py-3 px-9 rounded",
};

const variants = {
  primary: "bg-accent-primary text-foreground-primary hover:bg-opacity-80",
  secondary:
    "border-solid border-2 border-accent-stroke bg-accent-secondary text-white hover:bg-opacity-60",
  "outline-primary":
    "border-solid border-2 border-accent-primary hover:bg-accent-primary hover:text-foreground-primary",
  "outline-secondary":
    "border-solid border-2 border-accent-stroke hover:bg-accent-secondary hover:text-white",
  ghost: "",
  danger: "bg-accent-danger text-foreground-primary hover:bg-opacity-80",
  unstyled: "",
};

const variantHover = {
  primary: "hover:bg-opacity-80",
  secondary: "hover:bg-opacity-60",
  "outline-primary": "hover:bg-accent-primary hover:text-foreground-primary",
  "outline-secondary": "hover:bg-accent-secondary hover:text-white",
  ghost: "hover:bg-accent-secondary",
  danger: "hover:bg-opacity-90",
  unstyled: "",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Size of the button.
   * @default "md"
   */
  size?: keyof typeof sizes;
  /**
   * Variant of the button.
   * @default "secondary"
   */
  variant?: keyof typeof variants;
  /**
   * The URL to link to, via `NextLink`
   */
  href?: Partial<Url> | string;
  /**
   * Left positioned Icon
   */
  icon?: JSX.Element;
  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether the button is loading
   * @default false
   */
  loading?: boolean;
}

const defaultProps = {
  size: "md",
  variant: "primary",
  disabled: false,
  loading: false,
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    // spread default props, since {} is truthy
    const { size, variant, href, icon, disabled, loading, className, ...rest } =
      {
        ...defaultProps,
        ...props,
      };

    // wrap the component in a NextLink if the href is provided
    const WrapperComponent = href ? NextLink : Fragment;

    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <WrapperComponent {...(href ? { href } : ({} as any))}>
        <button
          ref={ref}
          className={clsx(
            `font-medium transition-all truncate flex items-center max-w-xs`,
            sizes[size],
            variants[variant],
            !disabled && !loading && `${variantHover[variant]} active:scale-95`,
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          aria-disabled={disabled}
          role={href ? "link" : "button"}
          {...rest}
        >
          <span>
            {!loading && icon}
            {loading && <Spinner />}
          </span>
          <span className={clsx((icon || loading) && rest.children && "ml-2")}>
            {props.children}
          </span>
        </button>
      </WrapperComponent>
    );
  }
);

Button.displayName = "Button";
