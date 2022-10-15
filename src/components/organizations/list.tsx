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
    <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
      {organizations.map(({ organization }) => (
        <Link href={`/${organization.slug}`} key={organization.id} passHref>
          <a>
            <div
              key={organization.id}
              className="m-0 bg-background-secondary rounded-md hover:ring-2 ring-accent-primary transition-shadow"
            >
              <div
                className="w-full rounded-tl-md rounded-tr-md"
                style={{
                  backgroundImage: `url("${organization.headerUrl}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  aspectRatio: "5/1",
                }}
              />

              <div className="p-3">
                <p className="text-xl mr-auto">{organization.name}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};
