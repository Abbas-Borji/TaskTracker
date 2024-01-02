import Container from "./Container";

const FeedbackSkeleton = () => {
  return (
    <Container title="Feedback">
      <div className="w-full space-y-6 md:px-20 lg:px-40">
        {" "}
        {/* Ensure full width */}
        <div className="flex flex-col sm:flex-row">
          {/* Skeleton for Profile Picture */}
          <div className="order-1 flex w-fit items-center sm:flex-col sm:items-start">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-300 sm:h-20 sm:w-20"></div>

            <div className="ml-4 sm:ml-0 sm:mt-4">
              {/* Skeleton for Manager's Name */}
              <div className="h-4 w-32 animate-pulse bg-gray-300"></div>
              <div className="mt-2 flex items-center sm:mt-2">
                {/* Skeleton for Feedback Date */}
                <div className="h-3 w-48 animate-pulse bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Skeleton for Feedback Content */}
          <div className="order-2 mt-6 w-full sm:ml-2 sm:mt-0">
            {" "}
            {/* Ensure full width */}
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full animate-pulse bg-gray-300"></div>
              <div className="h-4 w-full animate-pulse bg-gray-300"></div>
              <div className="h-4 w-full animate-pulse bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FeedbackSkeleton;
