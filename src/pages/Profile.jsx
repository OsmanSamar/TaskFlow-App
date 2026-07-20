import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Profile = () => {
  return (
    <div className="dashboard-page">
      <Sidebar/>

     <div className="dashboard-main">
      <Header title="Profile"/>
     <main className="dashboard-content">
        <h1>Profile Overview</h1>
      </main>
     </div>
    </div>
  )
}

export default Profile