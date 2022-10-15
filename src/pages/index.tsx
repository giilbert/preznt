import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";
import { Button } from "@/components/ui";
import { JoinOrganization } from "@/components/organizations/join";
import { Layout } from "@/components/layout/layout";
import Image from "next/image";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return <p>Defrosting lambda functions...</p>;
  if (status === "unauthenticated")
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-8">
        <Image
          src="/large-logo.svg"
          width={1059.2 / 3}
          height={282.84 / 3}
          alt="Large preznt logo"
        />

        <Button onClick={() => signIn("google")} className="w-24">
          Sign in
        </Button>
      </div>
    );

  return (
    <Layout
      tabs={[
        {
          name: "Organizations",
          path: "/",
        },
      ]}
      selectedTab="Organizations"
    >
      <div className="flex gap-2">
        <JoinOrganization />
        <CreateOrganization />
      </div>
      <OrganizationList />
    </Layout>
  );
};

export default Home;
