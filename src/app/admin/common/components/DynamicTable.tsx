"use client";
import { useState, useMemo } from "react";
import { sort } from "fast-sort";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import AdminDashboardData from "@/app/common/types/AdminDashboardData";

// Define the possible directions for sorting
type SortDirection = "ascending" | "descending";

// Define the configuration for sorting the table
interface SortConfig {
  key: string | null;
  direction: SortDirection;
}

const DynamicTable = ({ columns, data }: AdminDashboardData) => {
  // Find the first sortable column
  const firstSortableColumn = columns.find((column) => column.sortable);

  // Set the initial sort key to the first sortable column's dataKey, or null if none are sortable
  const initialSortKey = firstSortableColumn
    ? firstSortableColumn.dataKey
    : null;

  // Initialize the sort configuration state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: initialSortKey,
    direction: "ascending",
  });

  // Define the function to handle sorting
  const handleSort = (key: string) => {
    let direction: SortDirection = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Compute the sorted data
  const sortedData = useMemo(() => {
    // If no sort key is set, return the original data
    if (!sortConfig.key) return data;

    // Define the sorter function based on the sort direction
    const sorter =
      sortConfig.direction === "ascending"
        ? { asc: (row: any) => row[sortConfig.key as keyof typeof row] }
        : { desc: (row: any) => row[sortConfig.key as keyof typeof row] };

    // Sort the data
    return sort(data).by([sorter]);
  }, [data, sortConfig]);

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.dataKey}
                      scope="col"
                      className={`py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 ${
                        column.sortable ? "cursor-pointer" : ""
                      }`}
                      onClick={() =>
                        column.sortable && handleSort(column.dataKey)
                      }
                    >
                      <div className="flex items-center justify-between">
                        {column.title}
                        {column.sortable && (
                          <ChevronDownIcon
                            className={`ml-2 h-5 w-5 transform ${
                              sortConfig.key === column.dataKey
                                ? sortConfig.direction === "ascending"
                                  ? "rotate-180"
                                  : ""
                                : "opacity-0"
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sortedData.map((item, index) => (
                  <tr key={index}>
                    {columns.map(({ dataKey, render }) => (
                      <td
                        key={dataKey}
                        className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6"
                      >
                        {render ? render(item) : item[dataKey]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
