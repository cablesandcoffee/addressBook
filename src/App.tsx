import { Outlet } from "react-router";

function App() {
  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 z-0 bg-[#FFFFFF] opacity-100"
        // style={{
        //   background: "linear-gradient(to right, #cececf, #b2b2b4)",
        // }}
      />

      <div className="relative z-10 flex flex-col w-full min-h-[100dvh] justify-start items-center">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
// background: linear-gradient(to right, #ddefbb, ##7a2828);
