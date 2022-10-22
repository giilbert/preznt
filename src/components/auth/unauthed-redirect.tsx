import { signIn, useSession } from "next-auth/react";
import { PropsWithChildren } from "react";

export const UnauthedRedirect: React.FC<
  PropsWithChildren<Record<never, string>>
> = ({ children }) => {
  const { status } = useSession();

  if (status === "loading") return null;

  if (status === "unauthenticated") {
    signIn("google");
  }

  return <>{children}</>;
};
