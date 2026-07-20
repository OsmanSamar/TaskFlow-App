import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Settings = () => {
  return (
    <div className="dashboard-page">
    <Sidebar />

    <div className="dashboard-main">
      <Header title="Settings" />
      <main className="dashboard-content">
        <h1>Settings Overview</h1>
      </main>
    </div>
  </div>
  )
}

export default Settings