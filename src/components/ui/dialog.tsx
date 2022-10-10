import { Transition, Dialog } from "@headlessui/react";
import React, { Fragment } from "react";
import { FiX } from "react-icons/fi";
import { transitionClasses } from "./transition";

export const DialogWrapper: React.FC<
  React.PropsWithChildren<{
    isOpen: boolean;
    onClose: () => void;
  }>
> = (props) => (
  <Transition appear show={props.isOpen} as={Fragment}>
    <Dialog as="div" className="z-10" onClose={props.onClose}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      </Transition.Child>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center">
          <Transition.Child as={Fragment} {...transitionClasses}>
            <Dialog.Panel className="h-screen w-screen md:w-min md:h-min bg-background-secondary p-6 md:rounded-md border-accent-stroke border-2">
              <FiX
                onClick={props.onClose}
                className="ml-auto cursor-pointer transform hover:scale-105 position: absolute right-4"
                size={24}
              />
              {props.children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);
