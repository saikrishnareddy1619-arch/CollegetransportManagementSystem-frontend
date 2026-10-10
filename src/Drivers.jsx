import { useEffect, useState } from "react";

function Drivers() {
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    driverId: "",
    name: "",
    phone: "",
    licenseNumber: "",
    experience: "",
    assignedBus: "",
    status: "Active",
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:8080/api/drivers";

  // Load drivers from backend
  const loadDrivers = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load drivers");
      }

      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load drivers. Please check backend.");
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add / Update driver
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
        throw new Error("Failed to save driver");
      }

      alert(
        editingId
          ? "Driver updated successfully!"
          : "Driver added successfully!"
      );

      resetForm();
      loadDrivers();
    } catch (error) {
      console.error(error);
      alert("Unable to save driver.");
    }
  };

  // Delete driver
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driver?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete driver");
      }

      alert("Driver deleted successfully!");

      loadDrivers();
    } catch (error) {
      console.error(error);
      alert("Unable to delete driver.");
    }
  };

  // Edit driver
  const handleEdit = (driver) => {
    setEditingId(driver.id);

    setFormData({
      driverId: driver.driverId || "",
      name: driver.name || "",
      phone: driver.phone || "",
      licenseNumber: driver.licenseNumber || "",
      experience: driver.experience || "",
      assignedBus: driver.assignedBus || "",
      status: driver.status || "Active",
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
      driverId: "",
      name: "",
      phone: "",
      licenseNumber: "",
      experience: "",
      assignedBus: "",
      status: "Active",
    });
  };

  // Search drivers
  const filteredDrivers = drivers.filter((driver) => {
    const searchText = search.toLowerCase();

    return (
      driver.driverId?.toLowerCase().includes(searchText) ||
      driver.name?.toLowerCase().includes(searchText) ||
      driver.phone?.toLowerCase().includes(searchText) ||
      driver.licenseNumber?.toLowerCase().includes(searchText) ||
      driver.experience?.toLowerCase().includes(searchText) ||
      driver.assignedBus?.toLowerCase().includes(searchText) ||
      driver.status?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h1>Driver Management</h1>
          <p>Manage college transport drivers</p>
        </div>

        <button
          className="secondary-button"
          onClick={loadDrivers}
        >
          Refresh
        </button>
      </div>

      {/* Driver Form */}

      <div className="form-card">

        <h2>
          {editingId ? "Update Driver" : "Add New Driver"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <div className="form-group">
              <label>Driver ID</label>

              <input
                type="text"
                name="driverId"
                value={formData.driverId}
                onChange={handleChange}
                placeholder="DRV001"
                required
              />
            </div>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ramesh"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
              />
            </div>

            <div className="form-group">
              <label>License Number</label>

              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="TS123456789"
                required
              />
            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5 Years"
                required
              />
            </div>

            <div className="form-group">
              <label>Assigned Bus</label>

              <input
                type="text"
                name="assignedBus"
                value={formData.assignedBus}
                onChange={handleChange}
                placeholder="BUS-001"
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
                <option value="On Leave">On Leave</option>
              </select>
            </div>

          </div>

          <div className="form-buttons">

            <button
              type="submit"
              className="primary-button"
            >
              {editingId ? "Update Driver" : "Add Driver"}
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

      {/* Driver List */}

      <div className="table-card">

        <div className="table-header">

          <div>
            <h2>Driver List</h2>

            <p>
              Total Drivers: <strong>{drivers.length}</strong>
            </p>
          </div>

          <input
            type="text"
            className="search-input"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="table-wrapper">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Driver ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>License</th>
                <th>Experience</th>
                <th>Assigned Bus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredDrivers.length === 0 ? (

                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No drivers found
                  </td>
                </tr>

              ) : (

                filteredDrivers.map((driver) => (

                  <tr key={driver.id}>

                    <td>{driver.id}</td>

                    <td>
                      <strong>{driver.driverId}</strong>
                    </td>

                    <td>{driver.name}</td>

                    <td>{driver.phone}</td>

                    <td>{driver.licenseNumber}</td>

                    <td>{driver.experience}</td>

                    <td>{driver.assignedBus}</td>

                    <td>
                      <span
                        className={
                          driver.status === "Active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {driver.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-button"
                        onClick={() => handleEdit(driver)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(driver.id)}
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

export default Drivers;