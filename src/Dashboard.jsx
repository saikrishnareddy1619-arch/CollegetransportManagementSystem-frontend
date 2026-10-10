import { Link } from "react-router-dom";
import { useState } from "react";

import logo from "./assets/college-transport-logo.png";
import busImage from "./assets/college-bus.png";

function Dashboard() {
  const [username] = useState(
    localStorage.getItem("username") || "Admin"
  );

  const [role] = useState(
    localStorage.getItem("role") || "Admin"
  );

  const isAdmin = role === "Admin";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    window.location.href = "/login";
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

          <Link to="/dashboard" className="menu-link">
            🏠 Dashboard
          </Link>

          <Link to="/booking" className="menu-link">
            🚌 Bookings
          </Link>

          {isAdmin && (
            <>
              <Link to="/students" className="menu-link">
                👨‍🎓 Students
              </Link>

              <Link to="/buses" className="menu-link">
                🚌 Buses
              </Link>

              <Link to="/drivers" className="menu-link">
                👨‍✈️ Drivers
              </Link>

              <Link to="/routes" className="menu-link">
                🛣️ Routes
              </Link>

              <Link to="/stops" className="menu-link">
                📍 Stops
              </Link>
            </>
          )}

          <Link to="/passes" className="menu-link">
            🎫 Transport Pass
          </Link>

          <Link to="/complaints" className="menu-link">
            ⚠️ Complaints
          </Link>

          <Link to="/online-payment" className="menu-link">
            💳 Online Payment
          </Link>

        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              College Transport Management System
            </p>
          </div>

          <div className="admin-name">
            👤 {username}
            <br />
            <small>{role}</small>
          </div>

        </header>

        {/* BANNER */}
        <section className="bus-banner">

          <div className="bus-banner-text">

            <h2>
              Welcome, {username}! 👋
            </h2>

            <p>
              Safe • Comfortable • On Time
            </p>

            <span>
              {isAdmin
                ? "Manage the complete college transportation system"
                : "Your college transportation dashboard"}
            </span>

          </div>

          <img
            src={busImage}
            alt="College Bus"
            className="bus-image"
          />

        </section>

        {/* ADMIN DASHBOARD */}
        {isAdmin ? (

          <>
            <section className="cards">

              <div className="dashboard-card">
                <h3>👨‍🎓 Total Students</h3>
                <p>1,250</p>
                <span>Registered students</span>
              </div>

              <div className="dashboard-card">
                <h3>🚌 Total Buses</h3>
                <p>25</p>
                <span>Transport buses</span>
              </div>

              <div className="dashboard-card">
                <h3>👨‍✈️ Total Drivers</h3>
                <p>30</p>
                <span>Registered drivers</span>
              </div>

              <div className="dashboard-card">
                <h3>🛣️ Total Routes</h3>
                <p>18</p>
                <span>Active routes</span>
              </div>

              <div className="dashboard-card">
                <h3>💰 Total Payments</h3>
                <p>₹14,500</p>
                <span>Recent transport fees</span>
              </div>

              <div className="dashboard-card">
                <h3>⚠️ Pending Complaints</h3>
                <p>1</p>
                <span>Complaints waiting for action</span>
              </div>

            </section>

            <section className="welcome-box">

              <h2>Admin Quick Actions</h2>

              <p>
                Manage the complete college transport system.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >

                <Link
                  to="/students"
                  className="add-button"
                >
                  👨‍🎓 Manage Students
                </Link>

                <Link
                  to="/buses"
                  className="add-button"
                >
                  🚌 Manage Buses
                </Link>

                <Link
                  to="/drivers"
                  className="add-button"
                >
                  👨‍✈️ Manage Drivers
                </Link>

                <Link
                  to="/routes"
                  className="add-button"
                >
                  🛣️ Manage Routes
                </Link>

                <Link
                  to="/booking"
                  className="add-button"
                >
                  🚌 Manage Bookings
                </Link>

              </div>

            </section>
          </>

        ) : (

          /* STUDENT DASHBOARD */
          <>

            <section className="cards">

              <div className="dashboard-card">
                <h3>🚌 My Booking</h3>
                <p>BK001</p>
                <span>Confirmed</span>
              </div>

              <div className="dashboard-card">
                <h3>🛣️ My Route</h3>
                <p>Route1</p>
                <span>College → Madhapur</span>
              </div>

              <div className="dashboard-card">
                <h3>🎫 Transport Pass</h3>
                <p>Active</p>
                <span>Valid until 31-05-2027</span>
              </div>

              <div className="dashboard-card">
                <h3>💳 Payment</h3>
                <p>Paid</p>
                <span>Latest transport fee</span>
              </div>

              <div className="dashboard-card">
                <h3>📍 Pickup Point</h3>
                <p>Kukatpally</p>
                <span>08:00 AM</span>
              </div>

              <div className="dashboard-card">
                <h3>⚠️ Complaints</h3>
                <p>0</p>
                <span>No pending complaints</span>
              </div>

            </section>

            <section className="welcome-box">

              <h2>
                Student Quick Actions
              </h2>

              <p>
                Access your college transport services.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >

                <Link
                  to="/booking"
                  className="add-button"
                >
                  🚌 My Bookings
                </Link>

                <Link
                  to="/passes"
                  className="add-button"
                >
                  🎫 My Transport Pass
                </Link>

                <Link
                  to="/online-payment"
                  className="add-button"
                >
                  💳 Payment
                </Link>

                <Link
                  to="/complaints"
                  className="add-button"
                >
                  ⚠️ My Complaints
                </Link>

              </div>

            </section>

          </>
        )}

        {/* OVERVIEW */}
        <section className="welcome-box">

          <h2>
            Transport System Overview
          </h2>

          <p>
            The College Transport Management System
            provides safe and convenient transportation
            services for students and helps administrators
            manage students, buses, drivers, routes,
            bookings, passes, complaints and payments.
          </p>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;