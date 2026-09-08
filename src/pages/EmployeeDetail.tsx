import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { GiRotaryPhone } from "react-icons/gi";
import { HiOfficeBuilding } from "react-icons/hi";
import { LuMail, LuX } from "react-icons/lu";
import { MdOutlineSmartphone } from "react-icons/md";
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
    <div className="flex w-full min-h-[100dvh] flex-1 justify-center items-center bg-white p-10">
      <div className="relative flex flex-col bg-white w-full md:max-w-96 flex-1 items-center rounded-4xl ring-10 ring-[#CCEBC2] px-3 py-7 gap-2">
        <img
          className="w-32 h-32 shrink-0 object-cover rounded-full border ring-4 ring-gray-200"
          src={employee.picture.large}
        />
        <LuX
          size={40}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          onClick={() => handleClose()}
        />
        <div className="flex self-start text-black text-3xl font-bold pt-5">{`${employee.name.first} ${employee.name.last}`}</div>
        <div className="flex w-full rounded-md gap-2 text-black">
          <div className="grid grid-cols-[20px_1fr] items-center gap-1 whitespace-nowrap text-sm">
            <LuMail size={15} />
            <div className="truncate min-w-0 text-gray-600">{`${employee.email}`}</div>
            <MdOutlineSmartphone size={15} />
            <div className="truncate min-w-0 text-gray-600">{`${employee.cell}`}</div>
            <GiRotaryPhone size={15} />
            <div className="truncate min-w-0 text-gray-600">{`${employee.phone}`}</div>
            <HiOfficeBuilding size={15} className="self-start mt-4" />
            <div className="mt-3">
              <div className="truncate min-w-0 text-gray-600">{`${employee.location.street.name} ${employee.location.street.number}`}</div>
              <div className="truncate min-w-0 text-gray-600">
                {employee.location.city}
              </div>
              <div className="truncate min-w-0 text-gray-600">
                {employee.location.country}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
