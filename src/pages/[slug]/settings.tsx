import { Text } from "@/components/ui";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { NextPage } from "next";
import { trpc } from "@/utils/trpc";
import { OrganizationSettings } from "@/components/organizations/settings";

const OrganizationSettingsPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Settings" requiresAdmin={true}>
      <OrganizationSettings />
    </OrganizationWrapper>
  );
};

export default OrganizationSettingsPage;
