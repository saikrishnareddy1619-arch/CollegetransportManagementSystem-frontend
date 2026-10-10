
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8080/api/payments";

function OnlinePayment() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    paymentNumber: "",
    studentId: "",
    studentName: "",
    passNumber: "",
    amount: "",
    paymentDate: "",
    paymentMethod: "UPI",
    transactionId: "",
    status: "Pending",
  };

  const [form, setForm] = useState(emptyForm);

  async function loadPayments() {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Payments load avvaledu");
      const data = await response.json();
      setPayments(data);
      setMessage("");
    } catch (error) {
      setMessage("Backend running lo undho check cheyyi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      amount: form.amount,
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Payment save avvaledu");

      setMessage(editingId ? "Payment record updated!" : "Payment record added!");
      setForm(emptyForm);
      setEditingId(null);
      await loadPayments();
    } catch (error) {
      setMessage("Save avvaledu. Backend and PaymentController check cheyyi.");
    }
  }

  function handleEdit(payment) {
    setForm({
      paymentNumber: payment.paymentNumber || "",
      studentId: payment.studentId || "",
      studentName: payment.studentName || "",
      passNumber: payment.passNumber || "",
      amount: payment.amount ?? "",
      paymentDate: payment.paymentDate || "",
      paymentMethod: payment.paymentMethod || "UPI",
      transactionId: payment.transactionId || "",
      status: payment.status || "Pending",
    });
    setEditingId(payment.id);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Ee payment record delete cheyyala?")) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete avvaledu");
      setMessage("Payment record deleted!");
      await loadPayments();
    } catch (error) {
      setMessage("Delete avvaledu. Backend check cheyyi.");
    }
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
  }

  const filteredPayments = payments.filter((payment) =>
    [
      payment.paymentNumber,
      payment.studentId,
      payment.studentName,
      payment.passNumber,
      payment.transactionId,
      payment.paymentMethod,
      payment.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Online Payments</h1>
          <p>Manage student transport payment records</p>
        </div>
        <button className="secondary-button" onClick={loadPayments}>
          Refresh
        </button>
      </div>

      {message && <p role="status">{message}</p>}

      <div className="form-card">
        <h2>{editingId ? "Edit Payment Record" : "Add Payment Record"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Payment Number</label>
              <input
                name="paymentNumber"
                value={form.paymentNumber}
                onChange={handleChange}
                placeholder="PAY-001"
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
                placeholder="Student name"
                required
              />
            </div>

            <div className="form-group">
              <label>Pass Number</label>
              <input
                name="passNumber"
                value={form.passNumber}
                onChange={handleChange}
                placeholder="PASS-001"
                required
              />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="1500"
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Date</label>
              <input
                type="date"
                name="paymentDate"
                value={form.paymentDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="UPI">UPI</option>
                <option value="Card">Debit/Credit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="form-group">
              <label>Transaction ID</label>
              <input
                name="transactionId"
                value={form.transactionId}
                onChange={handleChange}
                placeholder="TXN123456"
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
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="form-buttons">
            <button className="primary-button" type="submit">
              {editingId ? "Update Payment" : "Add Payment"}
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
          <h2>Payment Records ({filteredPayments.length})</h2>
          <input
            className="search-input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search payments..."
          />
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Payment No.</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Pass No.</th>
                <th>Amount (₹)</th>
                <th>Date</th>
                <th>Method</th>
                <th>Transaction ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.paymentNumber}</td>
                  <td>{payment.studentId}</td>
                  <td>{payment.studentName}</td>
                  <td>{payment.passNumber}</td>
                  <td>₹{payment.amount}</td>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.transactionId}</td>
                  <td>{payment.status}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(payment.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="10">No payment records found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan="10">Loading payments...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OnlinePayment;
