import { env } from "@/env/server.mjs";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";
import { prisma } from "@/server/db/client";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  secret: env.PUSHER_APP_SECRET,
});

// TODO: ya need to test if this is actually secure gilbo
const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user) return res.status(403).end();

  const socketId: string = req.body["socket_id"];
  const channel: string = req.body["channel_name"];

  const matches = /private-preznt-(.+)$/g.exec(channel);
  if (!matches) return res.status(403).end();

  const prezntId = matches[1];

  // check if user is an admin
  const preznt = await prisma.preznt.findUnique({
    where: {
      id: prezntId,
    },
    include: {
      organization: {
        include: {
          users: {
            where: {
              userId: session.user.id,
              status: {
                not: "MEMBER",
              },
            },
          },
        },
      },
    },
  });
  if (!preznt) return res.status(404).end();
  if (preznt.organization.users.length === 0) return res.status(403).end();

  return res.status(200).send(pusher.authorizeChannel(socketId, channel));
};

export default handler;
