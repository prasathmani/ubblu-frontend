import { Button, Col, Form, Row } from 'react-bootstrap';
import React, { Component } from 'react';
import { getDepartments, manageDepartment } from 'store/api';

import { Scrollbars } from 'react-custom-scrollbars';
import { WORKSPACEID } from 'common/utils/helper';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../Common/confirmDialog';

class UsersDepartment extends Component {
  constructor(props) {
    super();
    this.state = {
      edit: false,
      id: null,
      workspaceId: WORKSPACEID(),
      departments: [],
      name: '',
      default: false,
      selectedDepartmentId: ''
    };
  }

  componentDidMount() {
    this.getAllDepartments();
  }

  formatDepartmentName = name => {
    return name
      .split(' ')
      .join('-')
      .toLowerCase();
  };

  getAllDepartments = () => {
    getDepartments(this.state.workspaceId)
      .then(response => {
        if (response.success) {
          this.setState({
            departments: response.data.departments,
            name: '',
            id: null,
            edit: false,
          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleDepartments = payload => {
    this.laoding = true;
    manageDepartment(payload)
      .then(response => {
        console.log('depat err', response)
        if (response.success && response.data.status === 1) {
          toast.success('SUCCESS: Department has been updated successfuly!');
          this.setState({
            default: false
          })
          this.getAllDepartments();
        }else{
          toast.error(`Error: ${response.errors[0]['message']} !`);
        }
        this.laoding = false;
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value.trim() });
  };

  handleAddDept = event => {
    event.preventDefault();
    this.handleDepartments(this.state);
  };

  changeDefaultDepartment = () => {
    this.setState(prevState => ({
      default: !prevState.default,
    })
    );
  };

  handleEditDept = event => {
    event.preventDefault();
    const selectedId = event.target.dataset.id;
    if (selectedId) {
      const _department = this.state.departments.filter(function (department) {
        return department.id === parseInt(selectedId);
      });

      if (_department && _department.length) {
        this.setState({
          name: _department[0].name,
          edit: true,
          id: parseInt(selectedId),
        });
      }
    }
  };

  handleDeleteDept = event => {
    event.preventDefault();
    const {selectedDepartmentId} = this.state;
    this.handleConfirmDialog(event);
    if(selectedDepartmentId){
        const payload = {
          id: parseInt(selectedDepartmentId),
          delete: true,
          workspaceId: this.state.workspaceId,
        };
        this.handleDepartments(payload);
    }
  };

  handleConfirmDialog = (event)=> {
    const {showConfirmation} = this.state;
    const selectedDepartmentId = showConfirmation ? ''  : event.target.dataset.id;
    this.setState({
      selectedDepartmentId,
      showConfirmation: !showConfirmation
    });
  }

  render() {
    const { workspaceId, departments, name, edit, showConfirmation } = this.state;
    return (
      <div className="manage-users__department">
        <form method="post" action={`/workspaces/${workspaceId}/departments`} onSubmit={this.handleAddDept}>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Col md={8}>
              <Form.Control
                className="manage-users__department__input"
                type="text"
                size="sm"
                pattern="[a-zA-Z0-9\s]+"
                placeholder="Department name"
                name="name"
                value={name}
                aria-label="Department name"
                required
                onChange={this.handleChange}
              />
            </Col>
            {edit ? (
              <Form.Label column sm={2}>
                <Form.Check
                  type="checkbox"
                  id="default-checkbox"
                  label="default"
                  onChange={this.changeDefaultDepartment}
                />
              </Form.Label>
            ) : null}

            <Button type="submit" className="manage-users__department__btn">{edit ? 'Save  ' : 'Add  ' }
              <span
                className={this.laoding ? 'spinner-border spinner-border-sm' : 'hide'}
                role="status"
                aria-hidden="true"
              />
            </Button>
          </Form.Group>
        </form>
        <ul>
          <Scrollbars autoHeight autoHeightMin={200} autoHeightMax={360} hideTracksWhenNotNeeded={true}>
            {departments.map(dept => (
              <li key={dept.id}>
                <span>
                  {dept.name} <i className="text-muted"> @{this.formatDepartmentName(dept.name)}</i>
                  {dept.default ? (
                    <span>
                      {' '}
                      {/* <i className="fa fa-check" aria-hidden="true"></i> */}
                      (default)
                    </span>
                  ) : null}
                </span>
                <span></span>
                <span className="float-right">
                  <i className="far fa-edit mr-2" data-id={dept.id} onClick={this.handleEditDept} />
                  <i className="far fa-trash-alt" data-id={dept.id} onClick={this.handleConfirmDialog} />
                </span>
              </li>
            ))}
          </Scrollbars>
        </ul>
        <ConfirmDialog
          show={showConfirmation}
          cancelModal={this.handleConfirmDialog}
          saveModal={this.handleDeleteDept}
          title="Deleting Department"
          message="'Are you sure want to delete this department?"
          variantYes="danger"
        />
      </div>
    );
  }
}

export default UsersDepartment;
