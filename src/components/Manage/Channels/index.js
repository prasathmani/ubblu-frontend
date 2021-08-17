import './index.scss';

import { Button, Col, Container, Modal, Row, Table, Form, OverlayTrigger, Tooltip, InputGroup } from 'react-bootstrap';

import React, { Component } from 'react';
import { deleteChannel, getAllChannels, updateChannel, changeChannelType, searchChannelByName } from 'store/api';
import { find, get } from 'lodash';

import ChannelsAdd from './ChannelsAdd';
import ChannelsEdit from './channelsEdit';
import ChannelsUsersList from './channelsUsersList';
import { ConfirmDialog } from 'components/Common/confirmDialog';
import Loader from 'components/Common/loader';
import { WORKSPACEID } from 'common/utils/helper';
import SuggestionOverlay from '../../Common/SuggestionOverlay/Index';
import { toast } from 'react-toastify';


class Channels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      showInviteModal: false,
      showUsersList: false,
      showNewChannel: false,
      showEditChannelModal: false,
      channels: [],
      selectedChannel: null,
      searchTerm: '',
      deleteChannelId : '',
      showHideDeleteChannelModal: false,
      showHideBulkDeleteChannelModal: false,
      searchText: '',
      loading: true,
      showInputOverlay: false,
      showOnce: true
    };

    this.selectedChannel = null;
    this.selectedChannelChannelType = null;

  }

  componentDidMount() {
    this.renderChannelsList();
  }

  handleInviteModal = () => {
    this.setState(prevState => ({
      showInviteModal: !prevState.showInviteModal,
    }));
  };

  handleEditChannelModal = (id, dataId) => {
    let _channel = null;
    if (id) {
      _channel = find(this.state.channels, { id });
    }
    this.setState(prevState => ({
      showEditChannelModal: !prevState.showEditChannelModal,
      selectedChannel: _channel,
    }),()=>{
        if (dataId) {
            const el = document.querySelector(`[data-id=${dataId}]`);
            if(el){
                el.style.display = "block";
                el.style.background = "#edf2ff";
                setTimeout(() => {
                    el.style.display = "inherit";
                    el.style.background = "inherit";
                }, 3000);
            }
        }
    });
  };

  handleUsersListModal = (id, channelType) => {
    this.selectedChannel = id;
    this.selectedChannelChannelType = channelType;
    this.setState(prevState => ({
      showUsersList: !prevState.showUsersList,
    }));
  };

  handleNewChannelModal = () => {
    this.setState(prevState => ({
      showNewChannel: !prevState.showNewChannel,
    }));
  };

  handleEditChannel = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let payload = Object.fromEntries(formData),
      $submit_btn = e.target.editChannelBtn;
    if (payload) {
      $submit_btn.disabled = true;
      payload.workspaceId = this.state.workspaceId;
      console.log('payload for updating channel', payload);
      // payload.autoJoin = payload.autoJoin === 'false' ? false : payload.autoJoin;
      updateChannel(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: Channel has been updated successfuly!');
            this.setState(
              prevState => ({
                showEditChannelModal: !prevState.showEditChannelModal,
                selectedChannel: null,
              }),
              () => this.renderChannelsList(),
            );
          } else {
            $submit_btn.disabled = false;
            toast.error(get(response, 'errors[0]', 'ERROR: some error occurred try again!'));
          }
        })
        .catch(error => {
          $submit_btn.disabled = false;
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  renderChannelsList = () => {
    getAllChannels()
      .then(response => {
        if (response.success && response.data.status === 1) {
          this.setState({
            channels: response.data.channels,
            loading: false
          });
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleToggleChannelType = channelId => {
    changeChannelType(channelId)
      .then(response => {
        if (response.success && response.data.status === 1) {
          this.renderChannelsList();
        }
      })
      .catch(error => {
        toast.error('ERROR: some error occurred try again!');
      });
  };

  handleDeleteChannel = ()=> {
    const { deleteChannelId: id } = this.state;
    this.setState({showHideDeleteChannelModal: false});
    if (id) {
      deleteChannel({ channelId: [id] })
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: Channel has been deleted successfuly!');
            this.renderChannelsList();
          } else {
            toast.error(response.errors[0].message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };

  handleChannelSearchEvent = e => {
    this.setState({ searchTerm: e.target.value });
    if(e.target.value == ''){
      this.renderChannelsList();
    }
  };


  handleChannelSearch = async (e) => {
    const {showOnce} = this.state;
    if(showOnce){
      this.setState({showOnce: false});
    }
    e.preventDefault();
    if (this.state.searchTerm) {
      let payload = {
        workspaceId: this.state.workspaceId,
        searchTerm: this.state.searchTerm,
      };
      searchChannelByName(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            this.setState({
              channels: response.data.channels,
            });
          } else {
            toast.success(response.data.message);
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    } else {

      this.renderChannelsList();
    }
  };

  handleSelectAllRows = e => {
    const isSelected = e.currentTarget.checked;
    let _selectedRows = [];
    [...document.querySelectorAll('.manage-users__table .custom-control-input')].map(input => {
      if (isSelected) {
        input.checked = true;
        _selectedRows.push(input.value);
      } else {
        input.checked = false;
        _selectedRows = [];
      }
      return null;
    });
    this.manageSlectedRows(_selectedRows);
  };
  handleSelectRows = e => {
    let _selectedRows = [];
    [...document.querySelectorAll('.manage-users__table .custom-control-input:checked')].map(input => {
      _selectedRows.push(input.value);
    });
    this.manageSlectedRows(_selectedRows);
  };
  manageSlectedRows = _selectedRows => {
    if (_selectedRows.length) {
      if (this.state.channels.length) {
        this.setState({
          selectedRows: _selectedRows,
        });
      } else {

      }
    } else {
      this.setState({
        selectedRows: _selectedRows,
      });
    }
  };



  handleBulkDelete = e => {
    this.setState({showHideBulkDeleteChannelModal: false});
    if (this.state.selectedRows.length) {
        deleteChannel({ channelId: this.state.selectedRows })
          .then(response => {
            if (response.success && response.data.status === 1) {
              toast.success('SUCCESS: Channel has been deleted successfuly!');
              this.deSelectRows();
              this.setState(
                {
                  isFirstLoad: false,

                },
                () => this.renderChannelsList(),
              );
            } else {
              toast.error(response.errors[0].message);
            }
          })
          .catch(error => {
            toast.error('ERROR: some error occurred try again!');
          });
    }
  };

  deSelectRows = () => {
    [...document.querySelectorAll('.manage-users__table .custom-control-input:checked')].map(input => {
      // _selectedRows.push(input.value);
      input.checked = false;
    });
  }


  renderTooltip = (status, id) => {
    if (status == 'ADMIN') {
      return (
        <Tooltip id={id} >
          Manage Channel
        </Tooltip>
      );
    } else {
      return (
        <Tooltip id={id}>
          Sorry, you should be the Admin of this Channel to access this area
        </Tooltip>
      );
    }

  }

  handleDeleteChannelModal = (e, deleteChannelId)=> {
    this.setState(({ showHideDeleteChannelModal })=> ({
      showHideDeleteChannelModal: !showHideDeleteChannelModal,
      deleteChannelId
    }));
  }

  handleBulkDeleteChannelModal = ()=> {
    this.setState(({ showHideBulkDeleteChannelModal })=> ({
      showHideBulkDeleteChannelModal: !showHideBulkDeleteChannelModal,
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
    const { channels, selectedRows, showHideDeleteChannelModal, showHideBulkDeleteChannelModal, searchTerm, showInputOverlay, loading, showOnce } = this.state;
    return (
      <React.Fragment>
        <Container className="manage-channels">
          <Row>
            <Col className="row mt-4 mb-3">
              <Col className="col-6">
                <h3>Channels</h3>
              </Col>
              <Col className="col-6 text-right">
                <Button variant="primary" onClick={this.handleNewChannelModal}>
                  + Add New Channel
                </Button>
              </Col>
            </Col>
          </Row>
          <hr />
         
          <Row>
          <Col className="mt-2">
                <Form onSubmit={this.handleChannelSearch} autocomplete='off' >
                  <Form.Group as={Row} controlId="formPlaintextEmail" className="c-input__search">
                    <Col sm="6">
                      <InputGroup>
                      <Form.Control
                        size="lg"
                        type="text"
                        value={searchTerm}
                        placeholder="Find a channel"
                        onChange={this.handleChannelSearchEvent}
                        onFocus={this.onFocus} onBlur={this.onBlur}
                      />
                      <InputGroup.Prepend style={{background: 'white'}}>
                        <InputGroup.Text id="channelListSearch">
                          <i className="fas fa-search" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                        </InputGroup>
                      {showInputOverlay && showOnce && <SuggestionOverlay customClasses='suggestion-overlay' />}
                    </Col>
                    {/*<Col sm="2">
                      <Button variant="primary" size="lg" type="submit">
                        GO
                        </Button>
                    </Col>*/}
                  </Form.Group>
                </Form>
              </Col>
          </Row>

          {selectedRows && selectedRows.length ? (
            <Row>
              <Col className="row mt-2 mb-2 manage-users__actions">
                <Col>
                  <strong>Bulk Actions</strong>
                </Col>
                <Col className="text-right">
                  <Button variant="light" className="mr-2" onClick={this.handleBulkDeleteChannelModal}>
                    Delete
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
                    <tr className="br-top-2">
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
                      <th>Description</th>
                      <th>No. of users</th>
                      <th>Auto Join</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels ? (
                      channels.map(channel => (
                        <tr key={channel.id}>
                          <td>
                            <Form.Check
                              custom
                              id={`select-user-${channel.id}`} 
                              value={channel.id}
                              type="checkbox"
                              label=""
                              onClick={this.handleSelectRows}
                            />
                          </td>
                          <td><p className="channel-name">{channel.name}</p></td>
                          <td><p className="channel-desc">{channel.description}</p></td>
                          <td>
                            <a className='events-none' href="#/0">{channel.users_count}</a>
                          </td>
                          <td>
                            <label className="c-switch">
                              <input type="checkbox" className="primary" 
                              checked={channel.auto_join === 'NONE' ? false : true} 
                              onClick={() => this.handleEditChannelModal(channel.id, 'channel_auto_join')}
                              />
                              <span className="slider round" />
                            </label>
                          </td>
                          <td>
                            <a href={'#/' + channel.channel_type} onClick={() => this.handleEditChannelModal(channel.id,'channel_type')}>
                              {channel.channel_type == 'RESTRICTED' ? 'SECRET' : channel.channel_type}
                            </a>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="mr-1"
                              onClick={() => this.handleEditChannelModal(channel.id,'channel_type')}
                            >
                              Edit
                            </Button>
                            <OverlayTrigger
                              overlay={this.renderTooltip(channel.status, channel.id)}>
                              <span className="d-inline-block">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  disabled={channel.status == 'ADMIN' ? false : true}
                                  style={{ pointerEvents: (channel.status == 'ADMIN' ? 'initial' : 'none') }}
                                  onClick={() => this.handleUsersListModal(channel.id, channel.channel_type)}
                                >
                                  Manage
                            </Button>
                              </span>
                            </OverlayTrigger>

                            <Button
                              className="ml-1"
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>this.handleDeleteChannelModal(undefined, channel.id)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                        <tr>
                          <td colSpan="7" align="center">
                            <p>Get more things working as a group! Create a channel and do TEAM WORK together!</p>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </Table>
              </Col>
            </Col>
          </Row>

          <Modal show={this.state.showUsersList} onHide={this.handleUsersListModal}>
            <Modal.Header closeButton>
              <Modal.Title>Channel Users</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChannelsUsersList channel={this.selectedChannel} channelType={this.selectedChannelChannelType} refreshChannelsList={() => { this.renderChannelsList() }} />
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showEditChannelModal} onHide={this.handleEditChannelModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.selectedChannel && (
                <ChannelsEdit channel={this.state.selectedChannel} action={this.handleEditChannel} />
              )}
            </Modal.Body>
          </Modal>

          <Modal show={this.state.showNewChannel} onHide={this.handleNewChannelModal}>
            <Modal.Header closeButton>
              <Modal.Title>Adding Channel</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChannelsAdd renderChannelsList={() => { this.renderChannelsList() }} />
            </Modal.Body>
          </Modal>
          
          <ConfirmDialog
            show={showHideDeleteChannelModal}
            cancelModal={this.handleDeleteChannelModal}
            saveModal={this.handleDeleteChannel}
            title="Deleting Channel"
            message="Are you sure you want to delete the channel ?"
            variantYes="danger"
          />

          <ConfirmDialog
            show={showHideBulkDeleteChannelModal}
            cancelModal={this.handleBulkDeleteChannelModal}
            saveModal={this.handleBulkDelete}
            title="Deleting Channel"
            message="Are you sure you want to delete the selected channel ?"
            variantYes="danger"
          />

        </Container>
        {loading && <Loader />}
      </React.Fragment>
    );
  }
}

export default Channels;
