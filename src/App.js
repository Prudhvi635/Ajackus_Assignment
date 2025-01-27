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
        isApiUser: true, // Flag to identify users from API
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
      if (currentUser) {
        // If it's an API user, attempt API update
        if (currentUser.isApiUser) {
          const response = await fetch(`${API_URL}/${currentUser.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: currentUser.id,
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              company: {
                name: formData.department
              }
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update user");
          }
        }
        
        // Update local state regardless of API status
        setUsers(users.map((user) =>
          user.id === currentUser.id
            ? { 
                ...formData, 
                id: currentUser.id,
                isApiUser: currentUser.isApiUser 
              }
            : user
        ));
      } else {
        // Creating new user
        const newId = Math.max(...users.map((u) => u.id), 0) + 1;
        const newUser = { 
          ...formData, 
          id: newId,
          isApiUser: false // Mark manually created users
        };
        setUsers([...users, newUser]);
      }

      // Reset form state
      setShowForm(false);
      setCurrentUser(null);
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      ...user,
      id: user.id.toString()
    });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      const userToDelete = users.find(user => user.id === id);
      
      // Only make API call if it's an API user
      if (userToDelete.isApiUser) {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
      }

      // Update local state regardless of API status
      setUsers(users.filter((user) => user.id !== id));
      setError(null);
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
              setError(null);
            }}
          >
            Add User
          </button>
        </div>

        {error && (
          <div className="error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        {showForm && (
          <UserForm
            onSubmit={handleSubmit}
            onClose={() => {
              setShowForm(false);
              setError(null);
            }}
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