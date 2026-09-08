import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { groupBy, orderBy } from "lodash";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { LuArrowUpDown, LuSearch, LuX } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router";

function EmployeeList() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const sortBy: string = searchParams.get("sort") || "lastname";

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSearchParams(
      (prev) => {
        if (value) {
          prev.set("search", value);
        } else {
          prev.delete("search");
        }
        return prev;
      },
      { replace: true },
    );
  }

  function handleSortChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setSearchParams(
      (prev) => {
        if (value) {
          prev.set("sort", value);
        } else {
          prev.delete("sort");
        }
        return prev;
      },
      { replace: true },
    );
    setIsSortOpen(false);
  }

  // removed to move forward and not loosing time. implement later.
  // type sortValues = "lastname" | "firstname" | "country";

  const sortConfigs: Record<
    string,
    { path: string[]; dir: ("asc" | "desc")[] }
  > = {
    lastname: { path: ["name.last", "name.first"], dir: ["asc", "asc"] },
    firstname: { path: ["name.first", "name.last"], dir: ["asc", "asc"] },
    country: { path: ["location.country"], dir: ["asc"] },
  };

  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  let filteredEmployees = employees;
  if (searchQuery && employees) {
    filteredEmployees = employees.filter(
      (employee) =>
        employee.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.name.last.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  const currentSort = sortConfigs[sortBy];

  const sortedEmployees = orderBy(
    filteredEmployees,
    currentSort.path,
    currentSort.dir,
  );

  const groupedEmployees = groupBy(sortedEmployees, (emp) => {
    if (sortBy === "lastname") return emp.name.last[0].toUpperCase();
    if (sortBy === "firstname") return emp.name.first[0].toUpperCase();
    if (sortBy === "country") return emp.location.country.toUpperCase();
  });

  if (isLoading) return;
  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="relative z-10 flex flex-col w-full flex-1 md:w-200 justify-start items-center p-2 pt-16m gap-2 bg-[#FFFFFF] rounded-md">
      <div className="fixed z-20 top-0 left-0 right-0 h-16 bg-[#CCEBC2] backdrop-blur-md border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-gray-800 text-lg">Employee searcher</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsSearchOpen(false);
            }}
            className="text-black cursor-pointer"
          >
            <LuArrowUpDown size={25} />
          </button>
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsSortOpen(false);
            }}
            className={`cursor-pointer ${searchParams.get("search") && !isSearchOpen ? "text-[#D06039]" : "text-black"}`}
          >
            <LuSearch size={25} />
          </button>
        </div>
      </div>
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
                onChange={(e) => handleInputChange(e)}
                placeholder="Search..."
                className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:border-[#CCEBC2] focus:ring-2 focus:ring-[#CCEBC2]/30 transition-all [&::-webkit-search-cancel-button]:appearance-none"
              />
              {searchQuery && (
                <button
                  onClick={() =>
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.delete("search");
                      return next;
                    })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D06039] hover:text-[#D06039] p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <LuX size={20} />
                </button>
              )}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
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
                <label className="flex gap-1">
                  <input
                    type="radio"
                    value="lastname"
                    name="sortBy"
                    checked={sortBy === "lastname"}
                    onChange={(e) => handleSortChange(e)}
                    className="accent-[#D06039]"
                  />
                  Last name
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    value="firstname"
                    name="sortBy"
                    checked={sortBy === "firstname"}
                    onChange={(e) => handleSortChange(e)}
                    className="accent-[#D06039]"
                  />
                  First name
                </label>
                <label className="flex gap-1">
                  <input
                    type="radio"
                    value="country"
                    name="sortBy"
                    checked={sortBy === "country"}
                    onChange={(e) => handleSortChange(e)}
                    className="accent-[#D06039]"
                  />
                  Country
                </label>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
      <div className="flex flex-col w-full gap-2 pt-16">
        {Object.entries(groupedEmployees).map(([letter, employeesGroup]) => (
          <div key={letter} className="flex flex-col gap-2">
            <div className="flex self-start px-10 justify-center font-bold text-lg text-[#D06039] border-l border-r border-t border-[#D06039]/40 rounded-t-xl">
              {letter}
            </div>
            {employeesGroup.map((employee) => (
              <button
                key={employee.login.uuid}
                onClick={() => navigate(`employee/${employee.login.uuid}`)}
                className="group flex items-center gap-3 p-3 w-full bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-300 hover:shadow-md active:bg-[#CCEBC2]/20 active:scale-[0.99] transition-all text-left cursor-pointer"
              >
                {/* Profile picture */}
                <div className="relative shrink-0">
                  <img
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-[#CCEBC2] transition-all"
                    src={employee.picture.medium}
                    alt={`${employee.name.first} ${employee.name.last}`}
                  />
                </div>

                {/* Employee details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate group-hover:text-[#D06039] transition-colors">
                    {`${employee.name.first} ${employee.name.last}`}
                  </div>

                  <div className="text-xs md:text-sm text-gray-400 truncate mt-0.5">
                    {employee.email}
                  </div>

                  <div className="text-xs md:text-sm text-gray-400 truncate mt-0.5">
                    {employee.cell}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployeeList;
