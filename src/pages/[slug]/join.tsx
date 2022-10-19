import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { Heading } from "@/components/ui";
import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";

const Form: React.FC = () => {
  const organization = useOrganization();

  return <div>asdsad</div>;
};

const OrganizationJoinPage: NextPage = () => {
  const router = useRouter();
  const organizationQuery =
    trpc.organization.signUpForm.getOrganizationSignUpForm.useQuery(
      { slug: router.query.slug as string },
      { enabled: !!router.query.slug }
    );

  if (organizationQuery.status === "loading") return <p>Loading</p>;
  if (organizationQuery.status === "error")
    return <p>Error: {organizationQuery.error.message}</p>;
  const organization = organizationQuery.data;

  return (
    <div className="flex justify-center pt-4">
      <main className="w-[36rem] flex gap-4 flex-col">
        <div
          className="w-full rounded"
          style={{
            backgroundImage: `url("${organization.headerUrl}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            aspectRatio: "5/1",
          }}
        />

        <h1 className="font-bold text-4xl">{organization.name}</h1>

        {JSON.stringify(organization.signUpFields)}
      </main>
    </div>
  );
};

export default OrganizationJoinPage;
