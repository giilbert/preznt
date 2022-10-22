import { env } from "@/env/server.mjs";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth";
import Pusher from "pusher";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  secret: env.PUSHER_APP_SECRET,
});

const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user) return res.status(403).end();

  const socketId = req.body["socket_id"];

  console.log("!!!!!!!!!!!!!!!!!!!!", socketId);

  pusher.authenticateUser(socketId, {
    id: session.user.id,
  });

  return res.status(200).end();
};

export default handler;
