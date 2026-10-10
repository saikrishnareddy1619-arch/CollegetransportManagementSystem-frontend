
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/bookings";

const emptyForm = {
  bookingNumber: "",
  studentId: "",
  studentName: "",
  route: "",
  busNumber: "",
  bookingDate: "",
  travelDate: "",
  status: "Pending",
};

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadBookings() {
    setLoading(true);

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Bookings load avvaledu");
      }

      const data = await response.json();
      setBookings(data);
      setMessage("");
    } catch (error) {
      setMessage("Backend check cheyyi. Bookings load avvaledu.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Booking save avvaledu");
      }

      setMessage(
        editingId
          ? "Booking updated successfully!"
          : "Booking added successfully!"
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadBookings();
    } catch (error) {
      setMessage("Booking save avvaledu. Backend check cheyyi.");
    }
  }

  function handleEdit(booking) {
    setForm({
      bookingNumber: booking.bookingNumber || "",
      studentId: booking.studentId || "",
      studentName: booking.studentName || "",
      route: booking.route || "",
      busNumber: booking.busNumber || "",
      bookingDate: booking.bookingDate || "",
      travelDate: booking.travelDate || "",
      status: booking.status || "Pending",
    });

    setEditingId(booking.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee booking delete cheyyala?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete avvaledu");
      }

      setMessage("Booking deleted successfully!");
      await loadBookings();
    } catch (error) {
      setMessage("Booking delete avvaledu. Backend check cheyyi.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  const filteredBookings = bookings.filter((booking) =>
    [
      booking.bookingNumber,
      booking.studentId,
      booking.studentName,
      booking.route,
      booking.busNumber,
      booking.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Transport Booking</h1>
          <p>Manage student bus booking records</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={loadBookings}
        >
          Refresh
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <div className="form-card">
        <h2>{editingId ? "Edit Booking" : "Add New Booking"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Booking Number</label>
              <input
                name="bookingNumber"
                value={form.bookingNumber}
                onChange={handleChange}
                placeholder="BK-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Student ID</label>
              <input
                name="studentId"
                value={form.studentId}
                onChange={handleChange}
                placeholder="STU001"
                required
              />
            </div>

            <div className="form-group">
              <label>Student Name</label>
              <input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                placeholder="Rahul"
                required
              />
            </div>

            <div className="form-group">
              <label>Route</label>
              <input
                name="route"
                value={form.route}
                onChange={handleChange}
                placeholder="Route1"
                required
              />
            </div>

            <div className="form-group">
              <label>Bus Number</label>
              <input
                name="busNumber"
                value={form.busNumber}
                onChange={handleChange}
                placeholder="BUS-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Booking Date</label>
              <input
                type="date"
                name="bookingDate"
                value={form.bookingDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Travel Date</label>
              <input
                type="date"
                name="travelDate"
                value={form.travelDate}
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
                required
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="primary-button">
              {editingId ? "Update Booking" : "Add Booking"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-button"
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
          <h2>Booking Records ({filteredBookings.length})</h2>

          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search bookings..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Route</th>
                <th>Bus Number</th>
                <th>Booking Date</th>
                <th>Travel Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.bookingNumber}</td>
                  <td>{booking.studentId}</td>
                  <td>{booking.studentName}</td>
                  <td>{booking.route}</td>
                  <td>{booking.busNumber}</td>
                  <td>{booking.bookingDate}</td>
                  <td>{booking.travelDate}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(booking)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredBookings.length === 0 && (
                <tr>
                  <td colSpan="9">No bookings found.</td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="9">Loading bookings...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Booking;
