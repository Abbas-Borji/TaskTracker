import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchResult {
  id: number;
  name: string;
  link: string;
}

interface SearchProps {
  searchResults: SearchResult[];
}

const Search = ({ searchResults }: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // useMemo is used to optimize performance by memoizing the filtered results
  const filteredResults = useMemo(() => {
    if (!searchTerm) return []; // Don't return any results if the search term is empty

    return searchResults.filter((result) =>
      result.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, searchResults]);

  // Function to reset search
  const resetSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative flex flex-1">
      <MagnifyingGlassIcon
        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        id="search-field"
        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0"
        placeholder="Search..."
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <div className="absolute z-10 mt-16 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredResults.map((result) => (
            <Link key={result.id} href={result.link}>
              <button
                className=" block w-full overflow-hidden overflow-ellipsis px-6 py-4 text-left text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={resetSearch}
              >
                {result.name}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
