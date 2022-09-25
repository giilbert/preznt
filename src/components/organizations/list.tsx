import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { Card, Text } from "../ui";

export const OrganizationList: React.FC = () => {
  const {
    data: organizations,
    status,
    error,
  } = trpc.organization.getAllJoined.useQuery();

  if (status === "loading") return <Text>Loading</Text>;
  if (status === "error") return <Text>Error: {error.message}</Text>;

  return (
    <div>
      {organizations.map(({ organization }) => (
        <Link href={`/${organization.slug}`} key={organization.id} passHref>
          <a>
            <Card
              key={organization.id}
              className="my-3 flex flex-row items-center hover:border-gray-700"
            >
              <p className="text-xl mr-auto">{organization.name}</p>
              <FiChevronRight size="24" />
            </Card>
          </a>
        </Link>
      ))}
    </div>
  );
};
