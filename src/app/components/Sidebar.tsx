"use client";
import React, { ReactNode } from "react";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "src/assets/logo.png";
import { Team, Tab } from "../types/Sidebar";
import Divider from "./Divider";

interface SidebarProps {
  teams?: Team[];
  tabs?: Tab[];
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Multiple Classes
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ teams, tabs, sidebarOpen, setSidebarOpen }: SidebarProps) => {
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
                  <div className="bg-dark flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
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
                        {tabs && (
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {tabs.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-primary text-light"
                                        : "text-light hover:text-dark hover:bg-gray-300",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-light"
                                          : "text-light group-hover:text-dark",
                                        "h-6 w-6 shrink-0",
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        )}
                        {teams && (
                          <li>
                            <div className="text-xs font-semibold leading-6 text-gray-400">
                              Your Teams
                            </div>
                            <ul role="list" className="-mx-2 mt-2 space-y-1">
                              {teams.map((team) => (
                                <li key={team.name}>
                                  <a
                                    href={team.href}
                                    className={classNames(
                                      team.current
                                      ? "bg-primary"
                                      : "hover:bg-gray-300 hover:text-dark",
                                      "text-light group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                                    )}
                                  >
                                    <span
                                      className={classNames(
                                        team.current
                                        ? "bg-primary"
                                        : "group-hover:border-dark group-hover:text-dark",
                                        "border-light text-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium",
                                      )}
                                    >
                                      {team.initial}
                                    </span>
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </a>
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
          <div className="bg-dark flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
            <div className="flex h-16 shrink-0 items-end">
              <img className="h-12 w-auto" src={Logo.src} alt="Your Company" />
            </div>
            <Divider />
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                {tabs && (
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {tabs.map((item) => (
                        <li key={item.name}>
                          <a
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-primary text-light"
                                : "text-light hover:text-dark hover:bg-gray-300",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-light"
                                  : "text-light group-hover:text-dark",
                                "h-6 w-6 shrink-0",
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                )}
                {teams && (
                  <li>
                    <div className="text-xs font-semibold leading-6 text-gray-400">
                      Your Teams
                    </div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <a
                            href={team.href}
                            className={classNames(
                              team.current
                                ? "bg-primary"
                                : "hover:bg-gray-300 hover:text-dark",
                              "text-light group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                            )}
                          >
                            <span
                              className={classNames(
                                team.current
                                  ? "bg-primary"
                                  : "group-hover:border-dark group-hover:text-dark",
                                "border-light text-light flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium",
                              )}
                            >
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </a>
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