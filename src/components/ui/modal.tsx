import { Disclosure } from "@/lib/use-disclosure";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, HTMLAttributes, PropsWithChildren } from "react";

export const Modal: React.FC<
  PropsWithChildren<Disclosure & HTMLAttributes<HTMLDivElement>>
> = ({ isOpen, onClose, children, className, ...rest }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        onClose={onClose}
        className={clsx(
          "bg-red-200 max-w-2xl h-96 rounded transform translate-x-1/2 translate-y-1/2",
          className
        )}
        {...rest}
      >
        {children}
      </Dialog>
    </Transition>
  );
};
