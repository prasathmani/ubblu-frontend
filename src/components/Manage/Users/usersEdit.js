import React from 'react';
import { Col, Button, Form } from 'react-bootstrap';

const UsersEdit = props => {
  const role = props.user_workspace_relationships && props.user_workspace_relationships[0].status;
  const departmentName = props.user_workspace_relationships && props.user_workspace_relationships[0].department_id;
 
  console.log('depart', props);

  return (
    <div>
      <Form onSubmit={props.action}>
        <input type="hidden" name="userId" defaultValue={props.id} />
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Name" defaultValue={props.name} maxLength="30" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" name="email" placeholder="Email" defaultValue={props.email} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Department</Form.Label>
          <Form.Control as="select" name="departmentId" defaultValue={departmentName}>
            {props.departments.map(dept => ( 
              <option value={dept.id} key={dept.id}>
                {dept.name}
              </option>
            ))}
            }
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label className="mr-2">
            <strong>Role</strong>
          </Form.Label>
          <Form.Check
            className="user-roles-option"
            custom
            inline
            name="role"
            label="GUEST USER"
            type="radio"
            id="role-select-member"
            value="GUEST USER"
            defaultChecked={role === 'GUEST USER' ? true : false}
          />
          <Form.Check
            className="user-roles-option"
            custom
            inline
            name="role"
            label="EMPLOYEE"
            type="radio"
            id="role-select-employee"
            value="EMPLOYEE"
            defaultChecked={role === 'EMPLOYEE' ? true : false}
          />
          <Form.Check
            className="user-roles-option"
            custom
            inline
            name="role"
            label="ADMIN"
            type="radio"
            value="ADMIN"
            id="role-select-admin"
            defaultChecked={role === 'ADMIN' ? true : false}
          />
          {/*<Form.Check
            className="user-roles-option"
            custom
            inline
            name="role"
            label="SUPERADMIN"
            type="radio"
            value="SUPERADMIN"
            id="role-select-superadmin"
            defaultChecked={role === 'SUPERADMIN' ? true : false}
          />*/}
        </Form.Group>
        <Form.Group className="row mt-4">
          <Col sm="12" className="text-right">
            <Button variant="outline-primary" type="submit">
              Update User
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
};

export default UsersEdit;
