import "./header.css";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";

const Header = ({ title }) => {
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

        <span className="header-user__name">Welcome, user </span>
      </div>
    </header>
  );
};

export default Header;
