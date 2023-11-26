const ChecklistSkeletons = () => {
  return (
    <>
      <div className="p-2">
        <h1 className="mb-10 text-4xl font-medium">| Team ...</h1>
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-5 text-xl font-medium">Pending Checklists</h3>
            <div
              role="status"
              className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
            <h3 className="mb-5 text-xl font-medium">Submitted Checklists</h3>
            <div
              role="status"
              className="w-full animate-pulse space-y-4 divide-y divide-gray-200 rounded border border-gray-200 p-4 shadow dark:divide-gray-700 dark:border-gray-700 md:p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div>
                  <div className="mb-2.5 h-2.5 w-24 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-2 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChecklistSkeletons;
