"use client";
import Search from "@/app/common/components/Search";
import UserAvatar from "@/app/common/components/UserAvatar";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "@/app/common/components/Sidebar";
import classNames from "@/app/common/functions/ClassNames";

interface SearchResult {
  id: number;
  name: string;
  link: string;
}

const UserNavigationLayout = ({
  params,
  children,
}: {
  params: { organization: string };
  children: React.ReactNode;
}) => {
  const organizationUrlSegment = params?.organization;
  const { data: session } = useSession();
  const userImage = session?.user?.image;
  const userName = session?.user?.name;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userNavigation = [
    {
      name: "Your profile",
      href: `/${organizationUrlSegment}/user/profile/${session?.user?.id}`,
    },
    { name: "Sign out", href: "/api/auth/signout" },
  ];
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/search");
        if (!response.ok) {
          throw new Error(
            "Network response was not ok while getting search results.",
          );
        }
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error(
          "There was a problem with the fetch operation of search results:",
          error,
        );
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="xl:pl-72">
          <div className="sticky top-0 z-40 xl:mx-auto xl:max-w-7xl xl:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 xl:px-0 xl:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 xl:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 xl:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch xl:gap-x-6">
                <Search searchResults={searchResults} />
                <div className="flex items-center gap-x-4 xl:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden xl:block xl:h-6 xl:w-px xl:bg-gray-200"
                    aria-hidden="true"
                  />

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      <UserAvatar userImage={userImage} userName={userName} />
                      <span className="hidden xl:flex xl:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          {session?.user?.name}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                type="button"
                                className={classNames(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900",
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserNavigationLayout;
