
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <Sidebar/>

     <div className="dashboard-main">
      <Header/>
     <main className="dashboard-content">
        <h1>Overview</h1>
      </main>
     </div>
    </div>
  )
};

export default Dashboard;
