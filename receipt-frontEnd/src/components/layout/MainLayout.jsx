import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import "./style.css";

function MainLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-area">
        <div className="content">
          <Outlet />
        </div>
      </div>

    </div>
  );
}

export default MainLayout;