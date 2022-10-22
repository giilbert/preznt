import { Breadcrumb } from "@/components/layout/navbar";
import { MemberView } from "@/components/organizations/member-view";
import { OrganizationWrapper } from "@/components/organizations/wrapper";
import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { useState } from "react";

const MemberPage: NextPage = () => {
  const [breadcrumb, setBreadcrumb] = useState<Breadcrumb | null>(null);

  return (
    <OrganizationWrapper
      selectedTab="Members"
      requiresAdmin={true}
      breadcrumbs={breadcrumb ? [breadcrumb] : undefined}
    >
      <MemberView setBreadcrumb={setBreadcrumb} />
    </OrganizationWrapper>
  );
};

export default MemberPage;
