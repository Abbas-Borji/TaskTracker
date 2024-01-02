"use client";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { createPopper } from "@popperjs/core";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import classNames from "../functions/ClassNames";

// Define a type for menu item
export interface MenuItem {
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
  const referenceElement = useRef(null);
  const popperElement = useRef(null);
  const [popperStyles, setPopperStyles] = useState({});
  const [popperAttributes, setPopperAttributes] = useState({});

  useEffect(() => {
    if (referenceElement.current && popperElement.current) {
      const popperInstance = createPopper(
        referenceElement.current,
        popperElement.current,
        {
          // Popper options...
          onFirstUpdate: (state) => {
            setPopperStyles({ popper: state.styles?.popper });
            setPopperAttributes({ popper: state.attributes?.popper });
          },
        },
      );

      // Cleanup
      return () => {
        if (popperInstance) {
          popperInstance.destroy();
        }
      };
    }
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={classNames(
            "flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2",
            buttonClass ||
              "bg-gray-100 text-gray-400 hover:text-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-100",
          )}
          ref={referenceElement}
        >
          <span className="sr-only">Open options</span>
          <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      {ReactDOM.createPortal(
        <div ref={popperElement} style={popperStyles} {...popperAttributes}>
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
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm",
                          )}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          onClick={item.onClick}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
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
        </div>,
        document.body,
      )}
    </Menu>
  );
}
