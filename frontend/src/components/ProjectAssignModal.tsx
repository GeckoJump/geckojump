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
        console.log('checking if user ' + email + ' is associated with project');
        if (project) {
            // Destructure with default empty arrays to avoid undefined issues
            const { clients = [], employees = [], admins = [] } = project;
                
            // Check if the email is present in any of the arrays
            const isAssociated = 
                (Array.isArray(clients) && clients.includes(email)) || 
                (Array.isArray(employees) && employees.includes(email)) || 
                (Array.isArray(admins) && admins.includes(email));
    
            if (isAssociated) {
                console.log('user ' + email + ' is associated!');
            }
            return isAssociated;
        }
        return false;
    };
    const renderUsers = () => {
        if (!users || Object.keys(users).length === 0) {
          return <p>No users available</p>;
        }
      
        return Object.entries(users).map(([role, users]) => (
            <div key={role} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user: User) => (
                        <div key={user.email} className="p-4 shadow rounded-lg bg-white max-h-64 overflow-auto">
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                            {isUserAssociated(user.email) ? (
                                <button className="w-full text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" 
                                onClick={() => disassociateUserWithProject(user.email, project._id)}>Unassign</button>
                            ) : (
                                <button className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                onClick={() => associateUserWithProject(user.email, project._id)}>Assign</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <Modal show={props.show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Assign Project</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {project ? (
                    <>
                        <h4 className="text-xl font-semibold">{project.title}</h4>
                        <p className="text-gray-600">{project.description}</p>
                    </>
                ) : (
                    <p>No project information available.</p>
                )}
                <div className="mt-6">
                    <h5 className="text-lg font-semibold mb-4">Users:</h5>
                    {renderUsers()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={onHide}>Close</button>
            </Modal.Footer>
        </Modal>
    );
};
  export default MyVerticallyCenteredModal;
  