import { Fragment, useRef } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import classNames from "../functions/ClassNames";
import Link from "next/link";

// Replace This Dropdown Menu with Material UI Dropdown Menu

// Define a type for menu item
interface MenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  type: "link" | "button";
}

// Define a type for the component props
interface DropdownMenuProps {
  items: MenuItem[];
  buttonClass?: string;
  menuClass?: string;
}

// Dropdown Menu Component
export default function DropdownMenu({
  items,
  buttonClass,
  menuClass,
}: DropdownMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={classNames(
            "flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2",
            buttonClass ||
              "bg-gray-100 text-gray-400 hover:text-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-100",
          )}
        >
          <span className="sr-only">Open options</span>
          <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={classNames(
            "absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            menuClass || "w-56 bg-white",
          )}
        >
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) =>
                  item.type === "link" && item.href ? (
                    <Link
                      href={item.href}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block px-4 py-2 text-sm",
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className={classNames(
                        active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                        "block w-full px-4 py-2 text-left text-sm",
                      )}
                    >
                      {item.label}
                    </button>
                  )
                }
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
