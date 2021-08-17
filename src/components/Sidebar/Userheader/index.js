import './index.scss';

import { Dropdown, Image, Modal } from 'react-bootstrap';
import React, { Component } from 'react';
import get from 'lodash/get';

import { NavLink } from 'react-router-dom';
import { ROUTES } from 'common/constants';
import { textEllipsis, isDesktopApp } from 'common/utils';
import {
  getExceptionlist,
  updateExceptionlist,
  fetchChannelsForUser,
  createMutedConversations,
  getMyDetails,
} from 'store/api';
import { USERID, WORKSPACEID, generateProfileUrl } from 'common/utils/helper';

// import WorkspaceMap from './workspaceMap';

import ExceptionList from 'components/Sidebar/ExceptionList';
import { toast } from 'react-toastify';

class Userheader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channelsList: [],
      availability: true,
      list: { channelIds: [], userIds: [] },
      profileUrl: '',
    };
    this.getProfileImage();
    this.updateExceptionList();
  }

  async componentDidMount() {
    const userId = USERID();
    let channelsList = await fetchChannelsForUser(userId);
    if (channelsList) {
      if (channelsList.success) {
        channelsList = channelsList.data.channels;
        this.setState({
          channelsList,
        });
      }
    }
  }
  z;
  updateExceptionList = () => {
    const userIds = [],
      channelIds = [];
    getExceptionlist()
      .then(res => {
        const list = get(res, 'data.list', []);
        list.map(l => {
          if (l.userid) userIds.push(l.userid);
          if (l.channelid) channelIds.push(l.channelid);
          return null;
        });
        this.setState({ list: { userIds, channelIds } });
      })
      .catch(err => alert(err));
  };

  saveExceptionList = async (list, cb) => {
    await updateExceptionlist(list);
    toast.success('Updated Exception List...');
    if (cb) cb();
    await createMutedConversations({
      userId: USERID(),
      // channelId: channelsList,
    });
    this.updateExceptionList();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && nextProps.user.user.user_workspace_relationships) {
      this.setState({
        availability: nextProps.user.user.user_workspace_relationships[0]['availability'],
      });
    }
  }

  handleAvailability = async () => {
    this.props.handleAvailability();
    await updateExceptionlist({
      userIds: [],
      channelIds: [],
    });
    this.updateExceptionList();
    this.setState(prevState => ({
      availability: !prevState.availability,
    }));
  };

  getProfileImage = () => {
    const { user } = this.props.user;
    if (user.profile_image) this.setState({ profileUrl: user.profile_image });
    else {
      getMyDetails()
        .then(data => {
          const userdata = get(data, 'data.user', {});
          const profileUrl = generateProfileUrl(
            userdata.name ? userdata.name : userdata.username,
            userdata.profile_color,
          );
          this.setState({ profileUrl });
        })
        .catch(err => {
          console.info('ERROR', err);
        });
    }
  };

  render() {
    const { user, workspace, showWorkspaceMap } = this.props.user;
    const { availability } = this.state;
    const workspaceName = get(user, 'user_workspace_relationships[0].workspace.name', '');

    if (showWorkspaceMap === false) {
      return (
        <Modal show={true} onHide={this.handleModelClose}>
          <Modal.Header closeButton>
            <Modal.Title>Select your workspace</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're not mapped into any workspace !!</Modal.Body>
        </Modal>
      );
    }

    //user popup
    const _tmpl = user => {
      let _name = user.name || user.username;
      return user ? (
        <div className="sidebar__userheader--workspace">
          <Dropdown id="js-workspace-actions" data-wid={user.id} title={textEllipsis(_name, 6)} size="sm">
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              <div className="sidebar__userheader--avatar">
                <Image src={this.state.profileUrl} alt={user.username} />
              </div>
              <span className="sidebar__userheader--username">{textEllipsis(_name, 6)}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href={ROUTES.MANAGE_PROFILE} className="c-user">
                <img
                  alt={user.username}
                  src={this.state.profileUrl}
                  className="c-user__avatar rounded"
                  role="presentation"
                />
                <span className="c-user__display-name overflow-ellipsis">{_name}</span>
                <span className="c-user__name overflow-ellipsis text-muted">@{user.username}</span>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href={ROUTES.MANAGE_PROFILE}>Profile</Dropdown.Item>
              <Dropdown.Item href={ROUTES.HELP}>Help</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href={ROUTES.MANAGE_WORKSPACE}>
                <div>
                  <strong className="text-capitalize">{workspace.name}</strong>
                </div>
                <div className="text-muted">ubblu.com/{workspaceName}</div>
                <div className="text-muted">Your workspace is currently on beta version</div>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href={ROUTES.LOGOUT}>Sign out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : (
        ''
      );
    };

    return (
      <div className={availability ? 'sidebar__userheader' : 'sidebar__userheader inactive'}>
        {user && showWorkspaceMap && _tmpl(user)}

        <div className="sidebar__userheader--toggle_status">
          <div className="sidebar__userheader--status">
            {availability ? 'Available' : 'Do Not Disturb'}
            {isDesktopApp && (
              <div className="sidebar__userheader--exception_list">
                <ExceptionList
                  channelsList={this.state.channelsList}
                  list={this.state.list}
                  saveExceptionList={this.saveExceptionList}
                />
              </div>
            )}
          </div>
          <label className={availability ? 'toogle-switch' : 'toogle-switch inactive'}>
            <input
              type="checkbox"
              name="toggleStatus"
              // defaultChecked={availability}
              // value={availability}
              checked={this.state.availability}
              onChange={this.handleAvailability}
              aria-label="toggle status"
            />
            <span className="toogle-slider" />
          </label>
        </div>
        {!isDesktopApp && (
          <div className="sidebar__userheader--exception_list">
            <ExceptionList
              channelsList={this.state.channelsList}
              list={this.state.list}
              saveExceptionList={this.saveExceptionList}
            />
          </div>
        )}
      </div>
    );
  }
}

export default React.memo(Userheader);
