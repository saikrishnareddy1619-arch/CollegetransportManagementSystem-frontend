import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() === "") {
      alert("Please enter Username");
      return;
    }

    if (password.trim() === "") {
      alert("Please enter Password");
      return;
    }

    // Temporary frontend login
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);

    alert("Login Successful!");

    // Direct dashboard navigation
    window.location.href = "/dashboard";
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1>College Transport</h1>

        <h2>Management System</h2>

        <p className="login-subtitle">
          Login to continue
        </p>

        <div className="role-buttons">

          <button
            type="button"
            className={
              role === "Student"
                ? "active-role"
                : ""
            }
            onClick={() => setRole("Student")}
          >
            👨‍🎓 Student
          </button>

          <button
            type="button"
            className={
              role === "Admin"
                ? "active-role"
                : ""
            }
            onClick={() => setRole("Admin")}
          >
            👨‍💼 Admin
          </button>

        </div>

        <form onSubmit={handleLogin}>

          <label>
            Username
          </label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>

        </form>

        <p className="selected-role">
          Login as:{" "}
          <strong>
            {role}
          </strong>
        </p>

        <p
          style={{
            marginTop: "15px",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Demo login: any username and password
        </p>

      </div>

    </div>
  );
}

export default Login;