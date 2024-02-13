import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface User {
    email: string;
    full_name: string;
    role: string;
}
  
interface UsersByRole {
    [role: string]: User[];
}

interface ModalProps {
    show: boolean;
    project: any; 
    users: UsersByRole; 
    associateUserWithProject: (email: string, projectId: string) => void;
    disassociateUserWithProject: (email: string, projectId: string) => void;

    onHide: () => void;
}




const MyVerticallyCenteredModal = (props: ModalProps) => {
    const { project, users, associateUserWithProject, disassociateUserWithProject, onHide } = props;
  
    const isUserAssociated = (email: string) => {
        // Check if the employee's email exists in the project's associated employees
        if (project && project.users) {
            return project.users.some((user: User) => user.email === email);
        }
        return false;
    };
      

    const renderUsers = () => {
        // Verify employees is not empty
        if (!users || Object.keys(users).length === 0) {
          return <p>No users available</p>;
        }
      
        return Object.entries(users).map(([role, users]) => (
            <div key={role}>
                <h3>{role}</h3>
                {users.map((user: User) => (
                    <div key={user.email}>
                    <p>{user.full_name}</p>
                    {/* Check if the user is associated with the project */}
                    {isUserAssociated(user.email) ? (
                        <Button onClick={() => disassociateUserWithProject(user.email, project._id)}>Unassign</Button>
                    ) : (
                        <Button onClick={() => associateUserWithProject(user.email, project._id)}>Assign</Button>
                    )}
                    </div>
                ))}
            </div>
        ));
      };



    return (
        <Modal show={props.show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Assign Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {project ? (
                    <>
                        <h4>Project: {project.title}</h4>
                        <p>Description: {project.description}</p>
                    </>
                ) : (
                    <p>No project information available.</p>
                )}
                <h5>Users:</h5>
                {renderUsers()}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};
  export default MyVerticallyCenteredModal;
  