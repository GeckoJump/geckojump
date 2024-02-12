import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
    show: boolean;
    project: any; // Adjust the type as per your project type definition
    employees: Employee[]; // Assuming you have a type definition for Employee
    associateUserWithProject: (email: string, projectId: string) => void;
    disassociateUserWithProject: (email: string, projectId: string) => void;
    onHide: () => void;
}

interface Employee {
    email: string;
    fullName: string;
}
  
  const MyVerticallyCenteredModal = (props: ModalProps) => {
    const { project, employees, associateUserWithProject, disassociateUserWithProject, onHide } = props;
  
    // Render list of employees
    const renderEmployees = () => {
      return employees.map((employee: Employee) => (
        <div key={employee.email}>
          <p>{employee.fullName}</p>
          <Button onClick={() => associateUserWithProject(employee.email, project._id)}>Assign</Button>
          <Button onClick={() => disassociateUserWithProject(employee.email, project._id)}>Unassign</Button>
        </div>
      ));
    };
  
    return (
      <Modal show={props.show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Assign Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Project: {project.title}</h4>
          <p>Description: {project.description}</p>
          <h5>Employees:</h5>
          {renderEmployees()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  export default MyVerticallyCenteredModal;
  