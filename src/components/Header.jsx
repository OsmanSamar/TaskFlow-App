import "./header.css";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = ({ title }) => {

  const {user} =useContext(AuthContext);
  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <div className="header-user">
        {/* 
        Search 
        */}
        <button className="header-icon-btn">
          <IoIosNotifications />
        </button>
        <button className="header-icon-btn">
          <FaUser />
        </button>

        <span className="header-user__name">Welcome, {user?.name} </span>
      </div>
    </header>
  );
};

export default Header;
