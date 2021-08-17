import { Button, Form, InputGroup } from 'react-bootstrap';
import React, { Component } from 'react';
import { checkWorkSpaceAbility, signupStep2 } from 'store/api';

import { toast } from 'react-toastify';

class AddNewWorkspace extends Component {
  constructor(props) {
    super();
    this.state = {
      isWorkspaceAvailable: false,
      name: '',
      description: '',
      signupUser: true,
      error: '',
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCheckAbility = e => {
    if (this.state.name) {
      const payload = { name: this.state.name };
      checkWorkSpaceAbility(payload)
        .then(response => {
          if (response.data.status === 1) {
            this.setState({
              isWorkspaceAvailable: true,
              error: '',
            });
          } else {
            this.setState({
              isWorkspaceAvailable: false,
              error: response.data.message,
            });
          }
        })
        .catch(error => {
          this.setState({
            isWorkspaceAvailable: false,
            error: error.response.data.message,
          });
        });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    signupStep2(this.state)
      .then(response => {
        if (response.success && response.data.hasOwnProperty('workspace')) {
          this.props.close();
          toast.success('SUCCESS: Workspace has been added successfuly!');
        } else {
          toast.error(response.errors[0].message);
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  render() {
    const { name, description, signupUser, error, isWorkspaceAvailable } = this.state;
    return (
      <div className="signin-workspace">
        <form method="post" onSubmit={this.handleSubmit}>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Enter your ubblu workspace url</Form.Label>

            <InputGroup className="mb-3 create__workspace">
              <div>
                <Form.Label className="workspace__domainname">ubblu.com/</Form.Label>
              </div>
              <Form.Control
                type="text"
                name="name"
                value={name}
                placeholder="Enter workspace name"
                required
                onChange={this.handleChange}
                aria-label="Enter workspace name"
                aria-describedby="basic-addon2"
              />
            </InputGroup>

            {isWorkspaceAvailable && (
              <Form.Control.Feedback type="valid" className="d-block">
                Congratulation! Your workspace is available
              </Form.Control.Feedback>
            )}
            {error && (
              <Form.Control.Feedback type="invalid" className="d-block">
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="text-right">
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </Form.Group>
        </form>
      </div>
    );
  }
}

export default AddNewWorkspace;
