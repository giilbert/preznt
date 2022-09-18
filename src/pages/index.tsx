import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";

const Home: NextPage = () => {
  const { status, data } = useSession();

  return (
    <>
      <Head>
        <title>preznt</title>
      </Head>

      <main className="p-8">
        {status === "loading" && <p>Loading..</p>}
        {status === "unauthenticated" && (
          <button
            onClick={() => signIn("google")}
            className="bg-green-500 px-4 py-2 cursor-pointer text-white hover:bg-green-600 font-black rounded"
          >
            Sign in
          </button>
        )}
        {status === "authenticated" && (
          <>
            <div className="flex gap-4 items-center">
              <p>Signed in as {data.user?.name}</p>
              <button
                onClick={() => signOut()}
                className="bg-red-500 px-4 py-2 cursor-pointer text-white hover:bg-red-600 font-black rounded"
              >
                Sign out
              </button>
            </div>

            <hr className="my-4" />
            <OrganizationList />

            <hr className="my-4" />
            <CreateOrganization />
          </>
        )}
      </main>
    </>
  );
};

export default Home;
