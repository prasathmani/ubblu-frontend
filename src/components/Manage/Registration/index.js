import 'react-tagsinput/react-tagsinput.css';

import { Button, Col, Container, Form, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';

import TagsInput from 'react-tagsinput';
import { WORKSPACEID } from 'common/utils/helper';
import { API } from 'common/constants';

import { registerOptions, getDepartments, updateWorkspaceRegistrationSettings, fetchWorkspaceRegistrationSettings } from 'store/api';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';

class Registration extends Component {
  workspaceId = WORKSPACEID();
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      tags: [],
      departments: [],
      department: null,
      userType: null,
      resgistrationSettings: null,
      selectedDepartment: null,
      selection: 'EMPLOYEE',
      departmentId: null,
      tagsPlaceholder: 'i.e @gmail.com @yourcompanyname.com..',
      registrationLink: '',
    };

    this.EMAIL_VALIDATION_REGEX = /^@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
  }

  componentDidMount() {
    this.getDepartmentsList();
    this.getRegistrationSettings();
    const {workspace:{name: workspaceName} = {}} = this.props;
    const [protocol, domain] = window.location.origin.split('//')
    this.setState({registrationLink: `${protocol}//${workspaceName}.${domain}/${WORKSPACEID()}/register`});
  }

  onSubmit = e => {
    e.preventDefault();
    console.log('test done');
    let payload = {
      workspaceId: this.workspaceId,
      emailTags: this.state.tags,
      userType: this.state.selection,
      department: parseInt(this.state.selectedDepartment)
    }
    updateWorkspaceRegistrationSettings(payload)
      .then(response => {
        console.log('registration settings update response', response)
        if (response.success && response.data.status === 1) {
          toast.success('SUCCESS: Registration Settings has been updated successfuly!');
        } else {
          toast.error('ERROR: some error occurred try again!');
        }
      })
      .catch(error => {
        console.log('registration settings update response error', error)
        toast.error('ERROR: some error occurred try again!');


      });

    // this.setState({
    //   registrationLink: `${API.DEV_BASE_FRONTEND_URL}/${this.state.workspaceId}/register?inviteType=${this.state.selection}&tags=${this.state.tags}`,
    // });
  };

  getDepartmentsList = () => {
    getDepartments(this.state.workspaceId)
      .then(response => {
        if (response.success) {
          this.setState({
            departments: response.data.departments,
          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  getRegistrationSettings = () => {
    fetchWorkspaceRegistrationSettings()
      .then(response => {
        if (response.success && response.data.data.length) {
          console.log('dept', response);
          this.setState({
            resgistrationSettings: response.data.data[0],
            tags: response.data.data[0]['email_tags'],
            userType: response.data.data[0]['user_type'],
            selection: response.data.data[0]['user_type'],
            department: response.data.data[0]['department'],
            selectedDepartment: response.data.data[0]['department_id'],

          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleChange = e => {
    if (e.target.value == 'Employee') {
      this.setState({ selection: 'EMPLOYEE' });
    } else {
      this.setState({ selection: 'GUEST USER' });
    }
  };
  handleDepartmentChange = e => {
    console.log('depat chack', e.target.value)
    this.setState({ selectedDepartment: e.target.value });
  }

  handleTags = tag => {
    console.log('tags set', tag)
    this.setState({ tags: tag });
  };

  render() {
    let { tags, tagsPlaceholder, userType, department, selectedDepartment } = this.state;
    return (
      <Container>
        <Row>
          <Col>
              <OverlayTrigger
                  placement="bottom"
                  overlay={
                      <Tooltip id={`tooltip-top`}>
                          Settings for signup flow from  your workspace login page.
                          Please note that these changes aren't global to your workspace,
                          but only apply to your workspace signup page!
                      </Tooltip>
                  }
              >
                  <h3 className="mt-4 mb-3 d-inline-block">Sign up Settings</h3>
              </OverlayTrigger>
            <div className="manage-profile mb-4 p-4 bg-white">
              <Form className="mt-3" onSubmit={this.onSubmit}>
                  <div>
                    <Form.Group className="col">
                      <Form.Label>
                        <strong>Your Sign up URL(can be shared with others)</strong>
                      </Form.Label>
                      <p>
                        <a href={this.state.registrationLink}>{this.state.registrationLink}</a>
                      </p>
                    </Form.Group>

                    <Form.Group as={Row} className="col">
                      <Form.Label column>
                          <OverlayTrigger
                              placement="top"
                              overlay={
                                  <Tooltip id={`tooltip-top`}>
                                      User must have these emails in order to signup
                                  </Tooltip>
                              }
                          >
                              <span>Must Have Emails : </span>
                          </OverlayTrigger>
                          <span className="text-muted"> i.e. @example.com or @example.org </span>
                      </Form.Label>
                    </Form.Group>

                    <Form.Group className="custom-tags-input col-6">
                      <TagsInput
                        inputProps={{
                          placeholder: '@gmail.com',
                        }}
                        value={tags}
                        addKeys={[9, 13, 32, 186, 188]} // tab, enter, space, semicolon, comma
                        onlyUnique
                        addOnPaste
                        // validationRegex={this.EMAIL_VALIDATION_REGEX}
                        pasteSplit={data => {
                          return data
                            .replace(/[\r\n,;]/g, ' ')
                            .split(' ')
                            .map(d => d.trim());
                        }}
                        onChange={e => this.handleTags(e)}
                      />
                    </Form.Group>

                    <Form.Group className="col-4">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Select the type of user
                                </Tooltip>
                            }
                        >
                            <Form.Label>Type of User : </Form.Label>
                        </OverlayTrigger>
                      <Form.Control as="select" onChange={this.handleChange}>
                        <option>Employee</option>
                        <option selected={userType == 'GUEST USER' ? true : false} >Guest User</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="col-4">
                        <OverlayTrigger
                            placement="top"
                            overlay={
                                <Tooltip id={`tooltip-top`}>
                                    Setting here is only applicable for this flow
                                </Tooltip>
                            }
                        >
                            <Form.Label>Department : </Form.Label>
                        </OverlayTrigger>
                      <Form.Control as="select" name="departmentId" onChange={this.handleDepartmentChange} required  value={selectedDepartment}>
                        <option  >-- Select Department --</option>
                        {this.state.departments.map(dept => (
                          <option value={dept.id} key={dept.id} >
                            {dept.name}
                          </option>
                        ))}
                        }
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="col">
                      <Button type="submit">Save</Button>
                    </Form.Group>
                  </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = response => {
  const {user:{response : {user:{user_workspace_relationships = []} = {} } = {}} = {}} = response;
  const [userWorkspaceRelationships] =  user_workspace_relationships;
  const workspace = (userWorkspaceRelationships || {}).workspace;
  return {workspace}
};
export default connect(mapStateToProps)(Registration);
