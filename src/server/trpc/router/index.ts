// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { organizationRouter } from "./organization";
import { prezntRouter } from "./preznt";

export const appRouter = t.router({
  organization: organizationRouter,
  preznt: prezntRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
