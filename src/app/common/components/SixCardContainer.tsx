import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface SixCardContainerProps {
  title: string;
  items: any[];
  renderItem: (item: any, index: number) => JSX.Element;
  onViewBack?: () => void;
  actionButton?: JSX.Element;
}

const SixCardContainer = ({
  title,
  items,
  renderItem,
  onViewBack,
  actionButton,
}: SixCardContainerProps) => {
  // Interlace items for mobile view
  const interlacedItems = [];
  const maxLength = Math.max(
    items.filter((_, index) => index % 2 === 0).length,
    items.filter((_, index) => index % 2 !== 0).length,
  );

  for (let i = 0; i < maxLength; i++) {
    if (i < items.length) {
      interlacedItems.push(items[i * 2]); // Even index items
    }
    if (i * 2 + 1 < items.length) {
      interlacedItems.push(items[i * 2 + 1]); // Odd index items
    }
  }

  return (
    <div className="w-full rounded-lg border border-gray-300 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium mr-5">{title}</h3>
          {actionButton}
        </div>
        {onViewBack && (
          <button
            onClick={onViewBack}
            className="flex items-center rounded bg-dark px-1 py-1 text-xs text-white hover:bg-orange-700"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="scrollbar-hide flex max-h-[80vh] flex-wrap overflow-y-auto p-2 lg:max-h-[400px] lg:p-0">
        {interlacedItems.map((item, index) => (
          <div
            key={index}
            className="mb-2 w-full lg:mb-0 lg:mr-4 lg:w-[calc(50%-1rem)]"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SixCardContainer;
