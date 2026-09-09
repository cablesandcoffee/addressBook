import { SearchDropDown, SortByDropdown } from "@/components";
import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { groupBy, orderBy } from "lodash";
import { useState } from "react";
import { LuArrowUpDown, LuSearch } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router";

function EmployeeList() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "lastname";

  function handleSearchParamChange(param: string, value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(param, value);
        } else {
          next.delete(param);
        }
        return next;
      },
      { replace: true },
    );
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

  const currentSort = sortConfigs[sortBy];

  const {
    data: employees,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  if (isLoading)
    return (
      <div className="flex w-full flex-1 items-center justify-center text-black">
        Waiting for wonderful employees...
      </div>
    );
  if (isError) {
    return (
      <div className="flex w-full flex-1 items-center justify-center text-black">
        {error.message}
      </div>
    );
  }

  if (!employees) return;

  const query = searchQuery.trim().toLowerCase();

  const filteredEmployees = query
    ? employees.filter((employee) => {
        const fullNameFirstFirst =
          `${employee.name.first} ${employee.name.last}`.toLowerCase();
        const fullNameLastFirst =
          `${employee.name.last} ${employee.name.first}`.toLowerCase();
        return (
          fullNameFirstFirst.includes(query) ||
          fullNameLastFirst.includes(query)
        );
      })
    : employees;

  const sortedEmployees = orderBy(
    filteredEmployees,
    currentSort.path,
    currentSort.dir,
  );

  const groupedEmployees = groupBy(sortedEmployees, (emp) => {
    if (sortBy === "lastname") return emp.name.last[0].toUpperCase() ?? "#";
    if (sortBy === "firstname") return emp.name.first[0].toUpperCase() ?? "#";
    if (sortBy === "country") return emp.location.country.toUpperCase() ?? "#";
  });

  return (
    <div className="relative z-10 flex flex-col w-full flex-1 md:w-200 justify-start items-center gap-2 bg-[#FFFFFF] rounded-md">
      {/* TOP BAR MENU */}
      <div className="fixed z-20 top-0 left-0 right-0 h-16 bg-[#CCEBC2]/70 backdrop-blur-md border-b border-gray-200 px-4 flex items-center justify-between shadow-sm">
        <h1 className="font-bold text-gray-800 text-lg">Employee searcher</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsSearchOpen(false);
            }}
            className="text-black cursor-pointer"
            type="button"
            aria-label="Toggle sorting menu"
          >
            <LuArrowUpDown size={25} />
          </button>
          <button
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              setIsSortOpen(false);
            }}
            className={`cursor-pointer ${searchParams.get("search") && !isSearchOpen ? "text-[#D06039]" : "text-black"}`}
            type="button"
            aria-label="Toggle search window"
          >
            <LuSearch size={25} />
          </button>
        </div>
      </div>
      {/* Search and sort dropdowns that drop down below the top menu bar */}
      <SearchDropDown
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        searchQuery={searchQuery}
        onSearchParamChange={handleSearchParamChange}
      />
      <SortByDropdown
        isSortOpen={isSortOpen}
        setIsSortOpen={setIsSortOpen}
        onSearchParamChange={handleSearchParamChange}
        sortBy={sortBy}
      />
      {/* The good stuff, list of employees */}
      <div className="flex flex-col w-full gap-2 pt-20">
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
