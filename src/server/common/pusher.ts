import { env } from "@/env/server.mjs";
import Pusher from "pusher";

export const pusher = new Pusher({
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  appId: env.PUSHER_APP_ID,
  secret: env.PUSHER_APP_SECRET,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
});
