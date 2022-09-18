// src/server/trpc/router/index.ts
import { t } from "../trpc";
import { organizationRouter } from "./organization";

export const appRouter = t.router({
  organization: organizationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
