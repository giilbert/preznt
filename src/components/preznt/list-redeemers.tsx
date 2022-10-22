import { Card } from "../ui";
import { PrezntOnUser } from "@prisma/client";
import moment from "moment";
import { useOrganization } from "@/lib/use-organization";
import Link from "next/link";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export type Redeemer = PrezntOnUser & {
  user: {
    name: string | null;
    image: string | null;
    email: string | null;
  };
};

export const ListPrezntRedeemers: React.FC<{
  redeemers: Redeemer[];
}> = ({ redeemers }) => {
  const organization = useOrganization();
  const [ref] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      {redeemers.length === 0 && (
        <p className="text-gray-300">No redeemers yet</p>
      )}
      {redeemers.map(({ user, ...redeemer }) => (
        <Link
          href={{
            pathname: "/[slug]/member/[id]",
            query: {
              slug: organization.slug,
              id: redeemer.userId,
            },
          }}
          key={redeemer.userId}
        >
          <a>
            <Card className="bg-neutral-800 flex gap-4 items-center">
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
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
};
