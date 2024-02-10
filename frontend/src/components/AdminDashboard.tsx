import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  email: string;
  fullName: string;
}

interface UsersByRole {
  [role: string]: User[];
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UsersByRole>({});
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<UsersByRole>('/api/users/roles');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch users');
    }
  };

  const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('create user');
    try {
      const response = await axios.post('/api/users', { email, full_name: fullName, role });
      console.log(response.data);
      // Reset form fields after successful user creation
      setEmail('');
      setFullName('');
      setRole('');
      setErrorMessage('');
      fetchUsers(); // Fetch users again to update the list after creating a new user
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to create user');
    }
  };

  const deleteUser = async (userEmail: string) => {
    try {
      await axios.delete(`/api/users/${userEmail}`);
      fetchUsers(); // Fetch users again to update the list after deleting a user
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete user');
    }
  };

  return (
    <div className="container mx-auto mt-8 p-8 border border-gray-300 rounded-md">
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
      <form onSubmit={createUser} className="mb-4">
        <div className="flex flex-col md:flex-row">
          <div className="flex-grow md:mr-2">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>
          <div className="flex-grow md:ml-2">
            <label htmlFor="fullName" className="block mb-2">Full Name:</label>
            <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required />
          </div>

        </div>
        <div className="mt-4">
          <label htmlFor="role" className="block mb-2">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="client">Client</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Create User</button>
      </form>
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
      
      <h2 className="text-xl font-semibold mb-2">All Users</h2>
      <div>
        {Object.entries(users).map(([role, userList]) => (
          <div key={role} className="mb-4 border border-gray-300 rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2">{role}</h3>
            <ul>
              {userList.map((user) => (
                <li key={user.email}>
                  {user.email} - {user.fullName}
                  <button 
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    onClick={() => deleteUser(user.email)}>
                    Delete
                  </button>
                  </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
