
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./dashboard.css";
import { PiHandWavingBold } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { useContext } from "react";
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

  const tasks = [
    { id: 1, title: "Learn TypeScript", completed: false },
    { id: 2, title: "Learn React", completed: true },
    { id: 3, title: "Todo App", completed: true },
    { id: 4, title: "Build dashboard", completed: false },
    { id: 5, title: "Learn Backend", completed: false },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="dashboard-main">
        <Header title={t("dashboard.title")} />

        <main className="dashboard-content">
          <h1>
            {getGreeting()}, <span>{user?.name}</span>{" "}
            <PiHandWavingBold />
          </h1>

          {/* Statistics Cards */}
          <div className="stats-grid">
            <article className="stat-card">
              <p className="stat-card__label">
                {t("dashboard.totalTasks")}
              </p>
              <p className="stat-card__value">{tasks.length}</p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">
                {t("dashboard.completed")}
              </p>
              <p className="stat-card__value">
                {tasks.filter((task) => task.completed).length}
              </p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">
                {t("dashboard.pending")}
              </p>
              <p className="stat-card__value">
                {tasks.filter((task) => !task.completed).length}
              </p>
            </article>
          </div>

          <section className="recent-tasks">
            <h2 className="recent-tasks__title">
              {t("dashboard.recentTasks")}
            </h2>

            <div className="recent-tasks__list">
              {/* TODO:
                  Replace temporary slice with backend query
                  for the latest 4 tasks
              */}
              {tasks.slice(-4).map((task) => (
                <article key={task.id} className="recent-task">
                  <span
                    className={`recent-task__status${
                      task.completed
                        ? " recent-task__status--done"
                        : ""
                    }`}
                  >
                    {task.completed ? <FaCheck /> : null}
                  </span>

                  <span
                    className={`recent-task__title${
                      task.completed
                        ? " recent-task__title--done"
                        : ""
                    }`}
                  >
                    {task.title}
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

