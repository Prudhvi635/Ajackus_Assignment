import React, { useState, useEffect } from "react";
import UserList from "./components/UserList/UserList";
import UserForm from "./components/UserForm/UserForm";
import ErrorBoundary from "./components/ErrorBondary/ErrorBoundary";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";



const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const transformedData = data.map((user) => ({
        id: user.id,
        firstName: user.name.split(" ")[0],
        lastName: user.name.split(" ")[1] || "",
        email: user.email,
        department: user.company.name,
      }));
      setUsers(transformedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return "First name is required";
    if (!formData.lastName.trim()) return "Last name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Invalid email format";
    if (!formData.department.trim()) return "Department is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const method = currentUser ? "PUT" : "POST";
      const url = currentUser ? `${API_URL}/${currentUser.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(`Failed to ${currentUser ? "update" : "create"} user`);

      if (currentUser) {
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? { ...formData, id: currentUser.id }
              : user
          )
        );
      } else {
        const newId = Math.max(...users.map((u) => u.id)) + 1;
        setUsers([...users, { ...formData, id: newId }]);
      }

      setShowForm(false);
      setCurrentUser(null);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ErrorBoundary>
    <div className="container">
      <div className="header">
        <h1>User Management System</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setCurrentUser(null);
            setFormData({
              id: "",
              firstName: "",
              lastName: "",
              email: "",
              department: "",
            });
          }}
        >
          Add User
        </button>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {showForm && (
        <UserForm
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          currentUser={currentUser}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <UserList users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
    </ErrorBoundary>  
  );
};

export default App;
