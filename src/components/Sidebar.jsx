
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
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";

const Sidebar = () => {
  const { setUser } = useContext(AuthContext);
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

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
            <span>{t("sidebar.dashboard")}</span>
          </NavLink>

          <NavLink className="dashboard-nav__link" to="/tasks">
            <FaTasks />
            <span>{t("sidebar.tasks")}</span>
          </NavLink>

          <NavLink className="dashboard-nav__link" to="/profile">
            <FaUser />
            <span>{t("sidebar.profile")}</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <NavLink className="dashboard-nav__link" to="/settings">
            <FaCog />
            <span>{t("sidebar.settings")}</span>
          </NavLink>

          <Button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>{t("sidebar.logout")}</span>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
