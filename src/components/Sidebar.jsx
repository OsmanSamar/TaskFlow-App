import { NavLink } from "react-router-dom";
import "./sidebar.css";

import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTasks 
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__logo-container">
        <FaTasks  />
        <h2 className="dashboard-sidebar__title">TaskFlow</h2>
      </div>

      <nav className="dashboard-nav">
        <NavLink className="dashboard-nav__link" to="/dashboard">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>
        <NavLink className="dashboard-nav__link" to="/profile">
          <FaUser />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <NavLink className="dashboard-nav__link" to="/settings">
          <FaCog />
          <span>Settings</span>
        </NavLink>
        <button type="button" className="sidebar-logout">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
