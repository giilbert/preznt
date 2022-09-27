import { Button, Text } from "@/components/ui";
import { FiChevronDown } from "react-icons/fi";
import { transitionClasses } from "@/components/ui/transition";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useRouter } from "next/router";

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface Tab {
  name: string;
  path: string;
}

export const Navbar: React.FC<{
  breadcrumbs?: Breadcrumb[];
  tabs?: Tab[];
  selectedTab?: string;
}> = ({ breadcrumbs, tabs, selectedTab }) => (
  <div className="fixed top-0 left-0 px-4 py-2 w-screen bg-background-tint border-b-neutral-800 border-b flex justify-center">
    <div className="w-full max-w-5xl">
      <div className="flex items-center w-full">
        <div className="mr-auto flex items-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt=""
              width="40px"
              height="40px"
              className="cursor-pointer hover:scale-105"
            />
          </Link>

          {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        </div>
        <ProfileButton />
      </div>

      {tabs && <Tabs tabs={tabs} selected={selectedTab || ""} />}
    </div>
  </div>
);

const Breadcrumbs: React.FC<{ breadcrumbs: Breadcrumb[] }> = ({
  breadcrumbs,
}) => {
  const router = useRouter();

  return (
    <>
      {breadcrumbs.map((breadcrumb, i) => {
        return (
          <p className="text-gray-300 ml-3 text-lg" key={i}>
            <Link href={{ pathname: breadcrumb.path, query: router.query }}>
              {breadcrumb.name}
            </Link>
            {i + 1 !== breadcrumbs.length && (
              <span className="ml-3 text-gray-500">/</span>
            )}
          </p>
        );
      })}
    </>
  );
};

const ProfileButton: React.FC = () => {
  const { status, data } = useSession();

  return status === "authenticated" ? (
    <Popover as="div" className="relative">
      <Popover.Button as="div">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.user?.image || ""}
          alt="profile picture"
          className="rounded-full cursor-pointer w-10 h-10"
        />
      </Popover.Button>

      <Transition as={Fragment} {...transitionClasses}>
        <Popover.Panel className="absolute right-1/2 z-10 mt-3 w-56 transform translate-x-9 px-4">
          {() => (
            <Button
              onClick={async () => {
                await signOut();
                window.location.href = "/";
              }}
              variant="danger"
              size="sm"
              className="w-full flex justify-center"
            >
              Sign Out
            </Button>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  ) : null;
};

const Tabs: React.FC<{ tabs: Tab[]; selected: string }> = ({
  tabs,
  selected,
}) => {
  const router = useRouter();

  return (
    <div className="w-full mt-3 flex gap-4">
      {tabs.map((tab, i) => (
        <Link
          href={{
            pathname: tab.path,
            query: router.query,
          }}
          passHref
          key={i}
        >
          <a
            className={clsx(
              "text-gray-400 hover:text-gray-50 hover:bg-background-secondary w-min px-2 py-0.5 rounded cursor-pointer transition-all",
              tab.name === selected &&
                "text-gray-50 after:border-b-2 after:border-gray-100 after:block after:relative after:-bottom-2.5"
            )}
          >
            {tab.name}
          </a>
        </Link>
      ))}
    </div>
  );
};
