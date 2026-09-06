import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { groupBy, orderBy } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router";

function EmployeeList() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<sortValues>("lastname");

  type sortValues = "lastname" | "firstname" | "country";

  const sortConfigs: Record<
    sortValues,
    { path: string[]; dir: ("asc" | "desc")[] }
  > = {
    lastname: { path: ["name.last", "name.first"], dir: ["asc", "asc"] },
    firstname: { path: ["name.first", "name.last"], dir: ["asc", "asc"] },
    country: { path: ["location.country"], dir: ["asc"] },
  };

  // const queryClient = useQueryClient();
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
    <div className="relative z-10 flex flex-col w-full md:w-200 justify-center items-center p-2 gap-2">
      <form className="flex flex-col gap-1 justify-start items-center w-full text-black">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full h-8 bg-white rounded-md border border-black p-1"
        ></input>
        <div className="flex w-full justify-center items-center gap-1">
          <label htmlFor="sort" className="whitespace-nowrap shrink-0">
            Sort by:
          </label>
          <select
            onChange={(e) => setSortBy(e.target.value as sortValues)}
            name="sort"
            value={sortBy}
            className="flex w-full h-8 bg-white rounded-md border border p-1"
          >
            <option value="lastname">Last name</option>
            <option value="firstname">First name</option>
            <option value="country">Country</option>
          </select>
        </div>
      </form>
      <div className="flex flex-col w-full gap-2">
        {Object.entries(groupedEmployees).map(([letter, employeesGroup]) => (
          <div key={letter} className="flex flex-col gap-2">
            <div className="flex text-black font-bold text-xl">{letter}</div>
            {employeesGroup.map((employee) => (
              <button
                key={employee.login.uuid}
                onClick={() => navigate(`employee/${employee.login.uuid}`)}
                className="flex rounded-md p-2 gap-2 border text-black cursor-pointer"
              >
                <img
                  className="rounded-md border border-white/70"
                  src={employee.picture.medium}
                />
                <div className="flex flex-col items-start">
                  <div className="font-bold">{`${employee.name.first} ${employee.name.last}`}</div>
                  <div>{employee.email}</div>
                  <div>{employee.cell}</div>
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

// useEffect(() => {
//   async function getEmployees() {
//     const response = await fetch(
//       "https://randomuser.me/api/?results=1000&seed=fantasticemployees",
//     );
//     const data = await response.json();
//     setEmployees(data.results);
//   }

//   getEmployees();
// }, []);
