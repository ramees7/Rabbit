import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isopen, setIsOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsOpen(!isopen);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm)
    setIsOpen(false);
  };
  return (
    <div
      className={`flex items-center justify-center w-full ${
        isopen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      } transition-all duration-300`}
    >
      {isopen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex justify-center items-center w-full"
        >
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
              type="submit"
            >
              <HiMagnifyingGlass className="h-6 w-6 " />
            </button>
          </div>
          <button
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            type="button"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
