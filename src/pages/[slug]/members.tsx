import { OrganizationMembersList } from "@/components/organizations/members-list";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { NextPage } from "next";

const OrganizationMembersPage: NextPage = () => {
  return (
    <OrganizationWrapper selectedTab="Members" requiresAdmin={true}>
      <OrganizationMembersList />
    </OrganizationWrapper>
  );
};

export default OrganizationMembersPage;
