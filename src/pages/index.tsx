import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "@/utils/trpc";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";
import { Button, Text } from "@/components/ui";
import { JoinOrganization } from "@/components/organizations/join";
import { Navbar } from "@/components/layout/navbar";
import { Layout } from "@/components/layout/layout";

const Home: NextPage = () => {
  const { status, data } = useSession();

  if (status === "loading") return <p>Loading..</p>;
  if (status === "unauthenticated")
    return <Button onClick={() => signIn("google")}>Sign in</Button>;

  return (
    <Layout
      breadcrumbs={[
        {
          path: "/",
          name: "Dashboard",
        },
      ]}
    >
      <main className="w-5/6 max-w-4xl">
        <div className="flex gap-4 items-center"></div>

        <hr className="my-4" />
        <JoinOrganization />
        <OrganizationList />

        <hr className="my-4" />
        <CreateOrganization />
      </main>
    </Layout>
  );
};

export default Home;
