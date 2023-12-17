import { usePathname } from "next/navigation";
import capitalizeFirstLetter from "@/app/common/functions/CapitalizeFirstLetter";
import DynamicTable from "./DynamicTable";
import AdminDashboardData from "@/app/common/types/AdminDashboardData";
import RefreshButton from "./RefreshButton";

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
            <RefreshButton />
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