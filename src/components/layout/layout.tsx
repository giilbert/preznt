import Head from "next/head";
import { PropsWithChildren } from "react";
import { Breadcrumb, Navbar } from "./navbar";

export const Layout: React.FC<
  PropsWithChildren<{
    breadcrumbs?: false | Breadcrumb[];
  }>
> = ({ children, breadcrumbs = [] }) => {
  return (
    <>
      <Head>
        <title>preznt</title>
      </Head>

      <Navbar breadcrumbs={breadcrumbs ? breadcrumbs : undefined} />

      <div className="mx-16 mt-24 flex justify-center">
        <main className="max-w-5xl w-screen">{children}</main>
      </div>
    </>
  );
};
