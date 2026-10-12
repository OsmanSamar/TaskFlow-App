import "./header.css";
import { IoIosNotifications } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";

const Header = ({ title }) => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Reload notifications periodically so new alerts appear without refreshing the page.
  useEffect(() => {
    // Skip loading notifications when no user is authenticated.
    if (!user) return;
    let isActive = true;

    const loadNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/me/notifications",
          { credentials: "include" },
        );

        if (!response.ok || !isActive) return;

        const data = await response.json();

        if (isActive) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();

    const intervalId = setInterval(loadNotifications, 5000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [user]);

  // Mark a notification as read and remove it from the dropdown.
  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/me/notifications/${notificationId}/read`,
        { method: "PATCH", credentials: "include" },
      );

      if (!response.ok) return;

      setNotifications((current) =>
        current.filter((notification) => notification.id !== notificationId),
      );

      setUnreadCount((count) => Math.max(0, count - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <header className="dashboard-header">
      <h1>{title}</h1>
      <div className="header-user">
        <div className="notification-wrapper">
          <Button
            className="header-icon-btn"
            onClick={() => setIsOpen((open) => !open)}
            aria-label={t("header.notifications", "Notifications")}
          >
            <IoIosNotifications />
            {unreadCount > 0 && (
              <span className="notification-badge"> {unreadCount} </span>
            )}
          </Button>
          {isOpen && (
            <div className="notification-dropdown">
              <h3>{t("header.notifications", "Notifications")}</h3>
              {notifications.length === 0 ? (
                <p>{t("header.noNotifications", "No notifications yet")}</p>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    className={`notification-item ${notification.is_read ? "is-read" : "is-unread"}`}
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>
                      {new Date(notification.created_at).toLocaleString()}
                    </small>{" "}
                  </button>
                ))
              )}{" "}
            </div>
          )}{" "}
        </div>{" "}
        <button className="header-avatar" type="button">
          {user?.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.name}
              className="header-avatar__image"
            />
          ) : (
            user?.name?.charAt(0).toUpperCase()
          )}
        </button>
        <span className="header-user__name">
          {t("header.welcome")}, {user?.name}
        </span>
      </div>
    </header>
  );
};
export default Header;
