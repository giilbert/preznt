import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { OrganizationList } from "@/components/organizations/list";
import { CreateOrganization } from "@/components/organizations/create";
import { Button } from "@/components/ui";
import { JoinOrganization } from "@/components/organizations/join";
import { Layout } from "@/components/layout/layout";

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "loading") return <p>Loading..</p>;
  if (status === "unauthenticated")
    return <Button onClick={() => signIn("google")}>Sign in</Button>;

  return (
    <Layout>
      <JoinOrganization />
      <OrganizationList />

      <hr className="my-4" />
      <CreateOrganization />
    </Layout>
  );
};

export default Home;
