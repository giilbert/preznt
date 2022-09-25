import { useState } from "react";

export const useDisclosure = (defaultOpen: boolean | undefined = false) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return {
    isOpen,
    setIsOpen,
    isClosed: !isOpen,

    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen(!isOpen),
  };
};

export type Disclosure = ReturnType<typeof useDisclosure>;
