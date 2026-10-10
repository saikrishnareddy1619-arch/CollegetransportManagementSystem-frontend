import { useEffect, useState } from "react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    department: "",
    year: "",
    phone: "",
    route: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:8080/api/students";

  // Get students from backend
  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();

      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Please check Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handle input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add / Update student
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.studentId ||
      !formData.name ||
      !formData.department ||
      !formData.year ||
      !formData.phone ||
      !formData.route
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      let response;

      if (editingId) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save student");
      }

      alert(
        editingId
          ? "Student updated successfully!"
          : "Student added successfully!"
      );

      clearForm();
      loadStudents();
    } catch (error) {
      console.error(error);
      alert("Unable to save student.");
    }
  };

  // Edit
  const handleEdit = (student) => {
    setEditingId(student.id);

    setFormData({
      studentId: student.studentId || "",
      name: student.name || "",
      department: student.department || "",
      year: student.year || "",
      phone: student.phone || "",
      route: student.route || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      alert("Student deleted successfully!");

      loadStudents();
    } catch (error) {
      console.error(error);
      alert("Unable to delete student.");
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      studentId: "",
      name: "",
      department: "",
      year: "",
      phone: "",
      route: "",
    });

    setEditingId(null);
  };

  // Search
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      (student.studentId || "").toLowerCase().includes(searchText) ||
      (student.name || "").toLowerCase().includes(searchText) ||
      (student.department || "").toLowerCase().includes(searchText) ||
      (student.route || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="page">
      <div className="content">
        <div className="topbar">
          <div>
            <h1>Students</h1>
            <p>Manage college transport students</p>
          </div>

          <div>
            <button className="btn secondary" onClick={loadStudents}>
              Refresh
            </button>
          </div>
        </div>

        {/* Student Form */}
        <div className="card">
          <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div>
                <label>Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="STU001"
                />
              </div>

              <div>
                <label>Student Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul"
                />
              </div>

              <div>
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="CSE"
                />
              </div>

              <div>
                <label>Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="3rd Year"
                />
              </div>

              <div>
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label>Route</label>
                <input
                  type="text"
                  name="route"
                  value={formData.route}
                  onChange={handleChange}
                  placeholder="Route1"
                />
              </div>
            </div>

            <div className="button-row">
              <button type="submit" className="btn primary">
                {editingId ? "Update Student" : "Add Student"}
              </button>

              <button
                type="button"
                className="btn secondary"
                onClick={clearForm}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Search */}
        <div className="card">
          <div className="search-row">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by ID, name, department or route..."
            />

            <strong>Total Students: {students.length}</strong>
          </div>
        </div>

        {/* Student Table */}
        <div className="card">
          <h2>Student List</h2>

          {loading ? (
            <p>Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Phone</th>
                    <th>Route</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.studentId}</td>
                      <td>{student.name}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>{student.phone}</td>
                      <td>{student.route}</td>

                      <td>
                        <button
                          className="btn small"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn danger small"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Students;