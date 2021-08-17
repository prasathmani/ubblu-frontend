import { Button, Form, InputGroup, Tab, Tabs, Alert } from 'react-bootstrap';
import React, { Component, useState } from 'react';
import {
  deleteUserFromChannel,
  getAllUsersByChannel,
  makeChannelAdmin,
  getAllUsers,
  addUsers2Channel,
  getWorkspaceUsersRelationToAChannel
} from 'store/api';
import { Scrollbars } from 'react-custom-scrollbars';

import Avatar from 'components/Avatar';
import UsersInvites from 'components/Manage/Invite';
import { WORKSPACEID, USERID } from 'common/utils/helper';
import SuggestionOverlay from '../../Common/SuggestionOverlay/Index';
import { toast } from 'react-toastify';
class ChannelsUsersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      userId: USERID(),
      channelId: this.props.channel,
      showInviteModal: false,
      showUsersList: false,
      showNewChannel: false,
      showEditChannelModal: false,
      users: [],
      filteredUsers: [],
      // showInputOverlay: false,
      searchText:''
    };

    this.KEYS_TO_FILTERS = ['user.name'];
    this.selectedUsers = [];
  }

  componentDidMount() {
    this.renderUsersList();
  }

  searchUpdated = term => {
    this.setState({ searchTerm: term });
  };

  /**
   * Render list of user on workspace and update the change status by users already added into channel
   */
  renderUsersList = () => {
    getWorkspaceUsersRelationToAChannel(this.state.workspaceId, this.state.channelId)
      .then(response => {
        if (response && response.success && response.data.status === 1) {
          const usersList = response.data.users;
          this.setState({
            users: usersList,
            filteredUsers: usersList,
          });
        } else {
          toast.error('ERROR: some error occurred try again!');
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  /**
   * filter users bu search
   * @param {event}
   */
  searchUsers = event => {
    let updatedList = this.state.users;
    updatedList = updatedList.filter(function (item) {
      const {name} = item;
      return (name || '').toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ filteredUsers: updatedList, searchText: event.target.value}, this.onBlur);
  };

  handleUserRemove = id => {
    if (id) {
      let payload = {
        channelId: this.state.channelId,
        userId: id,
      };
      deleteUserFromChannel(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: User has been deleted successfuly!');
            this.renderUsersList();
            this.props.refreshChannelsList();
          } else {
            toast.error('ERROR: some error occurred try again!');
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleMakeAdmin = id => {
    if (id) {
      let payload = {
        channelId: this.state.channelId,
        userId: id,
      };
      makeChannelAdmin(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: User has been added as admin successfuly!');
            // this.renderUsersList();

          } else {
            toast.error(response.errors[0].message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleAddUser = id => {
    let payload = {
      usersId: [id],
      channelId: this.state.channelId,
    };
    addUsers2Channel(payload)
      .then(response => {
        if (response.success && response.data.status === 1) {
          // this.renderUsersList();
          this.props.refreshChannelsList();
          toast.success('SUCCESS: User has been added successfully');

        } else {
          toast.error('ERROR: some error occurred try again!');
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleUserRoles = (e, id) => {
    let selected = e.currentTarget.value;
    selected = selected ? parseInt(selected) : NaN;
    switch (selected) {
      case 0:
        this.handleUserRemove(id);
        break;
      case 1:
        this.handleAddUser(id);
        break;
      case 2:
        this.handleMakeAdmin(id);
        break;
      default:
        toast.error('ERROR: some error occurred try again!');
    }
  };

  // onFocus = (e)=> {
  //   const {searchText} = this.state;
  //   if(!searchText){
  //       this.setState({showInputOverlay: true})
  //   }
  // }

  // onBlur = (e)=> {
  //   const {showInputOverlay} = this.state;
  //   if(showInputOverlay){
  //     this.setState({showInputOverlay: false})
  //   }
  // }

  onSubmit = (e)=>{
    e.preventDefault();
  }

  render() {
    const { filteredUsers, showInputOverlay } = this.state;

    return (
      <>
        <Tabs defaultActiveKey="user-list" id="manage-channel-users">
          <Tab eventKey="user-list" title="Manage Users">
            <Form className="mt-3" onSubmit={this.onSubmit}>
              <Form.Group className="c-input__search">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Search  user"
                    aria-describedby="userListSearch"
                    onChange={this.searchUsers}
                    // onFocus={this.onFocus}
                    // onBlur={this.onBlur}
                    value={this.state.searchText}
                  />
                  <InputGroup.Prepend>
                    <InputGroup.Text id="userListSearch">
                      <i className="fas fa-search" />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
                {/*{showInputOverlay && <SuggestionOverlay  customClasses='suggestion-overlay' />}*/}
              </Form.Group>
            </Form>
            <div className="c-channels-userslsit">
              <ul>
                <Scrollbars autoHeight autoHeightMin={300} autoHeightMax={380}>
                  {filteredUsers &&
                    filteredUsers.map(user => (
                      <li key={user.id}>
                        <div className="row-user-item">
                          <div>
                            <Avatar
                              as="span"
                              userid={user.id}
                              src={user.profile_image}
                              alt={user.name || user.username}
                              variant="small"
                              className="rounded-circle"
                            />
                            <span>{user.name || user.username}</span>
                            {/* <span className="text-muted label-admin">Admin</span> */}
                          </div>
                          <div>
                            <select onChange={e => this.handleUserRoles(e, user.id)}>
                              <option value="0" key="121">
                                Non-Member
                              </option>
                              <option
                                value="1"
                                key="122"
                                selected={
                                  (user.role === 'MEMBER') ? true : false
                                }
                              >
                                Member
                              </option>
                              {/* {user.channel && (user.role === 'ADMIN' || user.role === 'SUPERADMIN') && ( */}
                              <option
                                value="2"
                                key="123"
                                selected={
                                  (user.role === 'ADMIN' || user.role === 'SUPERADMIN') ? true : false
                                }
                              >
                                Admin
                                </option>
                              {/* )} */}
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                </Scrollbars>
              </ul>
            </div>
          </Tab>

          <Tab eventKey="manage-new-user" title="Invite New User">
            {this.props.channelType != 'RESTRICTED' ? (
              <UsersInvites channelId={this.props.channel} />
            ) : (
                <div style={{ marginTop: '15px' }}>
                  <Alert variant="info">This is a secret channel. You need to add users manually!</Alert>
                </div>
              )}
          </Tab>
        </Tabs>
      </>
    );
  }
}
export default ChannelsUsersList;
