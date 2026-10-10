import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "./assets/college-transport-logo.png";

function RoutesPage() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      routeId: "RT001",
      routeName: "Route 1",
      startPoint: "College",
      endPoint: "Madhapur",
      stops: "Kukatpally, JNTU, KPHB",
      bus: "BUS-001",
      status: "Active",
    },
    {
      id: 2,
      routeId: "RT002",
      routeName: "Route 2",
      startPoint: "College",
      endPoint: "Secunderabad",
      stops: "Begumpet, Ameerpet, Paradise",
      bus: "BUS-002",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    routeId: "",
    routeName: "",
    startPoint: "",
    endPoint: "",
    stops: "",
    bus: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoute = {
      id: routes.length + 1,
      ...formData,
    };

    setRoutes([...routes, newRoute]);

    setFormData({
      routeId: "",
      routeName: "",
      startPoint: "",
      endPoint: "",
      stops: "",
      bus: "",
      status: "Active",
    });

    setShowForm(false);
  };

  const deleteRoute = (id) => {
    setRoutes(
      routes.filter((route) => route.id !== id)
    );
  };

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <img
          src={logo}
          alt="College Transport Logo"
          className="sidebar-logo"
        />

        <h2>College Transport</h2>

        <nav>

          <Link to="/" className="menu-link">
            Dashboard
          </Link>

          <Link to="/students" className="menu-link">
            Students
          </Link>

          <Link to="/buses" className="menu-link">
            Buses
          </Link>

          <Link to="/drivers" className="menu-link">
            Drivers
          </Link>

          <Link to="/routes" className="menu-link">
            Routes
          </Link>

          <Link to="/stops" className="menu-link">
            Stops
          </Link>

          <Link to="/passes" className="menu-link">
            Transport Pass
          </Link>

          <Link to="/complaints" className="menu-link">
            Complaints
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Logout
        </button>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* TOP BAR */}

        <header className="topbar">

          <div>

            <h1>Routes</h1>

            <p>
              Manage college transport routes
            </p>

          </div>

          <div className="admin-name">
            Admin
          </div>

        </header>


        {/* PAGE HEADER */}

        <div className="page-header">

          <div>

            <h1>Route Management</h1>

            <p>
              Add, view and manage transport routes
            </p>

          </div>

          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "+ Add Route"}
          </button>

        </div>


        {/* ADD ROUTE FORM */}

        {showForm && (

          <div className="form-card">

            <h2>Add Route</h2>

            <form
              onSubmit={handleSubmit}
              className="student-form"
            >

              <input
                type="text"
                name="routeId"
                placeholder="Route ID"
                value={formData.routeId}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="routeName"
                placeholder="Route Name"
                value={formData.routeName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="startPoint"
                placeholder="Starting Point"
                value={formData.startPoint}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="endPoint"
                placeholder="Ending Point"
                value={formData.endPoint}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="stops"
                placeholder="Stops (comma separated)"
                value={formData.stops}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="bus"
                placeholder="Assigned Bus"
                value={formData.bus}
                onChange={handleChange}
                required
              />

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

              <button
                type="submit"
                className="save-button"
              >
                Save Route
              </button>

            </form>

          </div>

        )}


        {/* ROUTES TABLE */}

        <div className="table-card">

          <table>

            <thead>

              <tr>

                <th>Route ID</th>
                <th>Route Name</th>
                <th>Start Point</th>
                <th>End Point</th>
                <th>Stops</th>
                <th>Bus</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {routes.map((route) => (

                <tr key={route.id}>

                  <td>
                    {route.routeId}
                  </td>

                  <td>
                    {route.routeName}
                  </td>

                  <td>
                    {route.startPoint}
                  </td>

                  <td>
                    {route.endPoint}
                  </td>

                  <td>
                    {route.stops}
                  </td>

                  <td>
                    {route.bus}
                  </td>

                  <td>
                    {route.status}
                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteRoute(route.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default RoutesPage;