import React, { useEffect, useState } from 'react';
import StickyNavbar from '../components/StickyNavbar';
import AddObjectiveModal from '../components/dashboard/AddObjectiveModal';
import EditObjectiveModal from '../components/dashboard/EditObjectiveModal'; // Import the EditObjectiveModal
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ChecklistItem {
  _id: string;
  description: string;
  complete: boolean;
}

interface Objective {
  _id: string;
  title: string;
  description: string;
  progress: number;
  checklist: ChecklistItem[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  progress: number;
  objectives: Objective[];
  admins: string[];
  employees: string[];
  clients: string[];
}

const EmployeeProjectDetail: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId } = useParams<'projectId'>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editObjectiveId, setEditObjectiveId] = useState<string | null>(null); 
  const navigate = useNavigate();

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);
  const handleSuccessAdd = () => {
    console.log('Objective added successfully');
    handleCloseAddModal();

  };

  const handleShowEditModal = (objectiveId: string) => setEditObjectiveId(objectiveId);
  const handleCloseEditModal = () => setEditObjectiveId(null);
  const handleSuccessEdit = () => {
    console.log('Objective edited successfully');
    handleCloseEditModal();

  };


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get<Project>(`/api/projects/${projectId}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId,]);


  const fetchProjectDetails = async () => {
    console.log('fetching');
    setLoading(true);
    try {
      const response = await axios.get<Project>(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (err) {
      setError('Failed to fetch project details');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteObjective = async (projectId: string, objectiveId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}/objectives/${objectiveId}`);
      console.log('Objective deleted successfully');
      fetchProjectDetails();
    } catch (err) {
      console.error('Failed to delete objective', err);
      
    }
  };



  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  const projectIdDefined = projectId ? projectId : '';

  return (
    <>
      <StickyNavbar />
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="mt-20 flex justify-center items-center space-x-4">
          <button onClick={() => navigate(-1)}
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                  Back to Dashboard
          </button>
          <button onClick={handleShowAddModal}
                  className="py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
                  Add Objective
          </button>
        </div>
        <div className="text-center mt-10">
            <h1 className="mt-9 text-3xl font-bold text-gray-800">{project.title}</h1>
            <p className="mt-4 text-lg text-gray-600">{project.description}</p>
            {/* display project progress */}
            <p className="mt-4 font-semibold">Project Progress</p>
            <div className="mt-2 mb-20 w-3/4 bg-gray-200 rounded-full dark:bg-gray-700 mx-auto">
                <div className="bg-green-500 text-lg font-medium text-white-100 text-center p-0.5 leading-none rounded-full" style={{width: `${project.progress}%`}}> 
                    {project.progress}%
                </div>
            </div>
        </div>


        <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Objectives</h2>
            <div className="space-y-4">
                {project.objectives && project.objectives.length > 0 ? (
                project.objectives.map((objective) => (
                    <div key={objective._id} className="p-4 rounded-lg shadow-lg bg-white" onClick={() => handleShowEditModal(objective._id)}>
                    <h3 className="text-xl font-semibold text-gray-800">{objective.title}</h3>
                    <p className="mt-2 text-gray-600">{objective.description}</p>
                    {/* progress bar container */}
                    <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
                        {/* progress bar */}
                        <div className="bg-green-500 text-xs font-medium text-white-100 text-center p-0.5 leading-none rounded-full" 
                            style={{width: `${objective.progress}%`}}> 
                        {objective.progress}%
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation(); // dont trigger edit modal
                            deleteObjective(projectIdDefined, objective._id);
                        }}
                        className="py-2 px-4 bg-red-500 hover:bg-red-700 text-white font-bold rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-gray-600">No objectives found for this project.</p>
                )}
            </div>
        </div>

      </div>
      {showAddModal && projectId && (
        <AddObjectiveModal
        show={showAddModal}
        onHide={() => {
            fetchProjectDetails();
            handleCloseEditModal();
        }}
        onSuccess={() => {
          console.log('Objective added successfully');
          fetchProjectDetails();
          handleCloseAddModal(); 
        }}
        projectId={projectId}
      />
      )}
  
      {editObjectiveId && projectId && (
        <EditObjectiveModal
            show={Boolean(editObjectiveId)}
            onHide={() => {
                fetchProjectDetails(); 
                handleCloseEditModal();
            }}
            onSuccess={() => {
                console.log('Objective edited successfully');
                fetchProjectDetails(); 
                handleCloseEditModal(); 
            }}
            projectId={projectId}
            objectiveId={editObjectiveId}
            />

      )}
    </>
  );
  
};

export default EmployeeProjectDetail;


