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

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col gap-3">
          <div className="flex justify-center animate-bounce">
            <Image src="/logo.svg" width={77} height={77} alt="" />
          </div>
          <p className="text-lg text-gray-400">Defrosting lambda functions..</p>
        </div>
      </div>
    );

  if (status === "unauthenticated")
    return (
      <div className="flex justify-center items-center h-screen flex-col gap-8">
        <Image
          src="/large-logo.svg"
          width={1059.2 / 3}
          height={282.84 / 3}
          alt="Large preznt logo"
        />
        <p className="text-gray-300 text-lg">
          &quot;If I don&apos;t get into college it&apos;s on you Gilbert&quot;
          -{" "}
          <a
            href="https://www.nirnath.tech/"
            className="underline text-blue-500 hover:text-blue-400 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            Nirjhor
          </a>
        </p>

        <Button onClick={() => signIn("google")}>
          Sign in to the super duper cool app
        </Button>
      </div>
    );

  return (
    <Layout>
      <div className="flex gap-2">
        <JoinOrganization />
        <CreateOrganization />
      </div>
      <OrganizationList />
    </Layout>
  );
};

export default Home;
