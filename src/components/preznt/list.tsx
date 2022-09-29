import { useOrganization } from "@/lib/use-organization";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { useRouter } from "next/router";
import { Card, Heading, Text } from "../ui";

export const PrezntList: React.FC = () => {
  const router = useRouter();
  const organization = useOrganization();
  const {
    data: preznts,
    status,
    error,
  } = trpc.organization.getAllPreznts.useQuery({
    organizationId: organization.id,
  });

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div className="mt-4">
      {preznts.map((preznt) => (
        <Link
          key={preznt.id}
          href={{
            pathname: "/[slug]/preznt/[code]",
            query: {
              code: preznt.code,
              ...router.query,
            },
          }}
        >
          <a>
            <Card className="mb-2 flex gap-4 items-center cursor-pointer hover:bg-neutral-900 transition-colors">
              <Heading>{preznt.name}</Heading>
              <p className="text-gray-300">
                Expires{" "}
                {Intl.DateTimeFormat(undefined, {
                  dateStyle: "short",
                  timeStyle: "medium",
                }).format(preznt.expires)}
              </p>
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
};
