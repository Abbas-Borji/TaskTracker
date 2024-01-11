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
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../common/components/Sidebar";

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
  {
    name: "Departments",
    href: "/admin/departments",
    icon: BuildingLibraryIcon,
    current: false,
  },
];

const AdminNavigationLayout = ({ children }: { children: React.ReactNode }) => {
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
          <div className="sticky top-0 z-40 xl:mx-auto xl:hidden xl:max-w-7xl xl:px-8">
            <div className="flex h-16 items-center gap-x-4 border-b border-light bg-dark px-4 shadow-sm sm:gap-x-6 sm:px-6 xl:px-0 xl:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 xl:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6 text-light" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div className="h-6 w-px bg-light xl:hidden" aria-hidden="true" />
              <h1 className="text-lg font-bold text-light">Dashboard</h1>
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
