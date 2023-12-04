import React from "react";

interface ThreeCardContainerProps {
  title: string;
  items: any[];
  renderItem: (item: any) => JSX.Element; // This is the render prop
}

const ThreeCardContainer = ({
  title,
  items,
  renderItem,
}: ThreeCardContainerProps) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="mb-5 text-xl font-medium">{title}</h3>
      <div>
        {items.slice(0, 3).map((item) => renderItem(item))}
        <div className="mt-4 text-center">
          <a
            href="/path-to-all-assigned-checklists"
            className="text-blue-600 hover:text-blue-800"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThreeCardContainer;
