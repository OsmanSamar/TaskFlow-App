import { NavLink } from "react-router-dom";
import "./sidebar.css";

import {
  FaTachometerAlt,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaTasks,
} from "react-icons/fa";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear the authenticated user from React state
      setUser(null);
    } catch (error) {
      console.log("Logout error", error);
    }
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__logo-container">
        <FaTasks />
        <h2 className="dashboard-sidebar__title">TaskFlow</h2>
      </div>

      <div className="dashboard-sidebar__content">
        <nav className="dashboard-nav">
          <NavLink className="dashboard-nav__link" to="/dashboard">
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
          <NavLink className="dashboard-nav__link" to="/tasks">
            <FaTasks />
            <span>Tasks</span>
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
          <button type="button" className="sidebar-logout"
          onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
