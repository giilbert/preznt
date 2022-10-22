import { env } from "@/env/client.mjs";
import { useDisclosure } from "@/lib/use-disclosure";
import { useOrganization } from "@/lib/use-organization";
import { useWindow } from "@/lib/use-window";
import { trpc } from "@/utils/trpc";
import { Transition } from "@headlessui/react";
import moment from "moment";
import { useRouter } from "next/router";
import Pusher from "pusher-js";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FiTrash, FiX } from "react-icons/fi";
import { ImEnlarge } from "react-icons/im";
import QRCode from "react-qr-code";
import { Button, Heading } from "../ui";
import { TinyButton } from "../ui/tiny-button";
import { ListPrezntRedeemers, Redeemer } from "./list-redeemers";
import * as superjson from "superjson";
import { ListActions } from "./list-actions";
import { ErrorMessage } from "../util/error-message";

export const PrezntInfo: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const {
    status,
    data: preznt,
    error,
  } = trpc.preznt.getByCode.useQuery({
    code: router.query.code as string,
    organizationId: organization.id,
  });
  const deletePreznt = trpc.preznt.delete.useMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const window = useWindow();
  const pusher = useRef<Pusher>();
  const [redeemers, setRedeemers] = useState<Map<string, Redeemer> | null>(
    null
  );

  useEffect(() => {
    if (!preznt) return;
    const map = new Map<string, Redeemer>();
    preznt.redeemedBy.map((r) => map.set(r.userId, r));
    setRedeemers(map);
  }, [preznt]);

  useEffect(() => {
    if (!preznt) return;

    if (!pusher.current) {
      pusher.current = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
        cluster: "us2",
        userAuthentication: {
          endpoint: "/api/pusher/authenticate-user",
          transport: "ajax",
        },
        channelAuthorization: {
          endpoint: "/api/pusher/authenticate-channel",
          transport: "ajax",
        },
      });
      pusher.current.connect();

      const channel = pusher.current.subscribe(`private-preznt-${preznt.id}`);
      channel.bind("redeemerAdd", (data: { raw: string }) => {
        const redeemer = superjson.parse<Redeemer>(data.raw);
        setRedeemers((redeemers) => {
          const newMap = cloneMap(redeemers || new Map());
          newMap.set(redeemer.userId, redeemer);
          return newMap;
        });
      });
    }

    return () => {
      pusher.current?.unbind_all();
    };
  }, [preznt]);

  const redeemersArray = useMemo(
    () =>
      Array.from((redeemers || new Map()).values())
        .slice(0, 50)
        .sort((a, b) => a.redeemedAt.getTime() - b.redeemedAt.getTime()),
    [redeemers]
  );

  if (status === "loading" || !redeemers) return <p>Loading..</p>;
  if (status === "error") return <ErrorMessage error={error} />;

  return (
    <div className="flex gap-8">
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
          <div className="w-screen h-screen fixed top-0 left-0 bg-background-secondary z-40">
            <div className="flex p-4 border-b border-b-neutral-700">
              <p className="text-2xl">{preznt.name}</p>
              <TinyButton onClick={onClose} className="ml-auto">
                <FiX />
              </TinyButton>
            </div>

            <div className="flex gap-8 h-full">
              <div className="flex flex-col pt-24 items-center w-[48rem] border-r-neutral-700 border-r">
                <div className="p-4 rounded">
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

                <p className="text-gray-300 mt-1">
                  Scan the QR code or enter in the code above
                </p>
              </div>

              <div className="pt-8 w-full mr-4">
                <Heading className="mb-2">Redeemed by</Heading>
                <ListPrezntRedeemers redeemers={redeemersArray} />
              </div>
            </div>
          </div>
        </Transition>
      )}

      <div className="w-[64rem] text-lg">
        <div className="flex gap-2">
          <Heading level="h1">{preznt.name}</Heading>

          <Button
            onClick={async () => {
              await deletePreznt
                .mutateAsync({
                  organizationId: organization.id,
                  code: preznt.code,
                })
                .catch(() => 0)
                .then(() => router.back());
            }}
            size="sm"
            variant="danger"
            className="ml-auto"
            loading={deletePreznt.isLoading}
          >
            Delete
          </Button>
          <Button
            onClick={onOpen}
            icon={<ImEnlarge />}
            className="items-center gap-2"
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

        <hr />

        <Heading>Actions: </Heading>
        <ListActions actions={preznt.actions} />
      </div>

      <div className="w-full">
        <Heading className="mb-2">Redeemed by</Heading>
        <ListPrezntRedeemers redeemers={redeemersArray} />
      </div>
    </div>
  );
};

// i am worried about performance...
function cloneMap<K, V>(old: Map<K, V>): Map<K, V> {
  const newMap = new Map<K, V>();
  old.forEach((v, k) => newMap.set(k, v));
  return newMap;
}
