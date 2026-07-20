import { Link } from "react-router-dom";
import "./Sidebar.css"
const Sidebar = () => {
  return (
    <aside className="dashboard-sidebar">
      <h2>Logo/ My App</h2>

      <nav>
        <Link to="/dashboard">Dashboard </Link>
        <Link to="/profile">Profile </Link>
        <Link to="/setting">Setting </Link>
      </nav>

      <button>Logout</button>
    </aside>
  );
};

export default Sidebar;
