import { useDisclosure } from "@/lib/use-disclosure";
import { useOrganization } from "@/lib/use-organization";
import { useWindow } from "@/lib/use-window";
import { trpc } from "@/utils/trpc";
import { Transition } from "@headlessui/react";
import moment from "moment";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { FiX } from "react-icons/fi";
import { ImEnlarge } from "react-icons/im";
import QRCode from "react-qr-code";
import { Button, Heading } from "../ui";
import { TinyButton } from "../ui/tiny-button";
import { ListPrezntRedeemers } from "./list-redeemers";

export const PrezntInfo: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const {
    status,
    data: preznt,
    error,
  } = trpc.preznt.getByCode.useQuery(
    {
      code: router.query.code as string,
      organizationId: organization.id,
    },
    { refetchOnWindowFocus: false }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const window = useWindow();

  if (status === "loading") return <p>Loading..</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  return (
    <div className="flex gap-4">
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

              <div className="pt-8 w-full mr-4">
                <Heading className="mb-2">Redeemed by</Heading>
                <ListPrezntRedeemers redeemers={preznt.redeemedBy} />
              </div>
            </div>
          </div>
        </Transition>
      )}

      <div className="w-[50rem] text-lg">
        <div className="flex gap-2">
          <Heading level="h1">{preznt.name}</Heading>
          <Button
            onClick={onOpen}
            icon={<ImEnlarge />}
            className="items-center gap-2 ml-auto"
            size="sm"
            variant="secondary"
          >
            Presentation
          </Button>
        </div>

        <p className="text-gray-300">
          Expires {moment(preznt.expires).calendar()}
        </p>
        <p>
          Code: <span className="font-mono">{preznt.code}</span>
        </p>
      </div>

      <div className="w-full">
        <Heading className="mb-2">Redeemed by</Heading>
        <ListPrezntRedeemers redeemers={preznt.redeemedBy} />
      </div>
    </div>
  );
};
