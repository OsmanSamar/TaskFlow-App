import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Tasks = () => {
  return (
    <div className="dashboard-page settings-page">
    <Sidebar />

    <div className="dashboard-main">
      <Header title="Tasks" />
      </div>
      </div>
  )
}

export default Tasks