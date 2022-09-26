import { Text } from "@/components/ui";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { NextPage } from "next";

const OrganizationSettingsPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Settings" requiresAdmin={true}>
      {(organization) => (
        <>
          <Text>Id: {organization.id}</Text>
          <Text>Name: {organization.name}</Text>
          <Text>Join code: {organization.joinCode}</Text>
          <Text>Slug: {organization.slug}</Text>
          <Text>Private: {organization.private ? "Yes" : "No"}</Text>
        </>
      )}
    </OrganizationWrapper>
  );
};

export default OrganizationSettingsPage;
