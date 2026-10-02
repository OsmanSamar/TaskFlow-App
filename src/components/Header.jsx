import "./header.css";
import { IoIosNotifications } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Header = ({ title }) => {
  const { t } = useTranslation();
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
        <button className="header-avatar">
        
          {user?.profile_image_url ?(
                  <img
                  src={user.profile_image_url}
                  alt={user.name}
                  className="header-avatar__image"
                  />
                 ):(
                  user?.name?.charAt(0).toUpperCase()
                 
                 )}
        </button>

        <span className="header-user__name">{t("header.welcome")}, {user?.name} </span>
      </div>
    </header>
  );
};

export default Header;
