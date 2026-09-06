import { Outlet } from "react-router";

function App() {
  return (
    <div className="relative flex w-full overflow-hidden bg-white text-white justify-center">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
        // style={{
        //   background: "linear-gradient(to top, #5c7852, #9fa0a8)",
        // }}
      />
      <Outlet />
    </div>
  );
}

export default App;
