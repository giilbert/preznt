import { useDisclosure } from "@/lib/use-disclosure";
import { useOrganization } from "@/lib/use-organization";
import { useWindow } from "@/lib/use-window";
import { trpc } from "@/utils/trpc";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import QRCode from "react-qr-code";
import { Button, Heading } from "../ui";
import { TinyButton } from "../ui/tiny-button";

export const PrezntInfo: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const { status, data, error } = trpc.preznt.getByCode.useQuery({
    code: router.query.code as string,
    organizationId: organization.id,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const window = useWindow();

  if (status === "loading") return <p>Loading..</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  const { preznt } = data;

  return (
    <div>
      {window && (
        <Transition
          as={Fragment}
          show={isOpen}
          enter="transform transition duration-[400ms]"
          enterFrom="opacity-0 scale-90"
          enterTo="opacity-100 scale-100"
          leave="transform duration-200 transition ease-in-out"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="w-screen h-screen fixed top-0 left-0 bg-background-secondary">
            <div className="flex p-4 border-b border-b-neutral-700">
              <p className="text-2xl">{preznt.name}</p>
              <TinyButton onClick={onClose} className="ml-auto">
                <FiX />
              </TinyButton>
            </div>

            <div className="flex gap-8 h-full">
              <div className="flex flex-col pt-24 items-center w-[36rem] border-r-neutral-700 border-r">
                <div className="p-4 bg-background-primary rounded">
                  <QRCode
                    value={`${window.location.origin}/${
                      router.query.slug as string
                    }/preznt/${router.query.code as string}`}
                  />
                </div>

                <div className="flex text-gray-200 font-mono text-2xl gap-0.5 mt-4">
                  {(router.query.code as string).split("").map((char, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 flex justify-center items-center rounded bg-gray-700"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <Heading>Redeemed by</Heading>
                <p>TODO</p>
              </div>
            </div>
          </div>
        </Transition>
      )}

      <Heading>{preznt.name}</Heading>
      <p className="text-gray-300">
        Expires{" "}
        {Intl.DateTimeFormat(undefined, {
          dateStyle: "short",
          timeStyle: "medium",
        }).format(preznt.expires)}
      </p>
      <p>
        Code: <span className="font-mono">{preznt.code}</span>
      </p>

      <Button onClick={onOpen}>Full screen</Button>
    </div>
  );
};
