import clsx from "clsx";
import { forwardRef } from "react";

const sizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

interface TextProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /**
   * The font size.
   * @default "md" (1rem)
   */
  size?: keyof typeof sizes;
}

const defaultProps = {
  size: "md",
} as const;

export const Text = forwardRef<HTMLParagraphElement, TextProps>((p, ref) => {
  const props = { ...defaultProps, ...p };

  return (
    <p ref={ref} className={clsx(sizes[props.size], props.className)}>
      {props.children}
    </p>
  );
});

Text.displayName = "Text";
