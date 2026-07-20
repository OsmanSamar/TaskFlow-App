import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./dashboard.css";
import { PiHandWavingBold } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
const Dashboard = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    }
    if (hour < 18) {
      return "Good afternoon";
    }
    return "Good evening";
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
        <Header title="Dashboard" />
        <main className="dashboard-content">
          <h1>
            {getGreeting()}, <span>user</span> <PiHandWavingBold />
          </h1>
          {/* Statistics Cards */}
          <div className="stats-grid">
            <article className="stat-card">
              <p className="stat-card__label">Total Tasks</p>
              <p className="stat-card__value">{tasks.length}</p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">Completed</p>
              <p className="stat-card__value">
                {tasks.filter((task) => task.completed).length}
              </p>
            </article>

            <article className="stat-card">
              <p className="stat-card__label">Pending</p>
              <p className="stat-card__value">
                {tasks.filter((task) => !task.completed).length}
              </p>
            </article>
          </div>

          <section className="recent-tasks">
            <h2 className="recent-tasks__title">Recent Tasks</h2>
            <div className="recent-tasks__list">
              {/*TODO
             Replace temporary slice with backend query for the latest 4 tasks
              */}
              {tasks.slice(-4).map((task) => (
                <article key={task.id} className="recent-task">
                  <span
                    className={`recent-task__status${task.completed ? " recent-task__status--done" : ""}`}
                  >
                    {task.completed ? <FaCheck /> : null}
                  </span>
                  <span
                    className={`recent-task__title${task.completed ? " recent-task__title--done" : ""}`}
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
