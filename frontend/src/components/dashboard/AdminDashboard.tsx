import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyVerticallyCenteredModal from './ProjectAssignModal';
import CreateUserModal from './CreateUserModal';
import CreateProjectModal from './CreateProjectModal';

interface User {
  email: string;
  full_name: string;
  role: string;
  associated_projects: string[];
}

interface UsersByRole {
  [role: string]: User[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  clients: string[];
  employees: string[];
  admins: string[];
}





const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<UsersByRole>({});
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectAssignModalShow, setProjectAssignModalShow] = React.useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);


  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);


  const handleUserCreationSuccess = () => {
    fetchUsers(); // Assuming this method fetches the updated list of users
  };

  const handleProjectCreationSuccess = () => {
    fetchProjects();
  }

  const fetchProjects = async () => {
    try {
      const response = await axios.get<Project[]>('/api/projects');
      const projectsArray = response.data;
      setProjects(projectsArray);
  
      // If there's a selected project, update it specifically
      if (selectedProject) {
        const updatedSelectedProject = projectsArray.find(p => p._id === selectedProject._id);
        if (updatedSelectedProject) {
          setSelectedProject(updatedSelectedProject);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch projects');
    }
  };


  const assignProject = async (project: Project) => {
    setSelectedProject(project);
    try {
      await fetchUsers();
      setProjectAssignModalShow(true);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch employees');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}`);
      // After deletion, fetch the projects list again to update the UI
      fetchProjects(); // Assuming you have a function called fetchProjects to refresh the list
    } catch (error) {
      console.error('Failed to delete project', error);
      // Optionally, handle the error in the UI, such as showing an error message
    }
  };


  const fetchUsers = async () => {
    try {
      const response = await axios.get<UsersByRole>('/api/users/roles');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch users');
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

  const associateUserWithProject = async (email: string, projectId: string) => {
    try {
      await axios.post('/api/projects/add_user', { project_id: projectId, email });
      fetchUsers();
      fetchProjects();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to associate user with project');
    }
  }

  const disassociateUserWithProject = async (email: string, projectId: string) => {
    try {
      await axios.post('/api/projects/remove_user', { email, project_id: projectId });
      fetchUsers();
      fetchProjects();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to disassociate user with project');
    }
  };




  return (
    <>
      <div className="container mx-auto mt-8 p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        
        <button className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
        onClick={() => setShowCreateUserModal(true)}>
          Create New User
        </button>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(users).map(([role, userList]) => (
            <div key={role} className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold mb-4">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
              {/* Adjust list padding to remove indentation */}
              <ul className="space-y-4">
                {userList.map((user) => (
                  <li key={user.email} className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    {/* Remove left padding/margin that might cause indentation */}
                    <div className="flex-1">
                      <p className="font-medium break-words">{user.full_name}</p>
                      <p className="text-sm text-gray-600 break-words">{user.email}</p>
                    </div>
                    <button 
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-150 ease-in-out text-xs sm:text-sm self-start sm:self-center w-full sm:w-auto"
                      onClick={() => deleteUser(user.email)}
                    >
                      <svg className="w-4 h-4 inline mr-1 -mt-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>






        <button className="w-full text-white bg-amber-500 hover:bg-amber-600 focus:ring-4 focus:ring-amber-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
         onClick={() => setShowCreateProjectModal(true)}>Create New Project</button>
        <h2 className="text-xl font-semibold mt-8 mb-4">All Projects</h2>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="flex flex-col justify-between p-4 bg-white shadow rounded-lg h-full">
              <div>
                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                <p className="mb-4">{project.description}</p>
              </div>
              <div className="flex flex-col space-y-2 mt-4"> {/* Adjust spacing and margin as needed */}
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => assignProject(project)}
                >
                  Assign
                </button>
                <button
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {projectAssignModalShow && <MyVerticallyCenteredModal
        show={projectAssignModalShow}
        onHide={() => setProjectAssignModalShow(false)}
        project={selectedProject}
        users={users}
        associateUserWithProject={associateUserWithProject}
        disassociateUserWithProject={disassociateUserWithProject}
      />}

      {showCreateUserModal && <CreateUserModal
        show={showCreateUserModal}
        onHide={() => setShowCreateUserModal(false)}
        onSuccess={handleUserCreationSuccess}
      />}

      {showCreateProjectModal && <CreateProjectModal
        show={showCreateProjectModal}
        onHide={() => setShowCreateProjectModal(false)}
        onSuccess={handleProjectCreationSuccess}
      />}
    </>
  );
};

export default AdminDashboard;
