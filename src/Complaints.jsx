
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/complaints";

const emptyForm = {
  complaintNumber: "",
  studentId: "",
  studentName: "",
  category: "Bus Delay",
  description: "",
  complaintDate: "",
  status: "Pending",
  response: "",
};

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadComplaints() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Unable to load complaints");

      const data = await response.json();
      setComplaints(data);
    } catch {
      setMessage("Backend connect avvaledu. Backend running lo undho check cheyyi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComplaints();
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

      if (!response.ok) throw new Error("Unable to save complaint");

      setMessage(
        editingId
          ? "Complaint updated successfully!"
          : "Complaint submitted successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadComplaints();
    } catch {
      setMessage("Complaint save cheyyadam lo error vachindhi.");
    }
  }

  function handleEdit(complaint) {
    setForm({
      complaintNumber: complaint.complaintNumber || "",
      studentId: complaint.studentId || "",
      studentName: complaint.studentName || "",
      category: complaint.category || "Other",
      description: complaint.description || "",
      complaintDate: complaint.complaintDate || "",
      status: complaint.status || "Pending",
      response: complaint.response || "",
    });

    setEditingId(complaint.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee complaint ni delete cheyyala?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete complaint");

      setMessage("Complaint deleted successfully!");

      if (editingId === id) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await loadComplaints();
    } catch {
      setMessage("Complaint delete cheyyadam lo error vachindhi.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  const filteredComplaints = complaints.filter((complaint) =>
    [
      complaint.complaintNumber,
      complaint.studentId,
      complaint.studentName,
      complaint.category,
      complaint.description,
      complaint.status,
      complaint.response,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Complaints Management</h1>
          <p>Student transport complaints ni manage cheyyandi</p>
        </div>

        <button className="secondary-button" onClick={loadComplaints}>
          Refresh
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <div className="form-card">
        <h2>{editingId ? "Edit Complaint" : "Submit Complaint"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Complaint Number</label>
              <input
                name="complaintNumber"
                value={form.complaintNumber}
                onChange={handleChange}
                placeholder="e.g. CMP001"
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
              <label>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="Bus Delay">Bus Delay</option>
                <option value="Driver Behaviour">Driver Behaviour</option>
                <option value="Bus Condition">Bus Condition</option>
                <option value="Route Issue">Route Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Complaint Date</label>
              <input
                type="date"
                name="complaintDate"
                value={form.complaintDate}
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your complaint"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Admin Response</label>
              <textarea
                name="response"
                value={form.response}
                onChange={handleChange}
                placeholder="Enter response if available"
                rows="3"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button className="primary-button" type="submit">
              {editingId ? "Update Complaint" : "Submit Complaint"}
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
          <h2>All Complaints ({complaints.length})</h2>

          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search complaints..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Complaint No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Status</th>
                <th>Admin Response</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9">Loading complaints...</td>
                </tr>
              ) : filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="9">No complaints found.</td>
                </tr>
              ) : (
                filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.complaintNumber}</td>
                    <td>{complaint.studentId}</td>
                    <td>{complaint.studentName}</td>
                    <td>{complaint.category}</td>
                    <td>{complaint.description}</td>
                    <td>{complaint.complaintDate}</td>
                    <td>{complaint.status}</td>
                    <td>{complaint.response || "—"}</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => handleEdit(complaint)}
                      >
                        Edit
                      </button>{" "}
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(complaint.id)}
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

export default Complaints;
