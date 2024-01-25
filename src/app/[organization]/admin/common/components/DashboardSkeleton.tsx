const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse select-none px-4 text-transparent sm:px-6 lg:px-8">
      <div className="-mx-4 -my-2 sm:mx-0 sm:my-0 sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="mb-6 flex flex-col items-start justify-between sm:flex-row">
            <div className="flex items-center">
              <div className="mr-4 rounded bg-gray-300 text-4xl">
                Title Section
              </div>
              {/* Placeholder for refresh button */}
              <div className="h-8 w-8 rounded-lg bg-gray-300"></div>
            </div>
            {/* Placeholder for action button */}
            <div className="mt-6 h-8 rounded bg-gray-300 sm:mt-0">
              Action Button
            </div>
          </div>
          {/* Placeholder for description */}
          <div className="mt-2 h-4 w-fit rounded bg-gray-300">
            This statement describes the data presented in the dashboard table
            below.
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full">
                {/* Placeholder for table header */}
                <thead className="bg-gray-200">
                  <tr>
                    {[...Array(5)].map((_, index) => (
                      <th key={index} className="py-3.5 pl-4 pr-3 sm:pl-6">
                        <div className="h-4 w-3/4 rounded"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                {/* Placeholder for table rows */}
                <tbody className="bg-white">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="divide-y divide-gray-200">
                      {[...Array(5)].map((_, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="whitespace-nowrap border-t border-gray-200 py-4 pl-4 pr-3 sm:pl-6"
                        >
                          <div className="h-4 w-3/4 rounded bg-gray-300"></div>
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
    </div>
  );
};

export default DashboardSkeleton;
