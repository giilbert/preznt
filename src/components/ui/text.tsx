import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export const Text: React.FC<
  PropsWithChildren<
    DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >
  >
> = ({ children, className, ...others }) => {
  // TODO:
  return (
    <p className={clsx("text-gray-200", className)} {...others}>
      {children}
    </p>
  );
};
