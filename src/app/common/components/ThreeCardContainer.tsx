import React from "react";

interface ThreeCardContainerProps {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => JSX.Element; // This is the render prop
  onViewAll?: () => void;
  actionButton?: JSX.Element;
}

const ThreeCardContainer = ({
  title,
  items,
  renderItem,
  onViewAll,
  actionButton,
}: ThreeCardContainerProps) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between">
        <h3 className="mb-5 text-xl font-medium">{title}</h3>
        {actionButton}
      </div>
      {items.length > 0 ? (
        <div>
          {items.slice(0, 3).map((item, index) => renderItem(item, index))}
          {items.length > 3 && (
            <div className="mt-4 text-center">
              <button
                onClick={onViewAll} // Attach the onViewAll function to onClick event
                className="text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-grow items-center justify-center">
          <p>No items found.</p>
        </div>
      )}
    </div>
  );
};

export default ThreeCardContainer;
