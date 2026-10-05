import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./dashboard.css";
import { PiHandWavingBold } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return t("dashboard.goodMorning");
    }

    if (hour < 18) {
      return t("dashboard.goodAfternoon");
    }

    return t("dashboard.goodEvening");
  };

  // Store the authenticated user's real tasks from SQLite.
  const [tasks, setTasks] = useState([]);

  // Load tasks when the dashboard opens.
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/users/me/tasks",
          {
            credentials: "include",
          },
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Failed to load dashboard tasks:", data.message);
          return;
        }

        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to load dashboard tasks:", error);
      }
    };

    loadTasks();
  }, []);

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header title={t("dashboard.title")} />

        <main className="dashboard-content">
          <h1>
            {getGreeting()}, <span>{user?.name}</span> <PiHandWavingBold />
          </h1>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <article className="stat-card">
              <p className="stat-card__label">{t("dashboard.totalTasks")}</p>
              <p className="stat-card__value">{tasks.length}</p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">{t("dashboard.completed")}</p>
              <p className="stat-card__value">
                {tasks.filter((task) => task.done === 1).length}
              </p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">{t("dashboard.pending")}</p>
              <p className="stat-card__value">
                {tasks.filter((task) => task.done === 0).length}
              </p>
            </article>
          </div>

          <section className="recent-tasks">
            <h2 className="recent-tasks__title">
              {t("dashboard.recentTasks")}
            </h2>

            <div className="recent-tasks__list">
              {/* Show the latest 4 tasks from the SQLite-backed task list. */}
              {tasks.slice(0, 4).map((task) => (
                <article key={task.id} className="recent-task">
                  <span
                    className={`recent-task__status${
                      task.done === 1 ? " recent-task__status--done" : ""
                    }`}
                  >
                    {task.done === 1 ? <FaCheck /> : null}
                  </span>

                  <span
                    className={`recent-task__title${
                      task.done === 1 ? " recent-task__title--done" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
