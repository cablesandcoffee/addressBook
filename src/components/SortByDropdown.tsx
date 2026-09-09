import { AnimatePresence, motion } from "motion/react";

interface SearchDropDownProps {
  isSortOpen: boolean;
  setIsSortOpen(value: boolean): void;
  onSearchParamChange(param: string, value: string): void;
  sortBy: string;
}

function SearchDropDown({
  isSortOpen,
  onSearchParamChange,
  setIsSortOpen,
  sortBy,
}: SearchDropDownProps) {
  const radioInputs: { value: string; label: string }[] = [
    { value: "lastname", label: "Last name" },
    { value: "firstname", label: "First name" },
    { value: "country", label: "Country" },
  ];

  return (
    <AnimatePresence initial={false}>
      {isSortOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSortOpen(false)}
            onWheel={() => setIsSortOpen(false)}
            onTouchMove={() => setIsSortOpen(false)}
            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-[1px]"
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-10 flex items-center p-2 top-16 left-0 h-16 w-full text-black bg-white border-b border-gray-200 px-4"
            key="sort"
          >
            <div className="flex w-full h-full items-center justify-between md:justify-end gap-2">
              {radioInputs.map((input) => (
                <label className="flex gap-1">
                  <input
                    type="radio"
                    value={input.value}
                    name="sortBy"
                    checked={sortBy === input.value}
                    onChange={(e) =>
                      onSearchParamChange("sort", e.target.value)
                    }
                    className="accent-[#D06039]"
                  />
                  {input.label}
                </label>
              ))}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default SearchDropDown;
