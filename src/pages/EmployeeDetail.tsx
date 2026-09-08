import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { LuX } from "react-icons/lu";
import { useLocation, useNavigate, useParams } from "react-router";

function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  function handleClose() {
    const isDirectVisit = location.key === "default";

    if (isDirectVisit) {
      (navigate("/"), { replace: true });
    } else navigate(-1);
  }

  // const queryClient = useQueryClient();
  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
    select: (employees) =>
      employees.find((employee) => employee.login.uuid === id),
  });

  if (isLoading) return;
  if (isError) {
    return <div>{error.message}</div>;
  }
  if (!employee) return;

  return (
    <div className="relative z-10 flex flex-col w-full flex-1 md:w-200 justify-start items-center p-2 gap-2 bg-white rounded-md">
      <div className="relative flex flex-col w-full flex-1 justify-start items-center rounded-md shadow-sm p-2 gap-4">
        <img
          className="w-32 h-32 rounded-full border border-white/70 object-cover"
          src={employee.picture.large}
        />
        <LuX
          size={25}
          className="absolute top-2 right-2 cursor-pointer text-black"
          onClick={() => handleClose()}
        />
        <div className="text-black text-3xl font-bold">{`${employee.name.first} ${employee.name.last}`}</div>
        <div className="relative flex w-full rounded-md gap-2 text-black">
          <div className="flex flex-col items-start">
            <div>{`Email: ${employee.email}`}</div>
            <div>{`Mobile: ${employee.cell}`}</div>
            <div>{`Phone: ${employee.phone}`}</div>
            <span className="mt-5 font-bold">Address:</span>
            <div>{`${employee.location.street.name} ${employee.location.street.number}`}</div>
            <div>{employee.location.city}</div>
            <div>{employee.location.country}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
