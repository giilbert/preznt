import { Button, Text } from "@/components/ui";
import { FiChevronDown } from "react-icons/fi";
import { transitionClasses } from "@/components/ui/transition";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";

export interface Breadcrumb {
  name: string;
  path: string;
}

export const Navbar: React.FC<{
  breadcrumbs?: Breadcrumb[];
}> = ({ breadcrumbs }) => {
  const { status, data } = useSession();

  return (
    <div className="fixed top-0 left-0 py-2 px-4 w-screen flex justify-center bg-background-primary border-b-neutral-800 border-b">
      <div className="flex items-center max-w-5xl w-screen">
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

          {breadcrumbs?.map((breadcrumb, i) => {
            const path =
              "/" +
              breadcrumbs
                .slice(0, i + 1)
                .map((v) => v.path)
                .join("/");
            console.log(path, breadcrumbs.slice(0, i + 1));

            return (
              <p className="text-gray-200 ml-3" key={i}>
                <Link href={path}>{breadcrumb.name}</Link>
                {i + 1 !== breadcrumbs.length && (
                  <span className="ml-3">/</span>
                )}
              </p>
            );
          })}
        </div>
        {status === "authenticated" && (
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
                    onClick={() => signOut()}
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
        )}
      </div>
    </div>
  );
};
