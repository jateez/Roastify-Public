import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <Navbar />
      <div className="drawer-content flex flex-col mt-16">
        <Outlet />
      </div>
      <Sidebar />
    </div>
  );
}
