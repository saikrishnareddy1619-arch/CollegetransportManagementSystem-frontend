
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/passes";

const emptyForm = {
  passNumber: "",
  studentId: "",
  studentName: "",
  route: "",
  issueDate: "",
  expiryDate: "",
  fee: "",
  status: "Active",
};

function TransportPass() {
  const [passes, setPasses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadPasses() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Unable to load passes");

      const data = await response.json();
      setPasses(data);
    } catch {
      setMessage("Backend connect avvaledu. Backend running lo undho check cheyyi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPasses();
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

      if (!response.ok) throw new Error("Unable to save pass");

      setMessage(editingId ? "Transport pass updated successfully!" : "Transport pass added successfully!");
      setForm(emptyForm);
      setEditingId(null);
      await loadPasses();
    } catch {
      setMessage("Pass save cheyyadam lo error vachindhi.");
    }
  }

  function handleEdit(pass) {
    setForm({
      passNumber: pass.passNumber || "",
      studentId: pass.studentId || "",
      studentName: pass.studentName || "",
      route: pass.route || "",
      issueDate: pass.issueDate || "",
      expiryDate: pass.expiryDate || "",
      fee: pass.fee || "",
      status: pass.status || "Active",
    });

    setEditingId(pass.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee transport pass ni delete cheyyala?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete pass");

      setMessage("Transport pass deleted successfully!");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await loadPasses();
    } catch {
      setMessage("Pass delete cheyyadam lo error vachindhi.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  const filteredPasses = passes.filter((pass) =>
    [
      pass.passNumber,
      pass.studentId,
      pass.studentName,
      pass.route,
      pass.issueDate,
      pass.expiryDate,
      pass.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Transport Pass Management</h1>
          <p>Student transport passes ni manage cheyyandi</p>
        </div>

        <button className="secondary-button" onClick={loadPasses}>
          Refresh
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <div className="form-card">
        <h2>{editingId ? "Edit Transport Pass" : "Issue New Pass"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Pass Number</label>
              <input
                name="passNumber"
                value={form.passNumber}
                onChange={handleChange}
                placeholder="e.g. PASS001"
                required
              />
            </div>

            <div className="form-group">
              <label>Student ID</label>
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="e.g. STU001"
                required
              />
            </div>

            <div className="form-group">
              <label>Student Name</label>
              <input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Enter student name"
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
              <label>Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Fee (₹)</label>
              <input
                type="number"
                min="0"
                name="fee"
                value={form.fee}
                onChange={handleChange}
                placeholder="Enter fee"
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
                <option value="Expired">Expired</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button className="primary-button" type="submit">
              {editingId ? "Update Pass" : "Issue Pass"}
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
          <h2>All Transport Passes ({passes.length})</h2>

          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search passes..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Pass No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Route</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Fee (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9">Loading passes...</td>
                </tr>
              ) : filteredPasses.length === 0 ? (
                <tr>
                  <td colSpan="9">No transport passes found.</td>
                </tr>
              ) : (
                filteredPasses.map((pass) => (
                  <tr key={pass.id}>
                    <td>{pass.passNumber}</td>
                    <td>{pass.studentId}</td>
                    <td>{pass.studentName}</td>
                    <td>{pass.route}</td>
                    <td>{pass.issueDate}</td>
                    <td>{pass.expiryDate}</td>
                    <td>₹{pass.fee}</td>
                    <td>{pass.status}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(pass)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(pass.id)}
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

export default TransportPass;
