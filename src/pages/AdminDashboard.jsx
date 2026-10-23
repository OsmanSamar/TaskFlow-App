import { useEffect, useState } from "react";
import "./admin-dashboard.css";

// Admin dashboard: Displays the users returned by the protected backend endpoint.
export default function AdminDashboard() {
  // Store the users returned by the server.
  const [users, setUsers] = useState([]);

  // Track whether the users are still loading.
  const [loading, setLoading] = useState(true);

  // Store an error message if the request fails.
  const [error, setError] = useState("");

  // Fetch the user list when the dashboard first loads.
  useEffect(() => {
    async function fetchUsers() {
      try {
        // Include the login session cookie with the request.
        const response = await fetch(
          "http://localhost:3000/api/users/admin/users",
          { credentials: "include" }
        );

        // Handle authentication and server errors.
        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please log in first."
              : response.status === 403
                ? "Admin access required."
                : "Failed to load users."
          );
        }

        // Read the users returned by the API.
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        // Display a useful message if the request fails.
        setError(err.message || "Something went wrong.");
      } finally {
        // Stop showing the loading message.
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  // Display the loading state while the request is running.
  if (loading) {
    return <p>Loading users...</p>;
  }

  // Display an error if the request was unsuccessful.
  if (error) {
    return <p role="alert">{error}</p>;
  }

 
   // Render the admin dashboard using the matching CSS class names.
  return (
    <main className="admindashboard-page">
      <div className="admindashboard-content">
        {/* Display the dashboard title. */}
        <header className="admindashboard-header">
          <h1 className="admindashboard-title">
            Admin Dashboard
          </h1>
        </header>

        {/* Show the total number of registered users. */}
        <section className="admindashboard-summary">
          <article className="admindashboard-summary-card">
            <h2 className="admindashboard-summary-title">
              Total Users
            </h2>
            <p className="admindashboard-summary-count">
              {users.length}
            </p>
          </article>
        </section>

        {/* Display the users table and its search field. */}
        <section className="admindashboard-users">
          <div className="admindashboard-users-search">
            <input
              type="search"
              className="admindashboard-users-search-input"
              placeholder="Search users..."
              aria-label="Search users"
            />
          </div>

          {/* Allow horizontal scrolling when the table is wider than the screen. */}
          <div className="admindashboard-users-table">
            <table className="w-full">
              <thead className="admindashboard-users-table-header">
                <tr>
                  <th className="admindashboard-users-table-cell">Name</th>
                  <th className="admindashboard-users-table-cell">Email</th>
                  <th className="admindashboard-users-table-cell">Role</th>
                  <th className="admindashboard-users-table-cell">
                    Account Status
                  </th>
                  <th className="admindashboard-users-table-cell">
                    Email Verified
                  </th>
                  <th className="admindashboard-users-table-cell">
                    Created At
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="admindashboard-users-table-row"
                  >
                    <td className="admindashboard-users-table-cell">
                      {user.name}
                    </td>
                    <td className="admindashboard-users-table-cell">
                      {user.email}
                    </td>
                    <td className="admindashboard-users-table-cell">
                      {user.role}
                    </td>
                    <td className="admindashboard-users-table-cell">
                      {user.account_status}
                    </td>
                    <td className="admindashboard-users-table-cell">
                      {user.email_verified ? "Yes" : "No"}
                    </td>
                    <td className="admindashboard-users-table-cell">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}