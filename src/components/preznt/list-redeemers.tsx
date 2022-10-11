import { Card, Heading } from "../ui";
import Image from "next/image";
import { PrezntOnUser } from "@prisma/client";
import moment from "moment";

type Redeemer = PrezntOnUser & {
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
};

export const ListPrezntRedeemers: React.FC<{
  redeemers: Redeemer[];
}> = ({ redeemers }) => {
  return (
    <div>
      {redeemers.map(({ user, ...redeemer }) => (
        <div
          key={user.email}
          className="bg-neutral-800 px-4 py-2 w-full flex gap-4 rounded items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.image || ""}
            className="rounded-full w-10 h-10"
            alt=""
          />
          <p className="font-bold">{user.name}</p>

          <p className="text-neutral-300">
            {moment(redeemer.redeemedAt).calendar()}
          </p>
        </div>
      ))}
    </div>
  );
};
