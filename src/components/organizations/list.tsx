import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { Text } from "../ui";
import { SkeletonCard } from "../ui/skeletons";
import { PrezntCalendars } from "./preznts-calendar";

export const OrganizationList: React.FC = () => {
  const organizationsQuery = trpc.organization.getAllJoined.useQuery();

  if (organizationsQuery.status === "loading")
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <SkeletonCard amount={4} className="mt-4 h-80 m-0" />
      </div>
    );
  if (organizationsQuery.status === "error")
    return <Text>Error: {organizationsQuery.error.message}</Text>;

  const { organizations, preznts } = organizationsQuery.data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-3 gap-4">
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

              <div className="p-3 border-b-2 border-b-neutral-800">
                <p className="text-xl mr-auto text-ellipsis w-full overflow-hidden">
                  {organization.name}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-96 sm:w-full m-2">
                  <PrezntCalendars
                    preznts={preznts[organization.id] || []}
                    size="sm"
                    showDays={false}
                    decoration={true}
                  />
                </div>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};
