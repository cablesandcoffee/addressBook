import { AnimatePresence, motion } from "motion/react";
import { LuX } from "react-icons/lu";

interface SearchDropDownProps {
  isSearchOpen: boolean;
  setIsSearchOpen(value: boolean): void;
  searchQuery: string;
  onSearchParamChange(param: string, value: string): void;
}

function SearchDropDown({
  isSearchOpen,
  searchQuery,
  onSearchParamChange,
  setIsSearchOpen,
}: SearchDropDownProps) {
  return (
    <AnimatePresence initial={false}>
      {isSearchOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchOpen(false)}
            onWheel={() => setIsSearchOpen(false)}
            onTouchMove={() => setIsSearchOpen(false)}
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-[1px]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-10 flex items-center p-2 top-16 left-0 h-16 w-full text-black bg-white border-b border-gray-200"
            key="search"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchParamChange("search", e.target.value)}
              placeholder="Search..."
              className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#CCEBC2] focus:ring-2 focus:ring-[#CCEBC2]/30 transition-all [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchParamChange("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D06039] hover:text-[#D06039] p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <LuX size={20} />
              </button>
            )}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default SearchDropDown;
