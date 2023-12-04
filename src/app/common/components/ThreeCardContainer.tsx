import React from "react";

interface ThreeCardContainerProps {
  title: string;
  items: any[];
  renderItem: (item: any) => JSX.Element; // This is the render prop
  onViewAll?: () => void;
}

const ThreeCardContainer = ({
  title,
  items,
  renderItem,
  onViewAll,
}: ThreeCardContainerProps) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="mb-5 text-xl font-medium">{title}</h3>
      <div>
        {items.slice(0, 3).map((item) => renderItem(item))}
        <div className="mt-4 text-center">
          <button
            onClick={onViewAll} // Attach the onViewAll function to onClick event
            className="text-blue-600 hover:text-blue-800"
          >
            View all
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThreeCardContainer;
