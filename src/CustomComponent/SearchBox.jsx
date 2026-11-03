import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const SearchBox = ({ query, setQuery }) => {
  return (
    <div className="w-full px-3 md:px-0">
      <div className="relative w-full">
        {/* Associate input with label for accessibility */}
        <label htmlFor="search-input" className="sr-only">
          Search Courses
        </label>
        <Input
          id="search-input"
          type="text"
          placeholder="Maths, Biology, Meditation"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 text-black font-medium border-2 border-green-500 rounded-full pl-5 pr-12"
          aria-label="Search courses or topics"
        />

        {/* Search icon as a decorative element */}
        <Search
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-2 w-8 h-8 transition-colors duration-300 
            ${
              query.length > 0
                ? "bg-green-500 text-white"
                : "bg-green-100 opacity-[0.7]"
            }`}
          role="img"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default SearchBox;
