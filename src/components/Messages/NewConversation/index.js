import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Modal, Container, Col, Row, Form, Button, Image, InputGroup } from 'react-bootstrap';
import { get as _get } from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import SuggestionOverlay from '../../Common/SuggestionOverlay/Index';

import { setSeletedRoomAction } from 'store/actions';
import {
  getNonSecretChannelsList,
  getAllUsers,
  getAllPublicChannels,
  searchUsersByName,
  searchChannelByName,
  searchUsersChannelByName,
} from 'store/api';

import { USERID, WORKSPACEID, generateProfileUrl, generateChannelUrl } from 'common/utils/helper';

import Avatar from 'components/Avatar';
import { getRelativeMessageURL, getRelativeChannelURL, getManageChannelsURL } from 'common/utils/messageHelpers';
import './index.scss';
import workspace from 'components/Signup/workspace';
import ChannelsAdd from 'components/Manage/Channels/ChannelsAdd';
import UsersInvites from 'components/Manage/Invite';
import { toast } from 'react-toastify';

class NewConversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: null,
      channelsList: null,
      showNewChannel: false,
      showInviteModal: false,
      show_close: false,
      searchTerm: '',
      workspaceId: WORKSPACEID(),
      showInputOverlay: false,
      showOnce: true
    };
    this.inviteType = 'employee';
    this.searchField = React.createRef();
  }



  handleNewChannelModal = () => {
    this.setState(prevState => ({
      showNewChannel: !prevState.showNewChannel,
    }));
    this.props.handleHide();
  };

  handleInviteModal = () => {
    this.setState(prevState => ({
      showInviteModal: !prevState.showInviteModal,
    }));
    this.props.handleHide();
  };

  async componentDidMount() {
    await this.handleInitialState();
    if(document.querySelector('input.form-control.form-control-lg')){
      document.querySelector('input.form-control.form-control-lg').focus();
    }
  }

  handleInitialState = async () => {
    const channels = await getAllPublicChannels();
    const users = await getAllUsers();
    if (channels) {
      if ( channels.data  && channels.data.status) {
        if (_get(channels.data, 'channels')) {
          const channelsList = channels.data.channels;
          this.setState({
            channelsList: channelsList,
          });
        }
      }
    }

    if (users) {
      if (users.data && users.data.status) {
        if (_get(users.data, 'users')) {
          const usersList = users.data.users;
          this.setState({
            usersList: usersList,
          });
        }
      }
    }
  }

  handleInviteUsers = r => {
    this.setState(
      {
        showInviteModal: false,
      },
      () => toast.success('SUCCESS: User has been invited successfuly!'),
    );
  };

  goTo = (event, userid, route) => {
    event.preventDefault();
    this.props.push(route);
    let _selectedUser = this.props.directUsers.filter(function (item) {
      return item._id === userid;
    });
    this.props.handleHide();
    this.props.setSeletedRoomAction({
      id: userid,
      user: _selectedUser[0],
    });
  };

  renderChannelsList = () => {
    getAllPublicChannels()
      .then(response => {
        if (response.success && response.data.status === 1) {
          this.setState({
            channelsList: response.data.channels,
          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };


  renderUsersList = () => {
    getAllUsers()
      .then(response => {
        if (response.success && response.data.status === 1) {
          this.setState({
            usersList: response.data.users,
          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };


  handleUserSearchEvent = e => {
    if (e.target.value === "") this.setState({ show_close: false });
    else this.setState({ show_close: true });
    console.log('testst', e.target.value);
    this.setState({ searchTerm: e.target.value });
  };

  handleChannelAndPeopleSearch = (e) => {
    const {showOnce} = this.state;
    if(showOnce){
      this.setState({showOnce: false});
    }
    this.handleUserSearch(e);
    this.handleChannelSearch(e);
  }

  handleUserSearch = async (e) => {
    console.log('search')
    e.preventDefault();
    if (this.state.searchTerm) {
      let payload = {
        workspaceId: this.state.workspaceId,
        searchTerm: this.state.searchTerm,
      };
      searchUsersByName(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            this.setState({
              usersList: response.data.users,
            });
          } else {
            toast.info(response.data.message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    } else {
      this.renderUsersList();

    }
  };



  handleChannelSearch = async (e) => {
    console.log('search')
    e.preventDefault();
    if (this.state.searchTerm) {
      let payload = {
        workspaceId: this.state.workspaceId,
        userId: USERID(),
        searchTerm: this.state.searchTerm,
      };
      searchUsersChannelByName(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            this.setState({
              channelsList: response.data.channels,
            });
          } else {
            toast.info(response.data.message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    } else {

      this.renderChannelsList();
    }
  };

  handleClose = () => {
    this.setState({ show_close: false }, () => {
      this.handleInitialState();
      document.querySelector('input.form-control.form-control-lg').value = '';
    })
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
    let channelsList = [];
    let usersList = [];
    const {showInputOverlay, showOnce} = this.state;

    document.onkeyup = function (e) {
      if(!document.querySelector('input.form-control.form-control-lg')) return;
      if (e.keyCode === 191) {
        document.querySelector('input.form-control.form-control-lg').focus();
      }
      if (e.keyCode === 27) {
        document.querySelector('input.form-control.form-control-lg').value = '';
        document.querySelector('input.form-control.form-control-lg').blur();
      }
    }

    if (this.state.channelsList) {
      this.state.channelsList.map((channel, i) => {
        channelsList.push(
          <li key={i}>
            <a
              href={getRelativeChannelURL(channel.id)}
              onClick={e => this.goTo(e, channel.id, getRelativeChannelURL(channel.id))}
            >
              <p style={generateChannelUrl(channel.colors)} >
                {channel.channel_type === 'PUBLIC' && '#'}
                {channel.channel_type === 'PRIVATE' && '🔒'}
                {channel.channel_type === 'RESTRICTED' && '🔒'}
              </p>
              {/* <Image
                src={generateChannelUrl(channel.colors)}
                alt="title"
                className="rounded-circle"
              /> */}
              <div>
                <span>{channel.name} </span>
                <span> {channel.description} </span>
              </div>
            </a>
          </li>,
        );
      });
    }

    if (this.state.usersList) {
      this.state.usersList.map((user, i) => {
        usersList.push(
          <li key={i}>
            <a
              href={getRelativeMessageURL(user.id)}
              onClick={e => this.goTo(e, user.id, getRelativeMessageURL(user.id))}
            >
              <Avatar
                as="span"
                userid={user.id}
                src={user.profile_image ? user.profile_image : generateProfileUrl(user.name ? user.name : user.username, user.profile_color)}
                alt={user.username}
                presenceShow={user.availability ? true : false}
                presenceStatus={user.availability}
                variant="small"
                className="rounded-circle"
              />
              <div>
                <span>{user.name || user.username}</span>
                {/* <span>{user["user_workspace_relationships"][0].Department}</span> */}
              </div>
            </a>
          </li>,
        );
      });
    }

    return (
      <div>
        <Modal  show={this.props.show} onHide={this.props.handleHide} aria-labelledby="js-new-conversation" dialogClassName="new-conversation-root">
          <Modal.Header closeButton>
            <Modal.Title id="js-new-conversation">New Conversation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="new-conversation">
              <Row>
                <Col>
                  <Form onSubmit={this.handleChannelAndPeopleSearch} className="c-input__search">
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                      <Col sm="10" style={{ position: 'relative' }} >
                        <InputGroup>
                        <Form.Control
                          className="new-conversation__input"
                          size="lg"
                          type="text"
                          placeholder="Find a channel or people to start a conversation"
                          onChange={this.handleUserSearchEvent} autoComplete="off"
                          onFocus={this.onFocus}
                          onBlur={this.onBlur}
                        />
                          <InputGroup.Prepend style={{background: 'white'}}>
                            <InputGroup.Text id="channelListSearch">
                              <i className="fas fa-search" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                        </InputGroup>
                        {/*{this.state.show_close && (
                          <span className="close" onClick={this.handleClose} >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd" />
                            </svg>
                          </span>
                        )}*/}
                        {showInputOverlay && showOnce && <SuggestionOverlay customClasses='new-conversation__suggestion-overlay' />}
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col as={Row}>
                  <Col sm="6">
                    <div className="new-conversation__channels">
                      <h6>
                        Channels{' '}
                        <span onClick={this.handleNewChannelModal}>
                          <i className="fas fa-plus"></i> Add a channel
                        </span>
                      </h6>
                      <Scrollbars style={{ width: 222, height: 320 }}>
                        <ul>{channelsList}</ul>
                      </Scrollbars>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="new-conversation__direct-msg">
                      <h6>
                        People{' '}
                        <span onClick={this.handleInviteModal}>
                          <i className="fas fa-plus"></i> Invite people
                        </span>
                      </h6>
                      <Scrollbars style={{ width: 225, height: 320 }}>
                        <ul>{usersList}</ul>
                      </Scrollbars>
                    </div>
                  </Col>
                </Col>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.showNewChannel} onHide={this.handleNewChannelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Adding Channel</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ChannelsAdd {...this.state} />
          </Modal.Body>
        </Modal>

        <Modal show={this.state.showInviteModal} onHide={this.handleInviteModal}>
          <Modal.Header closeButton>
            <Modal.Title>Invite</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UsersInvites {...this.state} variant={this.inviteType} callback={this.handleInviteUsers} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default connect(null, { push, setSeletedRoomAction })(NewConversation);
