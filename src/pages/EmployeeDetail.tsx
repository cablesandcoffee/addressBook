import { getEmployees } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { CgCloseO } from "react-icons/cg";
import { FaRegWindowClose } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
    <div className="relative z-10 flex flex-col w-full md:w-200 justify-center items-center p-2 gap-2">
      <div className="relative flex w-full rounded-md p-2 gap-2 border text-black">
        <CgCloseO
          size={25}
          className="absolute top-2 right-2 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <img
          className="flex w-32 h-32 rounded-md border border-white/70 object-cover"
          src={employee.picture.large}
        />
        <div className="flex flex-col items-start">
          <div className="font-bold">{`${employee.name.first} ${employee.name.last}`}</div>
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
  );
}

export default EmployeeDetail;
