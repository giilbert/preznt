import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";
import { Button, Text } from "@/components/ui";

const Home: NextPage = () => {
  const { status, data } = useSession();

  return (
    <>
      <Head>
        <title>preznt</title>
      </Head>

      <main className="p-8 flex justify-center">
        {status === "loading" && <p>Loading..</p>}
        {status === "unauthenticated" && (
          <Button onClick={() => signIn("google")}>Sign in</Button>
        )}
        {status === "authenticated" && (
          <div className="w-5/6 max-w-4xl">
            <div className="flex gap-4 items-center">
              <Text>Signed in as {data.user?.name}</Text>
              <Button color="danger" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>

            <hr className="my-4" />
            <OrganizationList />

            <hr className="my-4" />
            <CreateOrganization />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
