import './index.scss';

import {
  AddNewUser,
  ManageUserDeactivate,
  ManageUserReactivate,
  ManageUserTermination,
  ManageUsers,
  addUsers2Department,
  deleteUsers,
  getDepartments,
  searchUsersByName,
} from 'store/api';
import { Button, Col, Container, Form, Modal, Row, Table, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap';
import React, { Component } from 'react';

import { ConfirmDialog } from 'components/Common/confirmDialog';
import UsersAdd from './usersAdd';
import UsersDepartment from './usersDepartment';
import UsersEdit from './usersEdit';
import UsersInvites from 'components/Manage/Invite';
import Loader from 'components/Common/loader';
import SuggestionOverlay from '../../Common/SuggestionOverlay/Index';
import { WORKSPACEID } from 'common/utils/helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { getAllUsersByWorkspaceAction } from 'store/actions';
import { toast } from 'react-toastify';

let getAllDepartments;
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddUserModal: false,
      showEditUserModal: false,
      showMessageModal: false,
      showExportModal: false,
      showInviteModal: false,
      showDepartmentModal: false,
      showConfirmModal: false,
      showDeactivatingUserModal: false,
      showReactivatingUserModal: false,
      showTerminateUserModal: false,
      addUserBtnDisabled: false,
      departments: [],
      selectedRows: [],
      selectedUser: [],
      users: [],
      workspaceId: WORKSPACEID(),
      searchTerm: '',
      isFirstLoad: false,
      showAddDepartmentModal: false,
      selectedDepartmentId: '',
      loading: true,
      showBulkSuspendUserDialog: false,
      showInputOverlay : false,
      showOnce: true
    };
    this.selectedId = null;
    this.inviteType = 'users';

    getAllDepartments = new Promise((resolve, reject) => {
      getDepartments(this.state.workspaceId)
        .then(response => {
          if (response.success) {
            resolve(response.data.departments);
          }
          resolve(null);
        })
        .catch(error => {
          reject('ERROR: some error occurred try again!');
        });
    });
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    this.props.getAllUsersByWorkspaceAction(this.state.workspaceId);
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.response.manage && nextProps.response.manage.hasOwnProperty('response')) {
      let response = nextProps.response.manage.response;
      console.log('state check for users reload', nextState.isFirstLoad, this.state.isFirstLoad, response.data)
      if (response.data && response.data.status === 1 && !this.state.isFirstLoad) {
        this.setState({
          users: response.data.users,
          isFirstLoad: true,
          loading: false
        });
      }
    }
    return true;
  }

  //TODO : latest is not rendering, need to check
  saveEditUser = payload => {
    ManageUsers(payload)
      .then(response => {
        if (response.success && response.data.status === 1) {
          toast.success('SUCCESS: User has been updated successfuly!');
          this.setState(
            {
              isFirstLoad: false,
              showEditUserModal: false,
              selectedUser: [],
              selectedRows: [],
              // forceReload: true,
            },
            () => this.getUsers(),

          );
        } else {
          toast.error(`ERROR: ${response.errors[0]['message'] || response.errors}!`);
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  getUserById = id => {
    return this.state.users.filter(function (user) {
      return user.id === id;
    });
  };

  handleAddUserModal = () => {
    getAllDepartments.then(
      response => {
        this.setState(prevState => ({
          showAddUserModal: !prevState.showAddUserModal,
          departments: response,
          addUserBtnDisabled: false
        }));
      },
      error => {
        toast.error('ERROR: some error occurred try again!');
      },
    );
  };

  handleEditUserModal = id => {
    const _user = this.getUserById(id);

    if (this.state.departments.length) {
      this.setState(prevState => ({
        showEditUserModal: !prevState.showEditUserModal,
        selectedUser: _user[0],
        departments: prevState.departments,
      }));
    } else {
      getAllDepartments.then(
        response => {
          if (response) {
            this.setState(prevState => ({
              showEditUserModal: !prevState.showEditUserModal,
              selectedUser: _user[0],
              departments: response,
            }));
          }
        },
        error => {
          toast.error('ERROR: some error occurred try again!');
        },
      );
    }
  };

  /**
   * Add new user
   * @param {Event}
   */
  handleAddUser = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = Object.fromEntries(formData);
    if (payload) {
      payload.workspaceId = this.state.workspaceId;
      payload.notifyUser = payload.notifyUser ? true : false;
      // e.target.addUserBtn.disabled = true;
      this.setState({
        addUserBtnDisabled: true
      })
      console.log('e value', e.target);

      AddNewUser(payload)
        .then(response => {
          console.log('add user res', response);
          if (response.success) {
            toast.success('SUCCESS: User has been added successfuly!');
            this.setState(
              prevState => ({
                showAddUserModal: !prevState.showAddUserModal,
                isFirstLoad: false,
              }),
              () => this.getUsers(),
            );
          } else {
            // e.target.addUserBtn.disabled = false;
            // console.log('add user', e.target);
            // e.target.addUserBtn.disabled = true;
            this.setState({
              addUserBtnDisabled: false
            })

            toast.error(get(response, 'errors[0]', 'ERROR: some error occurred try again!'));
          }
        })
        // .catch(error => {
        //   // e.target.addUserBtn.disabled = false;
        //   toast.error('ERROR: some error occurred try again!');
        // });
    }
  };

  handleInviteModal = (type = null) => {
    this.inviteType = type;
    this.setState(prevState => ({
      showInviteModal: !prevState.showInviteModal,
    }));
  };

  handleDepartmentModal = () => {
    this.setState(prevState => ({
      showDepartmentModal: !prevState.showDepartmentModal,
    }));
  };

  handleDeactivateUserModal = (id = null) => {
    this.selectedId = id;
    this.setState(prevState => ({
      showDeactivatingUserModal: !prevState.showDeactivatingUserModal,

    }));
  };


  handleReactivateUserModal = (id = null) => {
    this.selectedId = id;
    this.setState(prevState => ({
      showReactivatingUserModal: !prevState.showReactivatingUserModal,

    }));
  };


  handleTerminateUserModal = (id = null) => {
    this.selectedId = id;
    this.setState(prevState => ({
      showTerminateUserModal: !prevState.showTerminateUserModal,

    }));
  };

  handleSelectAllRows = e => {
    const isSelected = e.currentTarget.checked;
    let _selectedRows = [];
    [...document.querySelectorAll('.manage-users__table .custom-control-input')].map(input => {
      if (isSelected) {
         if(this.shouldDisableSuspendBtn || input.value == this.loggedInUserId) return;
        input.checked = true;
        _selectedRows.push(input.value);
      } else {
        input.checked = false;
        _selectedRows = [];
      }
      return null;
    });
    // e.currentTarget.checked = !e.currentTarget.checked;
    // _selectedRows = e.currentTarget.checked ? _selectedRows : [];
    this.manageSlectedRows(_selectedRows);
  };

  handleSelectRows = e => {
    let _selectedRows = [];
    [...document.querySelectorAll('.manage-users__table .custom-control-input:checked')].map(input => {
      _selectedRows.push(input.value);
    });
    this.manageSlectedRows(_selectedRows);
  };

  deSelectRows = () => {
    [...document.querySelectorAll('.manage-users__table .custom-control-input:checked')].map(input => {
      // _selectedRows.push(input.value);
      input.checked = false;
    });
  }

  manageSlectedRows = _selectedRows => {
    if (_selectedRows.length) {
      if (this.state.departments.length) {
        this.setState({
          selectedRows: _selectedRows,
        });
      } else {
        getDepartments(this.state.workspaceId)
          .then(response => {
            if (response.success) {
              this.setState(prevState => ({
                selectedRows: _selectedRows,
                departments: response.data.departments,
              }));
            }
          })
          .catch(error => {
            toast.error('ERROR: some error occurred try again!');
          });
      }
    } else {
      this.setState({
        selectedRows: _selectedRows,
      });
    }
  };

  handleEditUser = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let newValues = Array.from(formData.entries()).reduce(
      (memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
      }),
      {},
    );
    newValues.workspace_id = this.state.workspaceId;
    const {selectedUser:{name, email, id, user_workspace_relationships = []} = {}} = this.state;
    const [uwr = {}] = user_workspace_relationships;
    const {department_id, status} = uwr;
    const oldValues = {
      departmentId: department_id,
      email,
      name,
      role:status,
      userId: id,
      workspace_id: this.state.workspaceId
    };
    const difference = {};
    Object.keys(newValues).forEach(key => {
      if(newValues[key] != oldValues[key]){
        difference[key]  = newValues[key];
      }
    });
    if(!!Object.keys(difference).length){
      difference['userId'] = newValues.userId;
      difference['workspace_id'] = newValues.workspace_id;
      this.saveEditUser(difference);
    } else {
      this.setState({
        isFirstLoad: false,
        showEditUserModal: false,
        selectedUser: [],
        selectedRows: []
      });
    }
  };

  handleDeactivateUser = () => {
    if (this.selectedId) {
      let payload = {
        workspaceId: this.state.workspaceId,
        userId: this.selectedId,
      };
      ManageUserDeactivate(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: User has been deactivated successfuly!');
            this.setState(
              {
                isFirstLoad: false,
                showDeactivatingUserModal: !this.state.showDeactivatingUserModal,

              },
              () => this.getUsers(),
            );
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleReactivateUser = () => {
    if (this.selectedId) {
      let payload = {
        workspaceId: this.state.workspaceId,
        userId: this.selectedId,
      };
      ManageUserReactivate(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: User has been reactivated successfuly!');
            this.setState(
              {
                isFirstLoad: false,
                showReactivatingUserModal: !this.state.showReactivatingUserModal,

              },
              () => this.getUsers(),
            );
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleTerminateUser = () => {
    if (this.selectedId) {
      let payload = {
        workspaceId: this.state.workspaceId,
        userId: this.selectedId,
      };
      ManageUserTermination(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: User has been terminated successfuly!');
            this.setState(
              {
                isFirstLoad: false,
                showTerminateUserModal: !this.state.showTerminateUserModal,

              },
              () => this.getUsers(),
            );
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleBulkDepartment = e => {
    const {selectedDepartmentId} = this.state;
    if (selectedDepartmentId) {
        let payload = {
          workspaceId: this.state.workspaceId,
          departmentId: selectedDepartmentId,
          userIds: this.state.selectedRows,
        };
        addUsers2Department(payload)
          .then(response => {
            if (response.success) {
              toast.success('SUCCESS:Department has been added successfully!');
              this.deSelectRows();
              this.setState(
                {
                  isFirstLoad: false,
                  selectedRows: []
                },
                () => this.getUsers(),
              );
            }
          })
          .catch(error => {
            toast.error('ERROR: some error occurred try again!');
          });
      this.handleBulkDepartmentDialog();
    }
  };

  handleBulkSuspend = e => {
    if (this.state.selectedRows.length) {
        let payload = {
          workspaceId: this.state.workspaceId,
          userIds: this.state.selectedRows,
        };
        this.setState({showBulkSuspendUserDialog: false});
        deleteUsers(payload)
          .then(response => {
            if (response.success) {
              toast.success('SUCCESS:Users has been suspended successfully!');
              this.deSelectRows();
              this.setState(
                {
                  isFirstLoad: false,

                },
                () => this.getUsers(),
              );
            }
          })
          .catch(error => {
            toast.error('ERROR: some error occurred, try again!');
          });
    }
  };

  showBulkSuspendUserDialog = ()=> {
    this.setState(({showBulkSuspendUserDialog})=>({showBulkSuspendUserDialog: !showBulkSuspendUserDialog}))
  }

  handleInviteUsers = r => {
    this.setState(
      {
        showInviteModal: false,
      },
      () => toast.success('SUCCESS: User has been invited successfuly!'),
    );
  };

  handleUserSearchEvent = e => {
    this.setState({ searchTerm: e.currentTarget.value });
    if (e.currentTarget.value === '') {
      this.setState(
        {
          isFirstLoad: false,
        },
        () => this.getUsers(),
      );
    }
  };

  handleUserSearch = e => {
    e.preventDefault();
    const {showOnce} = this.state;
    if(showOnce){
      this.setState({showOnce: false});
    }
    if (this.state.searchTerm) {
      let payload = {
        workspaceId: this.state.workspaceId,
        searchTerm: this.state.searchTerm,
      };
      searchUsersByName(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            this.setState({
              users: response.data.users,
            });
          } else {
            toast.success(response.data.message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    } else {
      this.setState(
        {
          isFirstLoad: false,
        },
        () => this.getUsers(),
      );
    }
  };

  handleBulkDepartmentDialog = (e = {})=>{
    const {showAddDepartmentModal} = this.state;
    const selectedDepartmentId = showAddDepartmentModal ?  "" : e.currentTarget.value;
    this.setState(({showAddDepartmentModal})=>({
      showAddDepartmentModal: !showAddDepartmentModal,
      selectedDepartmentId
    }));
  }

  onFocus = (e)=> {
    const {searchTerm, showOnce} = this.state;
    if(showOnce){
      this.setState({showInputOverlay: true})
    }
  }

  onBlur = (e)=> {
    const {showInputOverlay} = this.state;
    if(showInputOverlay){
      this.setState({showInputOverlay: false})
    }
  }

  render() {
    const { selectedRows, users, departments, loading, showBulkSuspendUserDialog, showInputOverlay, showOnce } = this.state;
    const {user:{response : {user:{user_workspace_relationships = [], id: loggedInUserId} = {} } = {}} = {}} = this.props.response;
    const [userWorkspaceRelationships] =  user_workspace_relationships;
    const shouldDisableSuspendBtn = (userWorkspaceRelationships || {}).status !== 'SUPERADMIN';
    const workspace = (userWorkspaceRelationships || {}).workspace;
    this.loggedInUserId = loggedInUserId;
    this.shouldDisableSuspendBtn = shouldDisableSuspendBtn;
    return (
      <React.Fragment>
        <Container className="manage-users">
          <Row>
            <Col className="row mt-4 mb-3">
              <Col className="col-6">
                <h3>People</h3>
              </Col>
              <Col className="col-6 text-right">
                <Button variant="primary" onClick={this.handleAddUserModal}>
                  + Add New User
                </Button>
              </Col>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col className="row mt-2 mb-3">
              <Col>
                <form className="c-input__search" method="post" onSubmit={this.handleUserSearch}>
                  <InputGroup>
                  <Form.Control
                    /*className="search_input"*/
                    type="text"
                    name="searchTerm"
                    placeholder="Search user by name or email"
                    onChange={this.handleUserSearchEvent}
                    autoComplete='off'
                    onFocus={this.onFocus} onBlur={this.onBlur}
                  />
                  <InputGroup.Prepend style={{background: 'white'}}>
                    <InputGroup.Text id="userListSearch">
                      <i className="fas fa-search" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  </InputGroup>
                  {showInputOverlay && showOnce && <SuggestionOverlay customClasses='suggestion-overlay' />}
                </form>
              </Col>
              <Col className="text-right custom-outline-btn">
                <Button variant="outline-primary" className="mr-2" onClick={() => this.handleInviteModal('employee')}>
                  Invite Employees
                </Button>
                <Button variant="outline-primary" className="mr-2" onClick={() => this.handleInviteModal('users')}>
                  Invite Guest Users
                </Button>
                <Button variant="outline-primary" onClick={this.handleDepartmentModal}>
                  Manage Departments
                </Button>
              </Col>
            </Col>
          </Row>
          {selectedRows && selectedRows.length ? (
            <Row>
              <Col className="row mt-2 mb-2 manage-users__actions">
                <Col>
                  <strong>Bulk Actions</strong>
                </Col>
                <Col className="text-right">
                  <Form.Control as="select" className="add-dpt ml-2 mr-2" onChange={this.handleBulkDepartmentDialog}>
                    <option value="0"> Add to Department </option>
                    {departments.map(dept => (
                      <option value={dept.id} key={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Button disabled={shouldDisableSuspendBtn} variant="outline-danger ml-2" className={`${shouldDisableSuspendBtn ? 'default-cursor' : ''} mr-2`} onClick={this.showBulkSuspendUserDialog}>
                    Suspend
                  </Button>
                </Col>
              </Col>
            </Row>
          ) : (
              ''
            )}
          <Row>
            <Col className="row mt-3 mb-4">
              <Col className="manage-users__table">
                <Table responsive hover variant="light">
                  <thead>
                    <tr>
                      <th>
                        <Form.Check
                          custom
                          id="select-user-all"
                          type="checkbox"
                          label=""
                          value="0"
                          onClick={this.handleSelectAllRows}
                        />
                      </th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Company Email</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users &&
                      users.map(user => (
                        <tr key={user.id}>
                          <td>
                            <Form.Check
                              custom
                              id={`select-user-${user.id}`}
                              value={user.id}
                              type="checkbox"
                              label=""
                              onClick={this.handleSelectRows}
                              disabled={user.id == loggedInUserId}
                            />
                          </td>
                          <td className='manage-users__table__username'>{user.name || user.username}</td>
                          <td>{user.user_workspace_relationships[0].status}</td>
                          <td>
                            {user.user_workspace_relationships[0].Department &&
                              user.user_workspace_relationships[0].Department.name}
                          </td>
                          <td>{user.email}</td>
                          {user.user_workspace_relationships[0].is_suspended ?
                            <td className="float-right">

                              {/* <Button
                                variant="outline-danger ml-2"
                                onClick={() => this.handleTerminateUserModal(user.id)}
                              >
                                Terminate
                            </Button> */}
                              <Button
                                variant="outline-primary"
                                onClick={() => this.handleReactivateUserModal(user.id)}
                              >
                                Re-activate
                            </Button>

                            </td> :

                            <td className="float-right">
                              <Button variant="outline-primary" onClick={() => this.handleEditUserModal(user.id)}>
                                Edit
                              </Button>
                              <Button
                                className={`${shouldDisableSuspendBtn || user.id == loggedInUserId ? 'default-cursor' : ''} mr-2`}
                                disabled={shouldDisableSuspendBtn || user.id == loggedInUserId}
                                variant="outline-danger ml-2"
                                onClick={() => this.handleDeactivateUserModal(user.id)}
                              >
                                Suspend
                              </Button>
                            </td>

                          }
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Col>
            </Col>
          </Row>

          {/* Modal */}
          <ConfirmDialog
            show={this.state.showDeactivatingUserModal}
            cancelModal={this.handleDeactivateUserModal}
            saveModal={this.handleDeactivateUser}
            title="Suspending User"
            message="Suspending a user will prevent the current user from logging in, but keep all his/her files, messages and other data. This user will still be billed as active user Do you want to continue?"
            lableNo="Cancel"
            lableYes="Suspend"
            variantYes="danger"
          />

          <ConfirmDialog
            show={this.state.showReactivatingUserModal}
            cancelModal={this.handleReactivateUserModal}
            saveModal={this.handleReactivateUser}
            title="Re-activating User"
            message="Suspending a user will prevent the current user from logging in, but keep all his/her files, messages and other data. This user will still be billed as active user Do you want to continue?"
            lableNo="Cancel"
            lableYes="Re-activate"
            variantYes="primary"
          />

          <ConfirmDialog
            show={this.state.showAddDepartmentModal}
            cancelModal={this.handleBulkDepartmentDialog}
            saveModal={this.handleBulkDepartment}
            title="Add to department"
            message="Want to change the department?"
            lableNo="Cancel"
            lableYes="Confirm"
            variantYes="primary"
          />

          <ConfirmDialog
            show={this.state.showBulkSuspendUserDialog}
            cancelModal={this.showBulkSuspendUserDialog}
            saveModal={this.handleBulkSuspend}
            title="Suspend users"
            message="Are you sure you want to suspend ?"
            lableNo="Cancel"
            lableYes="Confirm"
            variantYes="primary"
          />

          {/* <ConfirmDialog
            show={this.state.showTerminateUserModal}
            cancelModal={this.handleTerminateUserModal}
            saveModal={this.handleTerminateUser}
            title="Terminating User"
            message="Terminating a user will prevent the current user from logging in, will delete all his/her files, messages and other data. This user data will be deleted and wont be able to restore, Do you want to continue?"
            lableNo="Cancel"
            lableYes="Terminate"
            variantYes="danger"
          /> */}

          <Modal show={this.state.showAddUserModal} onHide={this.handleAddUserModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UsersAdd {...this.state} departments={this.state.departments} action={this.handleAddUser} />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showEditUserModal} onHide={this.handleEditUserModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UsersEdit
                {...this.state.selectedUser}
                departments={this.state.departments}
                action={this.handleEditUser}
              />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showInviteModal} onHide={this.handleInviteModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {this.inviteType === 'employee' && 'Invite Employees'}
                {this.inviteType === 'users' && (
                  <>
                    <span>Invite Guest Users </span>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id={`tooltip-top`}>
                          Guest users are like employees but they can't initiate new conversations or join new channels.
                          However, they can reply to the conversations/channels they're a part of
                        </Tooltip>
                      }
                    >
                      <i className="fas fa-info-circle" />
                    </OverlayTrigger>
                  </>
                )}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UsersInvites
                {...this.state}
                variant={this.inviteType}
                callback={this.handleInviteUsers}
                btnName={this.inviteType === 'employee' ? 'Invite Employees' : 'Invite Guest Users'}
                workspace={workspace}
              />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showExportModal} onHide={this.handleExportModal}>
            <Modal.Header closeButton>
              <Modal.Title>Export</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Check
                    custom
                    inline
                    label="Complete Column Export"
                    type="radio"
                    id="export-complete"
                    name="export-users"
                  />
                  <Form.Check
                    custom
                    inline
                    label="Partial Column Export"
                    type="radio"
                    id="export-partial"
                    defaultChecked
                    name="export-users"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Check custom type="checkbox" id="export-1" label="Name" />
                </Form.Group>
                <Form.Group>
                  <Form.Check custom type="checkbox" id="export-2" label="Role" />
                </Form.Group>
                <Form.Group>
                  <Form.Check custom type="checkbox" id="export-3" label="Department" />
                </Form.Group>
                <Form.Group>
                  <Form.Check custom type="checkbox" id="export-4" label="Company Email" />
                </Form.Group>

                <Form.Group className="text-right">
                  <Button variant="outline-primary" type="submit" onClick={this.handleExportModal}>
                    Export
                  </Button>
                </Form.Group>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showDepartmentModal} onHide={this.handleDepartmentModal}>
            <Modal.Header closeButton>
                <Modal.Title>Manage Departments</Modal.Title>
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id={`tooltip-top`}>
                            Departments are used to  organize people in your workspace.
                            You can mention a group of people in channel using "#" followed by department name ex: #sales
                        </Tooltip>
                    }
                >
                    <i className="fas fa-info-circle ml-2 mt-1" />
                </OverlayTrigger>
            </Modal.Header>
            <Modal.Body>
              <UsersDepartment />
            </Modal.Body>
          </Modal>
        </Container>
        {loading && <Loader />}
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getAllUsersByWorkspaceAction,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(Users);
