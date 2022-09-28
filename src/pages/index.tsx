import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";
import { Button } from "@/components/ui";
import { JoinOrganization } from "@/components/organizations/join";
import { Layout } from "@/components/layout/layout";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return <p>Defrosting lambda functions...</p>;
  if (status === "unauthenticated")
    return <Button onClick={() => signIn("google")}>Sign in</Button>;

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
