"use client";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import classNames from "../functions/ClassNames";
import CircularProgress from "@mui/material/CircularProgress";

interface ComboBoxItem {
  id: number | string;
  name: string;
}

interface ComboBoxProps {
  items: ComboBoxItem[];
  label: string;
  placeholder: string;
  onChange: (item: ComboBoxItem) => void;
  value?: ComboBoxItem | null; // Add this line
  disabled?: boolean; // Also ensure to include 'disabled' if not already present
  loading?: boolean;
}

const ComboBox = ({
  items,
  label,
  placeholder,
  onChange,
  value,
  disabled,
  loading = false,
}: ComboBoxProps) => {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<
    ComboBoxItem | null | undefined
  >(null);

  useEffect(() => {
    setSelectedItem(value);
  }, [value]);

  const filteredItems =
    query === ""
      ? items
      : items?.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });

  const handleSelectionChange = (item: any) => {
    setSelectedItem(item);
    if (onChange) {
      onChange(item);
    }
  };

  return (
    <Combobox
      as="div"
      value={selectedItem}
      onChange={handleSelectionChange}
      disabled={disabled}
    >
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </Combobox.Label>
      <div className="relative mb-6 mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(item: ComboBoxItem) => item?.name}
          placeholder={placeholder}
        />
        {loading ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-2">
            <CircularProgress size={24} />
          </div>
        ) : (
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        )}

        {filteredItems?.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-8 pr-4",
                    active ? "bg-indigo-600 text-white" : "text-gray-900",
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected ? "font-semibold" : "",
                      )}
                    >
                      {item.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          active ? "text-white" : "text-indigo-600",
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
};

export default ComboBox;
