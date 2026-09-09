import { Outlet } from "react-router";

function App() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white">
      {/* Background layer div z-0 */}
      <div className="absolute inset-0 z-0 bg-[#FFFFFF] opacity-100" />

      <div className="relative z-10 flex flex-col w-full min-h-[100dvh] justify-start items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
