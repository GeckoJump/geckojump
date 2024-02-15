import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

interface AddObjectiveModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
  projectId: string;
}

const AddObjectiveModal: React.FC<AddObjectiveModalProps> = ({ show, onHide, onSuccess, projectId }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/api/projects/${projectId}/objectives`, { title, description });
      setTitle('');
      setDescription('');
      setErrorMessage('');
      onSuccess(); 
      onHide();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to add objective');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Objective</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
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
          <button className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
           type="submit">Add Objective</button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
         onClick={onHide}>Close</button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddObjectiveModal;
