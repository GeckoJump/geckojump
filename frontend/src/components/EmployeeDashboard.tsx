import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
}

interface EmployeeDashboardProps {
  email: string | null; 
}

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ email }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/projects/user/${email}`);
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div 
            key={project._id} 
            className="p-4 bg-white shadow rounded-lg cursor-pointer hover:bg-gray-100" 
            onClick={() => navigate(`/employee/projects/${project._id}`)}
          >
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <p className="text-sm text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
