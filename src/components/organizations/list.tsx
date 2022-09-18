import { trpc } from "@/utils/trpc";

export const OrganizationList: React.FC = () => {
  const {
    data: organizations,
    status,
    error,
  } = trpc.organization.getAll.useQuery();

  if (status === "loading") return <p>Loading organizations</p>;
  if (status === "error") return <p>Error: {error.message}</p>;

  console.log(organizations);

  return (
    <div>
      <h1 className="font-bold text-2xl">Joined organizations</h1>
      {organizations.map(({ organization }) => (
        <p key={organization.id}>{organization.name}</p>
      ))}
    </div>
  );
};
