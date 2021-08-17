import React from 'react';
import { Form, Button, Col } from 'react-bootstrap';

import { USER_ROLES } from 'common/constants';

const UsersAdd = props => (
  <div>
    <Form method="post" onSubmit={props.action}>
      <Form.Group>
        <Form.Control type="text" placeholder="Name" name="name" maxLength="30" required />
      </Form.Group>

      <Form.Group>
        <Form.Control type="email" name="email" placeholder="Email" required />
      </Form.Group>

      <Form.Group>
        <Form.Control as="select" name="departmentId" required>
          <option value="">-- Department --</option>
          {props.departments.map(dept => (
            <option value={dept.id} key={dept.id}>
              {dept.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label className="mr-2">
          <strong>Role</strong>
        </Form.Label>
        {USER_ROLES.map(role => (
          <Form.Check
            className="user-roles-option"
            custom
            inline
            name="role"
            label={role}
            type="radio"
            id={`select-role-${role}`}
            key={role}
            value={role}
            defaultChecked={role === 'GUEST USER' ? true : false}
          />
        ))}
      </Form.Group>
      <Form.Group className="row mt-4">
        <Col sm="8">
          <Form.Check
            name='notifyUser'
            custom
            label="Email the new users his/her logins"
            type="checkbox"
            id="adduser-emaillogin"
            defaultChecked
          />
        </Col>
        <Col sm="4" className="text-right">
          <Button variant="outline-primary" name="addUserBtn" type="submit" disabled ={ props.addUserBtnDisabled}  onClick={props.handleAddUserHide}>
            Create Users {'  '}
            <span className={props.addUserBtnDisabled ? 'spinner-border spinner-border-sm' : 'hide'} role="status" aria-hidden="true"/>
          </Button>
        </Col>
      </Form.Group>
    </Form>
  </div>
);

export default UsersAdd;
