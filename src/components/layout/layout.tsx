import clsx from "clsx";
import Head from "next/head";
import { PropsWithChildren } from "react";
import { Breadcrumb, Navbar, Tab } from "./navbar";

export const Layout: React.FC<
  PropsWithChildren<{
    breadcrumbs?: false | Breadcrumb[];
    tabs?: false | Tab[];
    selectedTab?: false | string;
  }>
> = ({ children, breadcrumbs = [], tabs = [], selectedTab = "" }) => {
  return (
    <>
      <Head>
        <title>preznt</title>
      </Head>

      <Navbar
        breadcrumbs={breadcrumbs ? breadcrumbs : undefined}
        tabs={tabs ? tabs : undefined}
        selectedTab={selectedTab ? selectedTab : undefined}
      />

      <div
        className={clsx(
          (tabs || []).length === 0 ? "mt-28" : "mt-36",
          "mx-4 flex justify-center"
        )}
      >
        <main className="max-w-7xl w-screen">{children}</main>
      </div>
    </>
  );
};
