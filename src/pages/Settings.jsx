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

         {/* Preferences */}
         <section id="notifications" className="profile-card">
                  <h3 className="profile-card__title">Preferences</h3>

                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label">Dark mode</p>
                      <p className="profile-setting__hint">Use dark theme across the app</p>
                    </div>
                    <label className="profile-switch">
                      <input type="checkbox" readOnly />
                      <span className="profile-switch__slider" />
                    </label>
                  </div>

                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label">Language</p>
                      <p className="profile-setting__hint">Choose your preferred language</p>
                    </div>
                    <select className="profile-select" defaultValue="en" disabled>
                      <option value="en">English</option>
                      <option value="nl">Dutch</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </div>

                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label">Email notifications</p>
                      <p className="profile-setting__hint">Updates about your account</p>
                    </div>
                    <label className="profile-switch">
                      <input type="checkbox" defaultChecked readOnly />
                      <span className="profile-switch__slider" />
                    </label>
                  </div>

                  <div className="profile-setting">
                    <div>
                      <p className="profile-setting__label">Push notifications</p>
                      <p className="profile-setting__hint">Alerts on this device</p>
                    </div>
                    <label className="profile-switch">
                      <input type="checkbox" defaultChecked readOnly />
                      <span className="profile-switch__slider" />
                    </label>
                  </div>
                </section>
      </main>
    </div>
  </div>
  )
}

export default Settings