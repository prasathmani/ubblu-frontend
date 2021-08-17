import { Button, Form, InputGroup } from 'react-bootstrap';
import React, { Component } from 'react';
import { addUsers2Channel, getAllUsers, getOtherUsersOfWorkspace, fetchChannelInformation } from 'store/api';

import { API } from 'common/constants';
import Avatar from 'components/Avatar';
import { Scrollbars } from 'react-custom-scrollbars';
import { WORKSPACEID } from 'common/utils/helper';
import { toast } from 'react-toastify';

class ChannelStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      searchTerm: '',
      users: [],
      validated: false,
      channelId: this.props.channelId,
      filteredUsers: [],
    };
    this.KEYS_TO_FILTERS = ['user.name'];
    this.selectedUsers = [];
  }

  searchUpdated = term => {
    this.setState({ searchTerm: term });
  };

  componentDidMount() {
    this.getUsers();
  }

  saveAndContinue = e => {
    e.preventDefault();
    if (this.validateForm(e)) {
      this.AddUsersToChannel();
    } else {
      this.setState({
        validated: true,
      });
    }
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  selectAll = event => {
    const $form = document.querySelector('.channel-add-steps');
    const checkedBoxes = $form.querySelectorAll('input[name=usersId]');
    let setValue = false;
    if (event.currentTarget.checked) {
      setValue = true;
    }
    Array.from(checkedBoxes).map(checkbox => {
      checkbox.checked = setValue;
    });
  };

  validateForm = event => {
    const form = event.currentTarget;
    const checkedBoxes = form.querySelectorAll('input[name=usersId]:checked');
    if (checkedBoxes.length) {
      this.selectedUsers = Array.from(checkedBoxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
      return true;
    }
    return false;
  };

  getUsers = () => {
    getOtherUsersOfWorkspace(this.state.channelId)
      .then(response => {
        if (response.success) {
          this.setState({
            users: response.data.users,
            filteredUsers: response.data.users,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  AddUsersToChannel = () => {
    let payload = {
      usersId: this.selectedUsers,
      channelId: this.state.channelId,
    };
    addUsers2Channel(payload)
      .then(response => {
        if (response.success && response.data.status === 1) {
          toast.success('Success: Users have been added successfully!');
          // this.props.nextStep();
          this.goNext();
        } else {
          // this.setState({
          //   validated: true,
          // });
          toast.error(`ERROR: ${response.errors}`);
        }
      })
      .catch(error => {
        // this.setState({
        //   validated: true,
        // });
        toast.error(`ERROR: ${error}`);

      });
  };

  /**
   * filter users bu search
   * @param {event}
   */
  searchUsers = event => {
    let updatedList = this.state.users;
    updatedList = updatedList.filter(function (item) {
      return item.name && item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1;
    });
    this.setState({ filteredUsers: updatedList });
  };

  goNext = async () => {
    const channelInfo = await fetchChannelInformation(this.props.channelId);
    console.log('channle info', channelInfo);
    if (channelInfo.success && channelInfo.data.status == 1) {
      if (channelInfo.data.user.channel_type == 'RESTRICTED') {
        this.props.finalStep()
      }
    }
    this.props.nextStep();
  };

  render() {
    const { filteredUsers, validated } = this.state;
    console.log('channel add', this.props);
    return (
      <Form className="channel-add-steps" onSubmit={this.saveAndContinue}>
        <div>
          <ol className="cd-breadcrumb triangle">
            <li>
              <a href="#/step1">Step 1</a>
            </li>
            <li className="current">
              <a href="#/step2">Step 2</a>
            </li>
            <li>
              <a href="#/step3">Step 3</a>
            </li>
          </ol>
        </div>

        <Form.Group className="c-input__search">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search to add existing users"
              aria-describedby="userListSearch"
              onChange={this.searchUsers}
            />
            <InputGroup.Prepend>
              <InputGroup.Text id="userListSearch">
                <i className="fas fa-search" />
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
        </Form.Group>

        {validated && (
          <Form.Control.Feedback type="invalid" className="d-block mb-2">
            Please select any user
          </Form.Control.Feedback>
        )}

        <div className="c-channels-userslsit">
          <ul>
            <Scrollbars autoHeight autoHeightMin={200} autoHeightMax={360} hideTracksWhenNotNeeded={true}>
              {filteredUsers &&
                filteredUsers.map(user => (
                  <li key={user.id}>
                    <div className="row-user-item">
                      <div>
                        <Form.Check
                          custom
                          id={`add-user-${user.id}`}
                          value={user.id}
                          type="checkbox"
                          name="usersId"
                          label=""
                        />
                        <Avatar
                          as="span"
                          userid={user.id}
                          src={user.profile_image || `${API.AVATAR}?name=${user.username}&s=48`}
                          alt={user.name}
                          variant="small"
                          className="rounded-circle"
                        />
                        <span>{user.name || user.username}</span>
                      </div>
                    </div>
                  </li>
                ))}
            </Scrollbars>
          </ul>
        </div>

        <Form.Group className="channel-step2-footer">
          <Form.Check
            custom
            id="add-all-users"
            value="all"
            type="checkbox"
            name="selectall"
            label="Select All"
            onChange={e => {
              this.selectAll(e);
            }}
          />
          <div className="text-right">
            <Button variant="outline-primary" type="button" onClick={this.goNext} className="mr-2">
              Skip for now
            </Button>
            <Button variant="primary" type="submit">
              Done
            </Button>
          </div>
        </Form.Group>
      </Form>
    );
  }
}

export default ChannelStep2;
