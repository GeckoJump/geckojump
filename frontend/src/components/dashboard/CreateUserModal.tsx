import React, { useState } from 'react';
import Modal from '../Modal';

import axios from 'axios';

interface CreateUserModalProps {
    show: boolean;
    onHide: () => void;
    onSuccess: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ show, onHide, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', { email, full_name: fullName, role });
      setEmail('');
      setFullName('');
      setRole('');
      setErrorMessage('');
      onSuccess(); // Callback to refresh users list in parent component
      onHide(); // Close modal
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create user');
    }
  };

  return (
    <Modal show={show} onHide={onHide} exitButton>
      <Modal.Header>
        <Modal.Title>Create User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input type="text" className="form-control" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select id="role" className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>
          </div>
          <button className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
           type="submit">
            Create User
          </button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
         onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateUserModal;
