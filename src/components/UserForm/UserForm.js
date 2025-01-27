import React from 'react';
import './UserForm.css';

const UserForm = ({ onSubmit, onClose, currentUser, formData, setFormData }) => {
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={onSubmit} className="user-form">
      <div className="form-header">
        <h2>{currentUser ? 'Edit User' : 'Add New User'}</h2>
        <button 
          type="button"
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>

      {currentUser && (
        <div className="form-group">
          <label className="form-label">ID:</label>
          <input
            className="form-input"
            type="text"
            name="id"
            value={formData.id}
            disabled
          />
        </div>
      )}

      <div className="form-row">
        <div className="form-column">
          <label className="form-label">First Name:</label>
          <input
            className="form-input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-column">
          <label className="form-label">Last Name:</label>
          <input
            className="form-input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Email:</label>
        <input
          className="form-input"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Department:</label>
        <input
          className="form-input"
          type="text"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        {currentUser ? 'Update User' : 'Add User'}
      </button>
    </form>
  );
};

export default UserForm;