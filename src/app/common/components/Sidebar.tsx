"use client";
import React, { ReactNode } from "react";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "src/assets/logo.png";
import { Team, Tab } from "../types/Sidebar";
import Divider from "./Divider";
import Link from "next/link";
import classNames from "../functions/ClassNames";

interface SidebarProps {
  tabs?: Tab[];
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: number;
}

const Sidebar = ({
  tabs,
  sidebarOpen,
  setSidebarOpen,
  userId,
}: SidebarProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab | null>(null); // State for active tab
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null); // State for active team
  const handleTabClick = (tab: Tab) => {
    setCurrentTab(tab);
    setCurrentTeam(null); // Clear active team when a tab is clicked
    setSidebarOpen(false); // Close sidebar on tab click
  };

  const handleTeamClick = (team: Team) => {
    setCurrentTeam(team);
    setCurrentTab(null); // Clear active tab when a team is clicked
    setSidebarOpen(false); // Close sidebar on team click
  };

  useEffect(() => {
    async function fetchTeams() {
      console.log("Fetching teams for user ID:", userId);
      try {
        const response = await fetch(`/api/teams/${userId}`);
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
  }, [userId]); // Dependency array to ensure the effect runs once or when teamId changes

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
                                      currentTab &&
                                        item.name === currentTab.name
                                        ? "bg-primary text-light"
                                        : "text-light hover:bg-gray-300 hover:text-dark",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                    onClick={() => handleTabClick(item)}
                                  >
                                    <item.icon
                                      className={classNames(
                                        currentTab &&
                                          item.name === currentTab.name
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
                        {teams && teams.length > 0 && (
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
                                      currentTeam &&
                                        team.name === currentTeam.name
                                        ? "bg-primary"
                                        : "hover:bg-gray-300 hover:text-dark",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-light",
                                    )}
                                    onClick={() => handleTeamClick(team)}
                                  >
                                    <span
                                      className={classNames(
                                        currentTeam &&
                                          team.name === currentTeam.name
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
                              currentTab && item.name === currentTab.name
                                ? "bg-primary text-light"
                                : "text-light hover:bg-gray-300 hover:text-dark",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                            onClick={() => handleTabClick(item)}
                          >
                            <item.icon
                              className={classNames(
                                currentTab && item.name === currentTab.name
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
                {teams && teams.length > 0 && (
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
                              currentTeam && team.name === currentTeam.name
                                ? "bg-primary"
                                : "hover:bg-gray-300 hover:text-dark",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-light",
                            )}
                            onClick={() => handleTeamClick(team)}
                          >
                            <span
                              className={classNames(
                                currentTeam && team.name === currentTeam.name
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
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
