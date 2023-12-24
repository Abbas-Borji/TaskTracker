"use client";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import Logo from "src/assets/logo.png";
import classNames from "../functions/ClassNames";
import { Tab, Team } from "../types/Sidebar";
import Divider from "./Divider";

interface SidebarProps {
  tabs?: Tab[];
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ tabs, sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const session = useSession();
  const userRole = session.data?.user?.role;
  const [teams, setTeams] = useState<Team[]>([]);
  const pathname = usePathname(); // Get current path
  const isActive: (href: string) => boolean = (href: string) =>
    pathname === href;

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchTeams();
  }, [pathname]); // Re-run when the URL changes

  return (
    <>
      <div>
        {/* Mobile Sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-end">
                      <img
                        className="h-12 w-auto"
                        src={Logo.src}
                        alt="Your Company"
                      />
                    </div>
                    <Divider />
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        {tabs && tabs.length > 0 && (
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {tabs.map((item) => (
                                <li key={item.name}>
                                  <Link
                                    href={item.href}
                                    className={classNames(
                                      isActive(item.href)
                                        ? "bg-primary text-light"
                                        : "text-light hover:bg-gray-300 hover:text-dark",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <item.icon
                                      className={classNames(
                                        isActive(item.href)
                                          ? "text-light"
                                          : "text-light group-hover:text-dark",
                                        "h-6 w-6 shrink-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                        {userRole != "ADMIN" && teams && teams.length > 0 && (
                          <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                              Your Teams
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <Link
                                    href={team.href}
                                    className={classNames(
                                      isActive(team.href)
                                        ? "bg-primary"
                                        : "hover:bg-gray-300 hover:text-dark",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-light",
                                    )}
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <span
                                      className={classNames(
                                        isActive(team.href)
                                          ? "bg-primary"
                                          : "group-hover:border-dark group-hover:text-dark",
                                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-light text-[0.625rem] font-medium text-light",
                                      )}
                                    >
                                      {team.id}
                                    </span>
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                        {userRole === "ADMIN" && (
                          <li className="mb-2 mt-auto">
                            {/* Logout Button */}
                            <Link
                              href="/api/auth/signout"
                              className="flex w-full justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-light shadow-sm hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                            >
                              Logout
                            </Link>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Desktop Sidebar */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark px-6 pb-4">
            <div className="flex h-16 shrink-0 items-end">
              <img className="h-12 w-auto" src={Logo.src} alt="Your Company" />
            </div>
            <Divider />
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {tabs && tabs.length > 0 && (
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {tabs.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={item.href}
                            className={classNames(
                              isActive(item.href)
                                ? "bg-primary text-light"
                                : "text-light hover:bg-gray-300 hover:text-dark",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                isActive(item.href)
                                  ? "text-light"
                                  : "text-light group-hover:text-dark",
                                "h-6 w-6 shrink-0",
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {userRole != "ADMIN" && teams && teams.length > 0 && (
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Your Teams
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <Link
                            href={team.href}
                            className={classNames(
                              isActive(team.href)
                                ? "bg-primary"
                                : "hover:bg-gray-300 hover:text-dark",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-light",
                            )}
                          >
                            <span
                              className={classNames(
                                isActive(team.href)
                                  ? "bg-primary"
                                  : "group-hover:border-dark group-hover:text-dark",
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-light text-[0.625rem] font-medium text-light",
                              )}
                            >
                              {team.id}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {userRole === "ADMIN" && (
                  <li className="mb-2 mt-auto">
                    {/* Logout Button */}
                    <Link
                      href="/api/auth/signout"
                      className="flex w-full justify-center rounded-md bg-orange-700 px-3 py-1.5 text-sm font-semibold leading-6 text-light shadow-sm hover:bg-orange-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                    >
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
