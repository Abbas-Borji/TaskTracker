"use client";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import capitalizeFirstLetter from "@/app/common/functions/CapitalizeFirstLetter";
import DynamicTable from "./DynamicTable";
import AdminDashboardData from "@/app/common/types/AdminDashboardData";

const Dashboard = ({ columns, data, actionButton }: AdminDashboardData) => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const lastSegment: string = capitalizeFirstLetter(
    segments[segments.length - 1],
  );
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="mb-6 flex items-center">
            <h1 className="mr-4 text-base font-semibold leading-6 text-gray-900">
              {lastSegment}
            </h1>
            {/* Refresh button */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center rounded-lg bg-slate-600 p-1.5 text-white hover:bg-dark"
            >
              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Refresh</span>
            </button>
            {actionButton}
          </div>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
      </div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default Dashboard;
