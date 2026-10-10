import { useEffect, useState } from "react";

function Buses() {
  const [buses, setBuses] = useState([]);

  const [formData, setFormData] = useState({
    busNumber: "",
    registrationNumber: "",
    busModel: "",
    capacity: "",
    driverName: "",
    route: "",
    status: "Active",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:8080/api/buses";

  // Load buses from backend
  const loadBuses = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load buses");
      }

      const data = await response.json();
      setBuses(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load buses. Please check backend.");
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update bus
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save bus");
      }

      alert(
        editingId
          ? "Bus updated successfully!"
          : "Bus added successfully!"
      );

      resetForm();
      loadBuses();
    } catch (error) {
      console.error(error);
      alert("Unable to save bus.");
    }
  };

  // Delete bus
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete bus");
      }

      alert("Bus deleted successfully!");

      loadBuses();
    } catch (error) {
      console.error(error);
      alert("Unable to delete bus.");
    }
  };

  // Edit bus
  const handleEdit = (bus) => {
    setEditingId(bus.id);

    setFormData({
      busNumber: bus.busNumber || "",
      registrationNumber: bus.registrationNumber || "",
      busModel: bus.busModel || "",
      capacity: bus.capacity || "",
      driverName: bus.driverName || "",
      route: bus.route || "",
      status: bus.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);

    setFormData({
      busNumber: "",
      registrationNumber: "",
      busModel: "",
      capacity: "",
      driverName: "",
      route: "",
      status: "Active",
    });
  };

  // Search
  const filteredBuses = buses.filter((bus) => {
    const searchText = search.toLowerCase();

    return (
      bus.busNumber?.toLowerCase().includes(searchText) ||
      bus.registrationNumber?.toLowerCase().includes(searchText) ||
      bus.busModel?.toLowerCase().includes(searchText) ||
      bus.driverName?.toLowerCase().includes(searchText) ||
      bus.route?.toLowerCase().includes(searchText) ||
      bus.status?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Bus Management</h1>
          <p>Manage college transport buses</p>
        </div>

        <button
          className="secondary-button"
          onClick={loadBuses}
        >
          Refresh
        </button>
      </div>

      {/* Bus Form */}

      <div className="form-card">

        <h2>
          {editingId ? "Update Bus" : "Add New Bus"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Bus Number</label>

              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleChange}
                placeholder="BUS-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Registration Number</label>

              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="TS09AB1234"
                required
              />
            </div>

            <div className="form-group">
              <label>Bus Model</label>

              <input
                type="text"
                name="busModel"
                value={formData.busModel}
                onChange={handleChange}
                placeholder="Tata Starbus"
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>

              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>

            <div className="form-group">
              <label>Driver Name</label>

              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                placeholder="Ramesh"
                required
              />
            </div>

            <div className="form-group">
              <label>Route</label>

              <input
                type="text"
                name="route"
                value={formData.route}
                onChange={handleChange}
                placeholder="Route1"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId ? "Update Bus" : "Add Bus"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* Search */}

      <div className="table-card">

        <div className="table-header">

          <div>
            <h2>Bus List</h2>

            <p>
              Total Buses: <strong>{buses.length}</strong>
            </p>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search buses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* Table */}

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Bus Number</th>
                <th>Registration</th>
                <th>Model</th>
                <th>Capacity</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredBuses.length === 0 ? (

                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No buses found
                  </td>
                </tr>

              ) : (

                filteredBuses.map((bus) => (

                  <tr key={bus.id}>

                    <td>{bus.id}</td>

                    <td>
                      <strong>{bus.busNumber}</strong>
                    </td>

                    <td>
                      {bus.registrationNumber}
                    </td>

                    <td>
                      {bus.busModel}
                    </td>

                    <td>
                      {bus.capacity}
                    </td>

                    <td>
                      {bus.driverName}
                    </td>

                    <td>
                      {bus.route}
                    </td>

                    <td>
                      <span
                        className={
                          bus.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {bus.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() => handleEdit(bus)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(bus.id)}
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

export default Buses;