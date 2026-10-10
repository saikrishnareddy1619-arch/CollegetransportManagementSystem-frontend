
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/stops";

function Stops() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const emptyForm = {
    stopNumber: "",
    stopName: "",
    location: "",
    route: "",
    arrivalTime: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  async function loadStops() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Stops load cheyyalekapoyam");
      const data = await response.json();
      setStops(data);
      setMessage("");
    } catch (error) {
      setMessage("Backend connect avvaledu. Backend running lo undho check cheyyi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStops();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Save failed");

      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Stop updated successfully!" : "Stop added successfully!");
      await loadStops();
    } catch (error) {
      setMessage("Stop save cheyyadam lo error vachindhi.");
    }
  }

  function handleEdit(stop) {
    setForm({
      stopNumber: stop.stopNumber || "",
      stopName: stop.stopName || "",
      location: stop.location || "",
      route: stop.route || "",
      arrivalTime: stop.arrivalTime || "",
      status: stop.status || "Active",
    });
    setEditingId(stop.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee stop ni delete cheyyala?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");

      setMessage("Stop deleted successfully!");
      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }
      await loadStops();
    } catch (error) {
      setMessage("Stop delete cheyyadam lo error vachindhi.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  const filteredStops = stops.filter((stop) =>
    [
      stop.stopNumber,
      stop.stopName,
      stop.location,
      stop.route,
      stop.arrivalTime,
      stop.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Stops Management</h1>
          <p>College bus stops ni manage cheyyandi</p>
        </div>
        <button className="secondary-button" onClick={loadStops}>
          Refresh
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <div className="form-card">
        <h2>{editingId ? "Edit Stop" : "Add New Stop"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Stop Number</label>
              <input
                name="stopNumber"
                value={form.stopNumber}
                onChange={handleChange}
                placeholder="e.g. STOP001"
                required
              />
            </div>

            <div className="form-group">
              <label>Stop Name</label>
              <input
                name="stopName"
                value={form.stopName}
                onChange={handleChange}
                placeholder="Enter stop name"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="form-group">
              <label>Route</label>
              <input
                name="route"
                value={form.route}
                onChange={handleChange}
                placeholder="e.g. Route1"
                required
              />
            </div>

            <div className="form-group">
              <label>Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button className="primary-button" type="submit">
              {editingId ? "Update Stop" : "Add Stop"}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-card">
        <div className="table-header">
          <h2>All Stops ({stops.length})</h2>
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search stops..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Stop No.</th>
                <th>Stop Name</th>
                <th>Location</th>
                <th>Route</th>
                <th>Arrival Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading stops...</td>
                </tr>
              ) : filteredStops.length === 0 ? (
                <tr>
                  <td colSpan="7">No stops found.</td>
                </tr>
              ) : (
                filteredStops.map((stop) => (
                  <tr key={stop.id}>
                    <td>{stop.stopNumber}</td>
                    <td>{stop.stopName}</td>
                    <td>{stop.location}</td>
                    <td>{stop.route}</td>
                    <td>{stop.arrivalTime}</td>
                    <td>
                      <span
                        className={
                          stop.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {stop.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(stop)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(stop.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Stops;
