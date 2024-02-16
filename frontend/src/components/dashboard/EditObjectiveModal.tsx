import React, { useState, useEffect } from 'react';
import Modal from '../Modal';
import axios from 'axios';


interface ChecklistItem {
  _id: string;
  description: string;
  complete: boolean;
}

interface EditObjectiveModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  projectId: string;
  objectiveId: string;
}

const EditObjectiveModal: React.FC<EditObjectiveModalProps> = ({
  show,
  onHide,
  onSuccess,
  projectId,
  objectiveId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItemDesc, setNewChecklistItemDesc] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (show) {
      axios.get(`/api/projects/${projectId}/objectives/${objectiveId}`)
        .then(response => {
          const { title, description, checklist } = response.data;
          setTitle(title);
          setDescription(description);
          setChecklist(checklist || []);
        })
        .catch(error => setErrorMessage('Failed to fetch objective details'));
    }
  }, [show, projectId, objectiveId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/api/projects/${projectId}/objectives/${objectiveId}`, { title, description });
      setSuccessMessage('Objective updated successfully.');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to update objective');
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newChecklistItemDesc.trim()) return;
    try {
      await axios.post(`/api/projects/${projectId}/objectives/${objectiveId}/checklist`, {
        description: newChecklistItemDesc
      });

      const updatedObjectiveResponse = await axios.get(`/api/projects/${projectId}/objectives/${objectiveId}`);
      const updatedChecklist = updatedObjectiveResponse.data.checklist;
      setChecklist(updatedChecklist);
      setNewChecklistItemDesc(''); 
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to add checklist item');
    }
  };

  const handleToggleChecklistItem = async (itemId: string) => {
    try {
      const response = await axios.put(`/api/projects/${projectId}/objectives/${objectiveId}/checklist/${itemId}/toggle`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        
        setChecklist(checklist.map(item => item._id === itemId ? { ...item, complete: !item.complete } : item));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to toggle checklist item.');
    }
  };

  const handleDeleteChecklistItem = async (itemId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}/objectives/${objectiveId}/checklist/${itemId}`);
      setChecklist(checklist.filter(item => item._id !== itemId));
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete checklist item');
    }
  };

  
const checklistUI = (
  <div className="mt-4">
    <h5 className="text-lg font-semibold mb-2">Checklist Items:</h5>
    <div className="space-y-2">
      {checklist.map((item) => (
        <div key={item._id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md shadow">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={item.complete}
              onChange={() => handleToggleChecklistItem(item._id)}
              className="form-checkbox h-5 w-5 text-green-500 mr-2"
            />
            <span className={`${item.complete ? "text-gray-400 line-through" : "text-gray-700"} flex-grow`}>
              {item.description}
            </span>
          </div>
          <button
            onClick={() => handleDeleteChecklistItem(item._id)}
            className="text-red-500 hover:text-red-600 ml-4 transition ease-in-out duration-150"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
    <input
      className="form-input mt-3 p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
      placeholder="Add new item..."
      value={newChecklistItemDesc}
      onChange={(e) => setNewChecklistItemDesc(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddChecklistItem();
        }
      }}
    />
  </div>
);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Edit Objective</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {successMessage && <div className="text-success mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-danger mb-4">{errorMessage}</div>}
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="title" className="form-label">Objective Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Objective Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required />
          </div>
          {checklistUI}
          <button type="submit" className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Update Objective
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

export default EditObjectiveModal;
