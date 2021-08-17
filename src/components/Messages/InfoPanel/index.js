import React, { Component } from 'react';
import { connect } from 'react-redux';
import { goBack } from 'connected-react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import { Button, Form, Modal, OverlayTrigger, Tooltip, Container, Col, Row, Image } from 'react-bootstrap';

import {
  fetchUserDetailsById,
  fetchChannelNotes,
  fetchSharedFiles,
  addChannelNotes,
  updateChannelNotes,
  fetchCommonChannelsBetweenUsers,
  fetchChannelInformation,
  unjoinChannel,
  getAllUsersByChannel,
  deleteNotes,
  removeNotes,
} from 'store/api';
import { getInboxUsersAction, setSeletedRoomAction } from 'store/actions';
import { textEllipsis } from 'common/utils';
import { ConfirmDialog } from 'components/Common/confirmDialog';

import _get from 'lodash/get';
import ChannelsUsersList from '../../Manage/Channels/channelsUsersList';
import { getRoomData } from 'common/utils/messageHelpers';

import { push } from 'connected-react-router';
import { ROUTES } from 'common/constants';

import Moment from 'react-moment';
import moment from 'moment';

import Avatar from 'components/Avatar';
import './index.scss';

import { generateProfileUrl, generateChannelUrl } from 'common/utils/helper';

import NoteListItem from './NotesListItem';

let details = null;
let notes = null;
let roomId = null;
let userId = null,
  MaxHeight = 0;

function setTimeZone(zone) {
  return zone || 'Asia/Kolkata';
}

export class InfoPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: null,
      commonChannelsList: null,
      sharedFilesList: null,
      showUsersList: false,
      showChannelUsers: false,
      selectedChannel: null,
      notes: null,
      newNote: null,
      otherUser: null,
      channelId: null,
      roomData: null,
      notesAdded: false,
      showNotes: false,
      channelsUsersList: [],
      defaultNote: 'My Note',
      editNoteId: null,
      showLeaveChannelModal: false,
      channelMember: false,
    };
    this.selectedChannel = null;
  }

  downloadFile = e => {
    console.log('downloadFile', e);
    // let _msgEditor = this.msgEditor.current;

    // this.setState(
    //   {
    //     isEditing: false,
    //     isDelete: false,
    //     isDownload: true,
    //     actionMenu: false,
    //     isToDo: false,
    //   },
    //   () => {
    //     evt.currentTarget.dataset.action = 'download-file';
    //     this.props.click(evt, _msgEditor, this.props);
    //   },
    // );
  };

  handleGoBack = e => {
    e.preventDefault();
    this.props.goBack();
  };

  deleteNote = async (noteId, closeToast) => {
    const channelid = _get(this.props, 'response.roomId.response.data.roomId', null);
    if (channelid) {
      const resp = await deleteNotes(channelid, noteId);
      if (resp.success) {
        toast.success('Note deleted!', {
          onOpen: this.updateNotes,
        });
      } else {
        toast.success('Error deleting note!');
        console.info('ERROR', resp);
      }
    }
    if (closeToast) {
      closeToast();
    }
  };

  removeNotes = async (noteId, closeToast) => {
    const channelid = _get(this.props, 'response.roomId.response.data.roomId', null);
    if (channelid) {
      const resp = await removeNotes(channelid, noteId);
      if (resp.success) {
        toast.success('Note deleted!', {
          onOpen: this.updateNotes,
        });
      } else {
        toast.success('Error deleting note!');
        console.info('ERROR', resp);
      }
    }
    if (closeToast) {
      closeToast();
    }
  };

  // removeNotes = async (noteId, closeToast) => {
  //   const channelid = _get(this.props, "response.roomId.response.data.roomId", null);
  //   if(channelid){
  //     const resp = await deleteNotes(channelid, noteId);
  //     if(resp.success){
  //       toast.info('Note removed!', {
  //         onOpen: this.updateNotes
  //       })
  //     } else {
  //       toast.info('Error removing note!');
  //       console.info('ERROR', resp);
  //     }
  //   }
  //   closeToast();
  // }

  updateNotes = async () => {
    const channelId = _get(this, 'props.response.roomId.response.data.roomId', null);
    const notesdata = await fetchChannelNotes(channelId);
    const stateCopy = this.state;
    stateCopy.notes = _get(notesdata, 'data.notes', []);
    this.setState({ ...stateCopy });
  };

  deletNoteNotification = (noteId, isDelete) => {
    if (isDelete) {
      const NotificationContent = ({ closeToast }) => (
        <div className="deletenote">
          <div className="deletenote__message">
            <p>Would you like to delete the note ?</p>
          </div>
          <div>
            <Button variant="danger" onClick={() => this.removeNotes(noteId, closeToast)}>
              Confirm
            </Button>
            <Button variant="light" onClick={closeToast}>
              Cancel
            </Button>
          </div>
        </div>
      );
      toast(NotificationContent, {
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
      });
    } else {
      this.deleteNote(noteId);
    }
  };

  removeNoteNotification = noteId => {
    const NotificationContent = ({ closeToast }) => (
      <div className="deletenote">
        <div className="deletenote__message">
          <p>Would you like to delete the note ?</p>
        </div>
        <div>
          <Button variant="danger" onClick={() => this.removeNotes(noteId, closeToast)}>
            Confirm
          </Button>
          <Button variant="light" onClick={closeToast}>
            Cancel
          </Button>
        </div>
      </div>
    );
    toast(NotificationContent, {
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
    });
  };

  handleUsersListModal = id => {
    this.selectedChannel = id;
    this.setState(prevState => ({
      showUsersList: !prevState.showUsersList,
    }));
  };

  leaveChannel = () => {
    if (this.state.channelId) {
      unjoinChannel(this.state.channelId)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: You have left the channel!');
            this.setState(
              {
                showLeaveChannelModal: !this.state.showLeaveChannelModal,
              },
              () => {
                this.props.push(ROUTES.LOGIN);
              },
            );
          }
        })
        .catch(error => {
          toast.error('ERROR: some error occurred try again!');
        });
    }
  };
  openChannelUsers = () => {
    this.setState({ showChannelUsers: true });
  };

  // handleChannelUsersModal = id => {
  //   this.selectedChannel = id;
  //   this.setState(prevState => ({
  //     showChannelUsers: !prevState.showChannelUsers,
  //   }));
  // };

  saveNote = async () => {
    console.log('note saved', this.state.newNote, roomId);
    let newNote;
    if (this.state.newNote && roomId) {
      if (this.state.editNoteId != null) {
        newNote = await updateChannelNotes({
          channelId: roomId,
          id: this.state.editNoteId,
          notes: this.state.newNote,
          deleted: false,
        });
        this.setState({
          editNoteId: null,
          showNotes: false,
        });
      } else {
        newNote = await addChannelNotes({
          channelId: roomId,
          notes: this.state.newNote,
        });
      }
      console.log('new note', newNote);
      if (newNote.success) {
        const _selectedRoomId = this.props.response.roomId.response;
        if (_selectedRoomId) {
          roomId = _selectedRoomId.data.roomId;
          const channelNotes = await fetchChannelNotes(roomId);
          console.log('channel notes', channelNotes);
          if (channelNotes.success) {
            if (_get(channelNotes.data, 'notes')) {
              notes = channelNotes.data.notes;
              this.setState({
                notes,
                showNotes: false,
              });
              console.log('channel notes  object', notes);
            }
          }
        }
      }
    }
  };

  writeNote = text => {
    console.log('write note', text);
    this.setState({
      newNote: text,
    });
  };

  async componentDidMount() {
    console.log('room id check', this.props.response);

    const roomData = getRoomData();
    console.log('room data', roomData);
    if (roomData.roomType == 'messages') {
      this.setState({
        otherUser: roomData.roomId,
        roomData: roomData,
        channelId: null,
        channelMember: true,
      });
    }
    if (roomData.roomType == 'channels') {
      this.setState({
        channelId: roomData.roomId,
        roomData: roomData,
      });
      const usersList = await getAllUsersByChannel({ channelId: roomData.roomId });
      console.log('users list in a channel', usersList);
      if (usersList.success && usersList.data.status) {
        this.setState({
          channelsUsersList: usersList.data.users,
        });
      }
    }

    if (this.props.response.roomStore.hasOwnProperty('response')) {
      const _selectedRoom = this.props.response.roomStore.response;
      let userData;
      if (_selectedRoom) {
        userId = _selectedRoom.payload.data.id;
        if (roomData.roomType == 'messages') {
          userData = await fetchUserDetailsById(userId);
        }
        if (roomData.roomType == 'channels') {
          userData = await fetchChannelInformation(roomData.roomId);
        }
        console.log('user details in info', userData);
        if (userData.success) {
          if (_get(userData.data, 'user')) {
            details = userData.data.user;

            this.setState({
              details,
              channelMember: details.status === null ? false : true,
            });
            if (details.status == null && roomData.roomType == 'channels') {
              return;
            }
            console.log('user details object', details);
          }
        }

        if (!this.state.channelId) {
          console.log('channel ?', this.state.channelId);

          const commonChannels = await fetchCommonChannelsBetweenUsers(userId);
          console.log('Common Channels BetweenUsers', commonChannels);
          if (commonChannels.success) {
            if (_get(commonChannels.data, 'channels')) {
              const commonChannelsList = commonChannels.data.channels;
              this.setState({
                commonChannelsList,
              });
              console.log('commonChannelsList  array', commonChannelsList);
            }
          }
        }

        if (this.props.response.roomId.hasOwnProperty('response')) {
          const _selectedRoomId = this.props.response.roomId.response;
          if (_selectedRoomId) {
            roomId = _selectedRoomId.data.roomId;
            const sharedFiles = await fetchSharedFiles(roomId);
            if (sharedFiles.success) {
              if (_get(sharedFiles.data, 'files')) {
                const sharedFilesList = sharedFiles.data.files;
                this.setState({
                  sharedFilesList,
                });
                console.log('sharedFilesList  array', sharedFilesList);
              }
            }

            console.log('room id notes', roomId);
            // call the fetch channel notes api
            const channelNotes = await fetchChannelNotes(roomId);
            console.log('channel notes', channelNotes);
            if (channelNotes.success) {
              if (_get(channelNotes.data, 'notes')) {
                notes = channelNotes.data.notes;
                this.setState({
                  notes,
                });
                console.log('channel notes  object', notes);
              }
            }
          }
        }
      }
    }

    //scroll to section
    if (window.location.hash) {
      var element = document.querySelector(window.location.hash);

      // smooth scroll to element and align it at the bottom
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }

  handleShowNotes = () => {
    this.setState(prevState => ({
      showNotes: !prevState.showNotes,
    }));
  };

  editNotes = async (note, id, isDelete) => {
    console.log('edit', isDelete);
    let newNote;
    if (isDelete && roomId) {
      newNote = await updateChannelNotes({
        channelId: roomId,
        id: id,
        notes: note,
        deleted: false,
      });
      this.setState({
        editNoteId: null,
        showNotes: false,
      });

      if (newNote.success) {
        const _selectedRoomId = this.props.response.roomId.response;
        if (_selectedRoomId) {
          roomId = _selectedRoomId.data.roomId;
          const channelNotes = await fetchChannelNotes(roomId);
          console.log('channel notes', channelNotes);
          if (channelNotes.success) {
            if (_get(channelNotes.data, 'notes')) {
              notes = channelNotes.data.notes;
              this.setState({
                notes,
                showNotes: false,
              });
              console.log('channel notes  object', notes);
            }
          }
        }
      }
    } else {
      this.setState({
        showNotes: true,
        defaultNote: note,
        editNoteId: id,
      });
    }
  };

  renderProfileImage = () => {
    const { username, name, colors, profile_color, timezone } = this.state.details;
    const headName = username ? `@${username}` : name;
    let content = (
      <div className="head-title">
        <Avatar
          userid={details.id}
          src={generateProfileUrl(name ? name : username, profile_color)}
          alt={this.state.details.username}
          className="rounded-circle"
        />
        <span className="head-name">{headName}</span>
        {!this.state.channelId && this.state.details['user_workspace_relationships'][0].Department && (
          <span className="head-name description">
            {this.state.details['user_workspace_relationships'][0].Department.name}
          </span>
        )}
        <span className="head-name description">
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-localtime`}>User's Local Time</Tooltip>}>
            <span>{moment().tz(setTimeZone(timezone)).format('h:mm a')}</span>
          </OverlayTrigger>
        </span>
      </div>
    );
    if (this.state.details.channel_type) {
      const { channel_type, description } = this.state.details;
      console.info('CHANNELTYPE', channel_type);
      content = (
        <div className="head-title">
          <p className="channel__avatar" style={generateChannelUrl(colors)}>
            {channel_type === 'PUBLIC' && '#'}
            {channel_type === 'PRIVATE' && '🔒'}
            {channel_type === 'RESTRICTED' && '🔒'}
          </p>
          <span className="head-name">{this.state.details.username || this.state.details.name}</span>
          {description && <span className="head-name description">{description}</span>}
          {!this.state.channelId && this.state.details['user_workspace_relationships'][0].Department && (
            <span className="head-name description">
              {this.state.details['user_workspace_relationships'][0].Department.name}
            </span>
          )}
        </div>
      );
    }
    return content;
  };

  handleLeaveChannelModal = id => {
    this.selectedChannel = id;
    this.setState(prevState => ({
      showLeaveChannelModal: !prevState.showLeaveChannelModal,
    }));
  };
  downloadAttachment = attachment => {
    fetch(attachment)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      )
      .then(dataUrl => {
        // console.log('RESULT:', dataUrl) // will return base64 string
        var anchor = document.createElement('a');
        anchor.download = attachment.substring(attachment.lastIndexOf('/') + 1); // give any file name here
        anchor.href = dataUrl;
        anchor.click();
      });
  };

  scrollToElement = e => {
    const dataId = e.currentTarget.getAttribute('data-id');
    if (dataId) {
      const element = document.querySelector(`[data-id="${dataId}"]`);
      element.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        element.style.opacity = 0.5;
        setTimeout(() => (element.style.opacity = 1), 500);
      }, 200);
    }
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { response: { infoPanel: { shouldRe_fetchNotes } = {} } = {} } = this.props;
    const { response: { infoPanel: { shouldRe_fetchNotes: prev_shouldRe_fetchNotes } = {} } = {} } = prevProps;
    if (shouldRe_fetchNotes && !prev_shouldRe_fetchNotes) {
      this.updateNotes();
    }
  }

  render() {
    MaxHeight = window.innerHeight - 180;
    let notesArray = [],
      deletedNotesArray = [];
    let commonChannelsArray = [];
    let sharedFilesArray = [];
    let channelsUsersArray = [];
    //let ManageUsersArray = [];

    if (this.state.notes) {
      this.state.notes.map(note => {
        if (note.deleted)
          deletedNotesArray.push(
            <NoteListItem deletNoteNotification={this.deletNoteNotification} note={note} editNotes={this.editNotes} />,
          );
        else
          notesArray.push(
            <NoteListItem deletNoteNotification={this.deletNoteNotification} note={note} editNotes={this.editNotes} />,
          );
      });
    }

    if (this.state.commonChannelsList) {
      this.state.commonChannelsList.map(channel => {
        commonChannelsArray.push(
          <li>
            <div className="channel-list__item">
              <a href="/#/channel-68">
                {console.info('CHANNELDATA', channel, generateChannelUrl(channel.colors))}
                <p className="channel__avatar" style={generateChannelUrl(channel.colors)}>
                  {channel.channel_type === 'PUBLIC' && '#'}
                  {channel.channel_type === 'PRIVATE' && '🔒'}
                  {channel.channel_type === 'RESTRICTED' && '🔒'}
                </p>
                <p className="channel__name">{channel.name}</p>
              </a>
              {/* <span>
                <i className="channel-list-lbl channel-list-lbl--active">Admin</i>
                <i className="far fa-trash-alt" />
              </span> */}
            </div>
          </li>,
        );
      });
    }

    if (this.state.sharedFilesList) {
      console.log('file name', this.state.sharedFilesList);

      this.state.sharedFilesList.map(file => {
        sharedFilesArray.push(
          <li className="file-list-item">
            <a href="#/files">
              <div className="filename-wrapper">
                <i className="fas fa-paperclip" />
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-fileName`}>{`${file.file_upload_details['name']}${file.file_upload_details[
                      'fileName'
                    ].substring(file.file_upload_details['fileName'].lastIndexOf('.'))}`}</Tooltip>
                  }
                >
                  {/* <span className="filename">{file.file_upload_details['fileName']} </span> */}
                  <span className="filename">{`${
                    file.file_upload_details['name'].length > 10
                      ? `${file.file_upload_details['name'].substring(0, 10)}..`
                      : file.file_upload_details['name']
                  }${file.file_upload_details['fileName'].substring(
                    file.file_upload_details['fileName'].lastIndexOf('.'),
                  )}`}</span>
                </OverlayTrigger>
                {/* ${file.file_upload_details['fileName'].substring(file.file_upload_details['fileName'].lastIndexOf('.'))} */}

                <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-username`}>{file.name}</Tooltip>}>
                  <span className="username" style={{ color: '#1270a2' }}>
                    {file.username}
                  </span>
                </OverlayTrigger>

                {/* <span className="username" style={{color: "#1270a2"}} >{file.username}</span> */}
                {/* <span className="timestamp">15:03 PM</span>     */}
                <span className="timestamp">
                  {moment().format('MM-DD-YYYY') === moment(file.created_at).format('MM-DD-YYYY')
                    ? moment(file.created_at).format('HH:mm')
                    : moment(file.created_at).format('MM/DD/YYYY')}
                </span>
              </div>
              <span className="icon-wrapper">
                <i
                  className="far fa-arrow-alt-circle-down"
                  title="download"
                  onClick={() => this.downloadAttachment(file.file_upload_details.thumbnailLink)}
                />
                <i className="fas fa-share-alt ml-2" title="Share" />
                <i
                  className="fas fa-chevron-right ml-2"
                  title="Go to Message"
                  onClick={evt => this.downloadFile(evt)}
                />
              </span>
            </a>
          </li>,
        );
      });
    }

    if (this.state.channelsUsersList.length) {
      this.state.channelsUsersList.map(user => {
        channelsUsersArray.push(
          <li>
            <div className="channel-list__item">
              <a href="/#/channel-68">
                <img
                  src={generateProfileUrl(user.name ? user.name : user.username, user.profile_color)}
                  className="rounded-circle"
                  alt="title"
                />
                <span>{user.username}</span>
              </a>
            </div>
          </li>,
        );
      });
    }
    // if (this.state.channelsUsersList.length) {
    //   this.state.channelsUsersList.map(user => {
    //     ManageUsersArray.push(
    //       <li>
    //         <div className="c-inbox__chatItem--msg">

    //           <div className="c-inbox__head">
    //           {/* <RenderAvatar /> */}
    //             <img src={generateProfileUrl(user.name ? user.name: user.username, user.profile_color)} className="rounded-circle" alt="title" />
    //             <div className="c-inbox--username"><span>{user.username}</span></div>
    //             <div className="c-inbox__action"><span style={{color: "#1270a2",fontWeight:"400",marginRight: "30px","fontSize": "large"  }}>Add <i className="fas fa-user-plus"/></span></div>
    //           </div>
    //         </div>
    //       </li>,
    //     );
    //   });
    // }
    // style={{display: "none"}}
    return (
      <div className={`c-info-panel ${this.props.className}`}>
        <div className="c-info-panel__header">
          <div className="go-back" onClick={this.handleGoBack}>
            <i className="far fa-times-circle"></i>
          </div>
          {this.state.details && this.renderProfileImage()}
        </div>
        <div style={{ display: this.state.channelMember ? 'block' : 'none' }}>
          <div className="c-info-panel__body">
            <div className="files-list" id="FileShared">
              <div className="files-list__title">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-fileshared`}>File shared in this conversation</Tooltip>}
                >
                  <span className="files-list__cursor" data-id="file_shared" onClick={this.scrollToElement}>
                    File Shared
                  </span>
                </OverlayTrigger>
              </div>

              {!this.state.sharedFilesList && (
                <div>
                  <p className="opacity-7">
                    Nothing to show! No files yet. Upload a file from the message area and it'll apear here!
                  </p>
                </div>
              )}
              <ul>{sharedFilesArray}</ul>
            </div>

            <div className="notes-sction">
              <div className="notes-sction__title">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-fileshared`}>
                      Click to Edit
                      <br /> Visible to everyone in this conversation
                    </Tooltip>
                  }
                >
                  <span className="notes-sction__cursor" data-id="notes" onClick={this.scrollToElement}>
                    Todo{' '}
                  </span>
                </OverlayTrigger>
                <OverlayTrigger placement="right" overlay={<Tooltip id={`tooltip-notes`}>Add new notes</Tooltip>}>
                  <i className="far fa-plus-square" onClick={this.handleShowNotes}></i>
                </OverlayTrigger>
              </div>
              <div className="notes-sction__body" id="Notes">
                <ul className="notes-list">
                  {this.state.showNotes && (
                    <li>
                      <div className="notes-wrapper">
                        <div
                          className="notes-sction__body--editor"
                          style={{
                            display: this.state.channelId
                              ? this.state.details && this.state.details.status === 'ADMIN'
                                ? 'block'
                                : 'none'
                              : 'block',
                          }}
                        >
                          <textarea
                            defaultValue={this.state.defaultNote}
                            className="form-control"
                            rows="3"
                            cols="30"
                            onChange={e => {
                              this.writeNote(e.target.value);
                            }}
                          />
                          <div className="notes-icon-wrapper">
                            <span>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-notes-save`}>Save</Tooltip>}
                              >
                                <i
                                  className="far fa-check-circle"
                                  onClick={() => {
                                    this.saveNote();
                                  }}
                                />
                              </OverlayTrigger>
                            </span>
                            <span>
                              <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip id={`tooltip-Notes-close`}>Close</Tooltip>}
                              >
                                <i className="far fa-times-circle" onClick={this.handleShowNotes} />
                              </OverlayTrigger>
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  {!notesArray && (
                    <p className="opacity-7">Hmm..Looks like there isn't something in common between you two.</p>
                  )}
                  <div>
                    {notesArray}
                    {!deletedNotesArray && <p className="opacity-7">Get Started with completing your tasks.</p>}
                  </div>
                  <hr />
                  <div className="">{deletedNotesArray}</div>
                </ul>
              </div>
            </div>

            <div className="channel-list" style={{ display: this.state.channelId ? 'none' : 'block' }}>
              <div className="channel-list__title" data-id="common_channels" onClick={this.scrollToElement}>
                Common Channels
              </div>

              <div>
                {!commonChannelsArray && <p className="opacity-7">No common channel found!</p>}
                <ul>{commonChannelsArray}</ul>
              </div>
            </div>

            {this.state.channelId ? (
              <div className="channel-list">
                <div className="channel-list__title">
                  <span data-id="channel_users" onClick={this.scrollToElement}>
                    Channel Users{' '}
                  </span>
                  <OverlayTrigger placement="top" overlay={<Tooltip id="manage_users">Manage Users</Tooltip>}>
                    <i className="far fa-edit" onClick={() => this.handleUsersListModal(this.state.channelId)}></i>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip id="leave_channel">Leave Channel</Tooltip>}>
                    <i
                      onClick={() => this.leaveChannel(this.state.channelId)}
                      className="channel-list__title__leave-channel fa fa-sign-out-alt"
                      aria-hidden="true"
                    ></i>
                  </OverlayTrigger>
                </div>
                <div>
                  <ul>{channelsUsersArray}</ul>
                </div>
              </div>
            ) : null}

            {this.state.channelId ? (
              <div className="text-center mt-3">
                {/* <Button variant="primary" size="sm">
                Invite to Channel{' '}
              </Button>{' '} */}
                {/* <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => this.handleUsersListModal(this.state.channelId)}
                >
                  {this.state.details && this.state.details.status == 'ADMIN' ? ' Manage User' : 'Channel Users'}
                </Button>{' '} */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => this.handleLeaveChannelModal(this.state.channelId)}
                >
                  Leave Channel
                </Button>
              </div>
            ) : null}

            <Modal show={this.state.showUsersList} onHide={this.handleUsersListModal}>
              <Modal.Header closeButton>
                <Modal.Title>Channel Users</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ChannelsUsersList
                  channel={this.state.channelId}
                  channelType={
                    this.state.details && this.state.details.channel_type ? this.state.details.channel_type : null
                  }
                />
              </Modal.Body>
            </Modal>

            <Modal show={this.state.showLeaveChannelModal} onHide={this.handleLeaveChannelModal} centered>
              <Modal.Header closeButton>
                <Modal.Title>Leave Channel</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to leave this channel?</Modal.Body>
              <Modal.Footer>
                <Button variant="outline-secondary" onClick={this.handleLeaveChannelModal}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={this.leaveChannel}>
                  Leave
                </Button>
              </Modal.Footer>
            </Modal>

            {/*  <Modal  show={this.state.showChannelUsers} onHide={this.handleChannelUsersModal} aria-labelledby="js-new-conversation">
          <Modal.Header closeButton>
            <Modal.Title id="js-new-conversation">Channel Users</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container className="new-conversation">
              <Row className="c-inbox__search">
                <Col className="c-inbox__search--wrapper">
               
                  <Form className="c-inbox__search--group">
                    <Form.Group as={Row} controlId="formPlaintextEmail">
                      <Col sm="10">
                        <Form.Control   size="lg" type="search" className="form-control c-inbox__search--bar"  placeholder="Search add user"  />
                      </Col>
                      <Col sm="2">
                      <span className="input-group-addon">
                        <button type="button">
                          <i className="fa fa-search" aria-hidden="true" />
                        </button>
                      </span>
                      </Col>
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col>          

                      <div className="new-conversation__channels">                                                              
                        <h6>
                          Channels         
                            <Button variant="link"  onClick={this.handleNewChannelModal} style={{ textDecoration: 'none',fontSize:'0.8rem',fontWeight: '500' }}> 
                            <i className="fas fa-plus"></i>Add a channel                     
                            </Button>                             
                          </h6>                                 
                  
                  <Scrollbars style={{ height: 320 }}>
                          <ul>
                            {ManageUsersArray}
                          </ul>
                 </Scrollbars>
                       
                      </div>
                </Col>
              </Row>
            
            </Container>
          </Modal.Body>
        </Modal>  */}
          </div>
        </div>
      </div>
    );
  }
}

InfoPanel.defaultProps = {
  top: null,
  center: null,
  bottom: null,
  type: 'dark',
};
// const RenderAvatar = () => (
//   <div className="c-inbox__chatItem--avatar">
//     {
//       ManageUsersArray.channel ? (
//         <p className="channel__avatar" style={generateChannelUrl(user.colors)} >
//           {(ManageUsersArray.channelType || ManageUsersArray.channel_type) === 'PUBLIC' && '#'}
//           {(ManageUsersArray.channelType || ManageUsersArray.channel_type) === 'PRIVATE' && '🔒'}
//           {(ManageUsersArray.channelType || ManageUsersArray.channel_type) === 'RESTRICTED' && '🔒'}
//         </p>
//       ) : (
//         <Avatar
//         // userid={props.otherUser.id}
//         src={generateProfileUrl(ManageUsersArray.name || ManageUsersArray.username, ManageUsersArray.colors)}
//         alt={ManageUsersArray.username}
//         presenceShow={ManageUsersArray.availability ? true : false}
//         presenceStatus={ManageUsersArray.availability}
//         variant="small"
//         className="rounded"
//       />
//         )
//     }
//   </div>
// )
const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, { goBack, getInboxUsersAction, push })(InfoPanel);
