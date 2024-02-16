import React, { useEffect, useState } from 'react';
import StickyNavbar from '../components/StickyNavbar';
import AddObjectiveModal from '../components/dashboard/AddObjectiveModal';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  objectives: Objective[];
  admins: string[];
  employees: string[];
  clients: string[];
}

interface Objective {
  _id: string;
  title: string;
  description: string;
  time_to_completion: number; // Assuming time_to_completion is a string for simplicity
}



const ProjectDetail: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useParams<'projectId'>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get<Project>(`/api/projects/${projectId}`);
        console.log(response.data)
        setProject(response.data);
      } catch (err) {
        setError('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);


  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSuccess = () => {
    // Refresh project details or objectives list here if needed
    console.log('Objective added successfully');
    handleCloseModal();
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;
  
  return (
    <>
      <StickyNavbar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)}
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                  Back to Dashboard
          </button>
          <button onClick={handleShowModal}
                  className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                  Add Objective
          </button>
        </div>
        <div className="text-center mt-10">
          <h1 className="mt-9 text-3xl font-bold text-gray-800">{project.title}</h1>
          <p className="mt-4 text-lg text-gray-600">{project.description}</p>
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objectives</h2>
          <div className="space-y-4">
            {project.objectives && project.objectives.length > 0 ? (
              project.objectives.map((objective) => (
                <div key={objective._id} className="p-4 rounded-lg shadow-lg bg-white">
                  <h3 className="text-xl font-semibold text-gray-800">{objective.title}</h3>
                  <p className="mt-2 text-gray-600">{objective.description}</p>
                  <p className="mt-2 text-gray-500">Time to completion: {objective.time_to_completion} days</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No objectives found for this project.</p>
            )}
          </div>
        </div>
      </div>
      <AddObjectiveModal
        show={showModal}
        onHide={handleCloseModal}
        onSuccess={handleSuccess}
        projectId={project._id}
      />
    </>
  );
  
};

export default ProjectDetail;
