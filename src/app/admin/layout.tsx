"use client";
import React from "react";
import { useState } from "react";
import {
  UserIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  DocumentArrowDownIcon,
  DocumentCheckIcon,
  ChatBubbleLeftIcon,
  Bars3Icon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../common/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import capitalizeFirstLetter from "../common/functions/CapitalizeFirstLetter";

const tabs = [
  {
    name: "Users",
    href: "/admin/users",
    icon: UserIcon,
    current: false,
  },
  {
    name: "Teams",
    href: "/admin/teams",
    icon: UserGroupIcon,
    current: false,
  },
  {
    name: "Checklists",
    href: "/admin/checklists",
    icon: ClipboardDocumentListIcon,
    current: false,
  },
  {
    name: "Assignments",
    href: "/admin/assignments",
    icon: DocumentArrowDownIcon,
    current: false,
  },
  {
    name: "Submissions",
    href: "/admin/submissions",
    icon: DocumentCheckIcon,
    current: false,
  },
  {
    name: "Feedbacks",
    href: "/admin/feedbacks",
    icon: ChatBubbleLeftIcon,
    current: false,
  },
];

const AdminNavigationLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment: string = capitalizeFirstLetter(segments[segments.length - 1]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div>
        <Sidebar
          tabs={tabs}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

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

              {/* Flex container for items on the left */}
              <div className="flex flex-1 items-center gap-x-4 xl:gap-x-6">
                {/* Display last segment and Refresh button */}
                <div className="flex items-center">
                  <span className="mr-4 text-lg font-semibold">
                    {lastSegment}
                  </span>
                  {/* Refresh button */}
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center rounded-lg bg-slate-600 p-1.5 text-white hover:bg-dark"
                  >
                    <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Logout Button */}
              <Link
                href="/api/auth/signout"
                className="flex w-24 justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                Logout
              </Link>
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

export default AdminNavigationLayout;
