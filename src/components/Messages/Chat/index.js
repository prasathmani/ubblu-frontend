import './index.scss';

import React, { Component } from 'react';
import {
  sendMessageAction,
  setSeletedRoomAction,
  getSearchResultsAction,
  setSeletedRoomRoomIdAction,
  setScreen,
  getInboxUsersAction,
  clearInboxUsersAction,
  re_fetchNotes,
} from 'store/actions';

import { getAllUsersByChannel, triggerNotification } from 'store/api/index';

import ChatHeadInfo from './ChatHeader';
import ChatInput from './ChatInput';
import ChatItem from './ChatItem';
import ChatTools from './Tools';
import PinConversation from 'components/Messages/PinConversation';
import Loader from 'components/Common/loader';
import { Scrollbars } from 'react-custom-scrollbars';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import { API } from 'common/constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { format_message, getRoomData } from 'common/utils/messageHelpers';
import { push } from 'connected-react-router';
import { setContenteditFocus, isDesktopApp, getURLParameter } from 'common/utils';
import { getRelativeMessageURL, getRelativeChannelURL } from 'common/utils/messageHelpers';
import { toast } from 'react-toastify';

import {
  getConversationHistory,
  changeReadStatus,
  downloadFile,
  fetchUserDetailsById,
  fetchChannelInformation,
  fetchChannelRoleForUser,
  addChannelNotes,
  joinChannelViaInvite,
  toggleUserOnlineStatus,
  createMutedConversations,
} from 'store/api';
import io from 'socket.io-client';
import moment from 'moment';
import { debounce, get as _get, map, uniq } from 'lodash';
import Alert from 'react-bootstrap/Alert';

//const SOCKET_URI = API.DEV_BASE_BACKEND_URL;
const SOCKET_URI = API.DEV_SOCKET_URL;
// const SOCKET_URI = API.SOCKET_URL;

const removeDeletedMessages = (data = [], deletedMsgId) => {
  return data.filter(({ deleted, id }) => {
    if (id == deletedMsgId) deleted = true;
    return !deleted;
  });
};
const getNotificationPayload = ({ title, body, icon, data }) => ({
  username: title,
  data,
  notification: {
    title,
    body,
    icon: icon ? icon : undefined,
  },
});

class ChatMaster extends Component {
  socket = null;
  constructor(props) {  
    super(props);
    this.state = {
      activeChat: null,
      selectedRoom: null,
      curentRoomData: null,
      conversationHistory: null,
      messages: null,
      pinMessage: null,
      receiverId: null,
      sessionUserId: USERID(),
      workspaceId: WORKSPACEID(),
      otherUser: null,
      isPinned: false,
      pinnedAt: null,
      isUpdated: false,
      roomId: undefined,
      channelId: null,
      roomData: {},
      muted: false,
      details: undefined,
      channelRole: null,
      inviteLink: null,
      disabled: false,
      isTagged: false,
      notAMember: false,
      channel_users_firebase_ids: [],
    };

    this.users = null;
    this.messages = [];
    this.minHeight = 340;
    this.maxHeight = 340;
    this.rawConversation = [];

    this.actionMenu = React.createRef();
  }

  /**
   * on click on user icon take to user details page
   * @param {event}
   */
  handleHeadDeatils = e => {
    e.preventDefault();
    const location = window.location.href;
    if (location.indexOf('/details/') === -1) {
      this.props.push('details/');
    }
  };

  /**
   * On send message
   * @param {event}
   */
  handleSendMessage = e => {
    e.preventDefault();
    console.log('isTagged', this.refs);
    console.log('data', this.refs.chatInput.state.value);
    console.log('mentions', this.refs.chatInput.state.mentionData.mentions);
    console.log('Tagged_id', this.refs.chatInput.state.tagged_id);

    //const isTagged = _get(this.refs, "chatInput.state.mentionData.mentions", []).length > 1;
    const isTagged = this.refs.chatInput.state.mentionData ? this.refs.chatInput.state.mentionData.mentions : false;
    console.log('isTagged', isTagged);
    // const isQuoted =
    this.addMessage(this.refs.chatInput.state.value, e, isTagged, this.refs.chatInput.state.tagged_id);
    this.refs.chatInput.state.tagged_id = [];
    this.refs.chatInput.resetInput();
  };

  /**
   * send message to socket server
   * @param {String} user input value
   */
  addMessage = (value, e, isTagged, tagged_id) => {
    //console.log("Qutes Message",e.target.attributes.getNamedItem('quoted-msgId').value);
    console.info('THE VALUE  this.state.roomData', value, isTagged, tagged_id, this.state.roomData);
    if (!tagged_id || tagged_id.length === 0) {
      tagged_id = null;
    } else {
      isTagged = true;
    }

    let message = value.trim();
    if (this.state.roomData && this.state.roomData.roomType === 'messages' && this.state.details) {
      console.info(this.state.details, message.search('@' + this.state.details.username));
      if (message.search('@' + this.state.details.username) !== -1) {
        tagged_id = [this.state.details.id];
        isTagged = true;
      }
    }
    // console.log('quoted', opts);
    let quotedMsgId = null;
    let quotedSenderMsgId = null;
    if (e.target.attributes.getNamedItem('quoted-msgId') && e.target.attributes.getNamedItem('quoted-msgId').value) {
      quotedMsgId = e.target.attributes.getNamedItem('quoted-msgId').value;
    }

    // if (e.target.attributes.getNamedItem('quoted-msgSenderId') && e.target.attributes.getNamedItem('quoted-msgSenderId').value  && this.state.roomData.roomType !== 'messages') {
    //   quotedSenderMsgId = e.target.attributes.getNamedItem('quoted-msgSenderId').value;
    //   console.info('THE tagged_id  this.state.roomData tagged_id', tagged_id);
    //   if(tagged_id !==null || tagged_id.length===0()){
    //     tagged_id=[quotedSenderMsgId];
    //   }
    //   else{
    //     console.info('THE tagged_id  this.state.roomData else tagged_id', tagged_id,quotedSenderMsgId);
    //     tagged_id.push(quotedSenderMsgId);
    //   }

    //   isTagged =true;
    // }

    //console.log("Qutes Message",e.target.attributes.getNamedItem('quoted-msgId').value,e.target.attributes.getNamedItem('quoted-msgSenderId').value);

    if (!quotedMsgId) {
      quotedMsgId = document.querySelector('.quoted__message').getAttribute('quoted-msgid');
    }
    if (quotedMsgId !== 'null' && !quotedSenderMsgId && this.state.roomData.roomType !== 'messages') {
      quotedSenderMsgId = document.querySelector('.quoted__message').getAttribute('quoted-msgSenderId');
      console.info('THE tagged_id  this.state.roomData quotedMsgId tagged_id', quotedMsgId, tagged_id);
      if (!tagged_id || tagged_id.length === 0) {
        console.info(' if quotedMsgId tagged_id', tagged_id, quotedSenderMsgId);
        tagged_id = [quotedSenderMsgId];
      } else {
        console.info(' else quotedMsgId tagged_id', tagged_id, quotedSenderMsgId);
        tagged_id.push(quotedSenderMsgId);
      }
      isTagged = true;
    }

    console.log('Qutes Message', quotedMsgId, quotedSenderMsgId);
    if (message.length === 0) {
      return;
    }
    this.scrollChatScreenToBottom();
    this.scrollInboxListToTop();
    // let otherUser = this.props.match.params.identifier;
    //var tagged_id = [84,85];
    if (message) {
      let sentMessageObject = {
        message: message,
        roomId: this.state.roomId,
        senderId: this.state.sessionUserId,
        messageType: 'TEXT',
        receiverId:
          this.state.roomData && this.state.roomData.roomType == 'channels'
            ? this.state.roomData.roomId
            : this.state.otherUser,
        receiver: this.state.roomData && this.state.roomData.roomType == 'channels' ? 'CHANNEL' : 'USER',
        workspaceId: this.state.workspaceId,
        isPinned: this.state.isPinned,
        pinnedBy: this.state.isPinned ? this.state.sessionUserId : null,
        pinnedAt: this.state.isPinned ? moment(Date.now()).format('YYYY-MM-DD') : null,
        quotedMsgId,
        isTagged,
        tagged_id,
      };
      this.socket.emit('newMessage', sentMessageObject);
      const {
        channelId,
        channel_users_firebase_ids = [],
        details: { firebase_id: other_user_firebase_id, name: channel_name } = {},
      } = this.state;
      const {
        response: {
          user: {
            response: {
              user: { name: sender_name = 'Ubblu Chat', profile_image: sender_profile_image, id, firebase_id: sender_firebase_id },
            },
          },
        },
      } = this.props;
      const firebaseIds = channelId
        ? channel_users_firebase_ids
        : other_user_firebase_id
        ? [other_user_firebase_id]
        : [];
      const notificationPayload = getNotificationPayload({
        title: channelId && channel_name ? channel_name : sender_name,
        body: sentMessageObject.message,
        icon: sender_profile_image,
        data: {
          senderId: sentMessageObject.senderId,
          receiverId: sentMessageObject.receiverId,
          roomId: sentMessageObject.roomId,
          receiver: sentMessageObject.receiver,
          workspaceId: sentMessageObject.workspaceId,
        }
      });
      if (!!firebaseIds.length) {
        notificationPayload['firebaseIds'] = firebaseIds;
        triggerNotification(notificationPayload);
      }
    }
    document.querySelector('.quoted__message').setAttribute('quoted-msgid', null);
    document.querySelector('.quoted__message').setAttribute('quoted-msgSenderId', null);
    document.querySelector('.quoted__message').innerHTML = null;
  };

  shouldComponentUpdate(nextProps, nextState) {
    //conversation view first time only
    if (nextProps.response.roomStore && nextProps.response.roomStore.hasOwnProperty('response')) {
      const _selectedRoom = nextProps.response.roomStore.response;
      if (_selectedRoom) {
        // if (_selectedRoom.id !== (this.state.selectedRoom && this.state.selectedRoom.id)) {
        //   this.users = _selectedRoom.data.users;
        //   const msgObj = this.prepareMessageObj(_selectedRoom.data.messages);
        //   console.log('message object', msgObj);
        //   if (
        //     msgObj[msgObj.length - 1].id !==
        //     (this.messages[this.messages.length - 1] && this.messages[this.messages.length - 1].id)
        //   ) {
        //     this.messages = msgObj;
        //     this.setState((state, props) => ({
        //       pinMessage: _selectedRoom.data.pinMessage,
        //       selectedRoom: _selectedRoom.data.users[0],
        //       users: _selectedRoom.data.users,
        //       conversationHistory: [state.messages, ...msgObj],
        //       messages: [this.messages, ...msgObj],
        //       receiverId: _selectedRoom.id,
        //     }));
        //     return true;
        //   }
        // }
      }
    }

    //socket response
    if (nextProps.response && nextProps.response.chat.hasOwnProperty('messages')) {
      console.log('socket response');
      const chatData = nextProps.response.chat.messages;
      const CurrentChatData = chatData[this.state.receiverId];
      if (
        CurrentChatData &&
        this.messages &&
        CurrentChatData[CurrentChatData.length - 1].id !== this.messages[this.messages.length - 1].id
      ) {
        const _tempChatItem = this.createMessageObject(CurrentChatData[CurrentChatData.length - 1]);
        this.messages = [...this.messages, _tempChatItem];
        // this.setState((state, props) => ({
        //   messages: [...state.messages, _tempChatItem],
        // }));
        return true;
      }
    }

    //force update
    // if (nextState.isUpdated) {
    //   this.setState({ isUpdated: false });
    //   return true;
    // }
    return true;
  }

  initSocketConnection() {
    this.socket = io(SOCKET_URI, { transports: ['websocket'] });
  }

  // componentWillMount() {
  //   console.log('workpace check', window.location.pathname.split('/')[1],  window.location.pathname.split('/')[2]);
  //   if (isNaN(window.location.pathname.split('/')[1]) && ((window.location.pathname.split('/')[2]) == 'messages') && !isNaN(this.state.workspaceId)) {
  //     // console.log('workpace check false')
  //     this.props.push(`/login`);
  //   }
  // }

  async componentDidMount() {
    this.turnOffLoaderDebounce = debounce(this.turnOffLoader, 5000);
    this.initSocketConnection();
    this.setupSocketListeners();
    this.socket.emit('createRoom', {
      test:"1"
    })
    console.log('shithole')
    // // this.switchNamespace('rooms');
    // const roomData = getRoomData();
    // if (roomData.roomType == null && roomData.roomId == null) {
    //   this.switchNamespace('chatroom');
    // }
    // let otherUser = this.props.match.params.identifier;
    // if (roomData.roomType == 'messages') {
    //   this.setState({
    //     otherUser: roomData.roomId,
    //     roomData: roomData,
    //   });
    //   const userData = await fetchUserDetailsById(roomData.roomId);
    //   if (userData && userData.success) {
    //     if (_get(userData.data, 'user')) {
    //       const details = userData.data.user;
    //       this.setState({
    //         details,
    //       });
    //     }
    //   }
    //   this.socket.emit('createRoom', {
    //     currentUser: this.state.sessionUserId,
    //     otherUser: otherUser,
    //     workspaceId: this.state.workspaceId,
    //   });
    // }
    // if (roomData.roomType == 'channels') {
    //   this.setState({
    //     channelId: roomData.roomId,
    //     roomData: roomData,
    //   });
    //   this.socket.emit('createChannel', {
    //     channelId: roomData.roomId,
    //     userId: USERID(),
    //   });
    //   getAllUsersByChannel({ channelId: roomData.roomId }).then(({ data: { users = [] } = {} }) => {
    //     const {
    //       response: {
    //         user: {
    //           response: {
    //             user: { id, firebase_id: self_firebase_id } = {}
    //           } = {}
    //         } = {}
    //       } = {}
    //     } = this.props;

    //     const channel_users_firebase_ids = uniq(users.map(({ firebase_id }) => firebase_id).filter(firebase_id => !!firebase_id && firebase_id != self_firebase_id));
    //     this.setState({ channel_users_firebase_ids });
    //   });
    // }
    // if (window.location.hash) {
    //   var element = document.querySelector(window.location.hash);
    //   //console.log('element',element);

    //   // smooth scroll to element and align it at the bottom
    //   element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    // }
  }

  // async componentWillReceiveProps(nextProps) {
  //   let roomData = getRoomData();
  //   if (roomData.roomType === 'messages') {
  //     if (this.state.otherUser !== roomData.roomId) {
  //       this.switchNamespace('rooms');
  //       this.socket.emit('createRoom', {
  //         currentUser: this.state.sessionUserId,
  //         otherUser: roomData.roomId,
  //         workspaceId: this.state.workspaceId,
  //       });
  //       const userData = await fetchUserDetailsById(roomData.roomId);
  //       if (userData.success) {
  //         if (_get(userData.data, 'user')) {
  //           const details = userData.data.user;
  //           this.setState({
  //             details,
  //           });
  //         }
  //       }
  //       this.setState({
  //         otherUser: roomData.roomId,
  //         channelId: null,
  //         roomData: roomData,
  //       });
  //     }
  //     this.setState({ channel_users_firebase_ids: [] });
  //   }
  //   if (roomData.roomType === 'channels') {
  //     if (this.state.channelId == null || this.state.channelId != roomData.roomId) {
  //       this.switchNamespace('rooms');
  //       const channelData = await fetchChannelInformation(roomData.roomId);
  //       getAllUsersByChannel({ channelId: roomData.roomId }).then(({ data: { users = [] } = {} }) => {
  //         const {
  //           response: {
  //             user: {
  //               response: {
  //                 user: { id, firebase_id: self_firebase_id } = {}
  //               } = {}
  //             } = {}
  //           } = {}
  //         } = this.props;
  //         const channel_users_firebase_ids = uniq(users.map(({ firebase_id }) => firebase_id).filter(firebase_id => !!firebase_id && firebase_id != self_firebase_id));
  //         this.setState({ channel_users_fireSOCKET_URIbase_ids });
  //       });
  //       if (channelData.success) {
  //         if (_get(channelData.data, 'user')) {
  //           const details = channelData.data.user;
  //           if (details.status == null) {
  //             this.setState({
  //               disabled: true,
  //             });
  //           } else {
  //             this.setState({
  //               disabled: false,
  //             });
  //           }
  //           this.setState({
  //             details,
  //           });
  //         }
  //       }

  //       this.socket.emit('createChannel', {
  //         channelId: roomData.roomId,
  //         workspaceId: this.state.workspaceId,
  //         userId: USERID(),
  //       });
  //       this.setState({
  //         channelId: roomData.roomId,
  //         otherUser: null,
  //         roomData: roomData,
  //       });
  //     }
  //   }
  // }

  /**
   * create the message array object with user details
   * @param {Object}
   */
  prepareMessageObj = messages => {
    let msgObjArray = [];
    messages.map((message, index) => {
      if (index === 0) {
        msgObjArray.push({
          type: 'system',
          sentAt: message['created_at'],
        });
      }
      if (
        index &&
        new Date(messages[index]['created_at']).getDate() != new Date(messages[index - 1]['created_at']).getDate()
      ) {
        msgObjArray.push({
          type: 'system',
          sentAt: message['created_at'],
        });
      }
      msgObjArray.push(this.createMessageObject(message));
    });

    return msgObjArray;
  };

  /**
   * get user details using user id
   * @param {String}
   */
  getUserDetails = uid => {
    return this.users.filter(function (user) {
      return user.id === uid;
    });
  };

  /**
   * get message obj using message id
   * @param {String}
   */
  getMessageObjById = id => {
    return this.messages.find(msg => msg.id === id);
  };

  /**
   * get the message object index by message id
   * @param {String}
   */
  getMessageIndexById = id => {
    return this.messages.findIndex(msg => msg.id === id);
  };

  formatMessage = (type, message) => {
    switch (type) {
      case 'TEXT':
        return format_message(message);
      case 'FILE':
        return format_message(message);
      case 4:
        return message;
      default:
        return null;
    }
  };

  setupSocketListeners = async () => {
    this.loading = true;
    this.turnOffLoaderDebounce();
    this.messages = [];
    this.socket.on('connect', () => {
     console.log('connected', this.socket)
     
    });

    this.socket.on('my event', async (id) => {
      console.log('shit')
      
     });

    
    this.socket.on('disconnect', async reason => {
     console.log('reason', reason)
    });
    this.socket.on('roomDetails', this.roomDetails);
    this.socket.on('addMessage', this.onMessageRecieved);
  };

  joinRoom = roomId => {
    this.socket.emit('join', {
      roomId: roomId,
      userId: this.state.sessionUserId,
    });
  };

  updateSocketDetails = () => {
    this.socket.emit('updateSocketDetails', {
      userId: this.state.sessionUserId,
    });
  };

  roomDetails = async data => {
    //fetch the roomId
    if (Object.keys(data).length > 0) {
      if (data.id != undefined || data.id != null) {
        this.setState(
          {
            roomId: data.id,
            muted: data.muted,
          },
          async cb => {
            this.props.setSeletedRoomRoomIdAction({
              roomId: this.state.roomId,
            });
            this.switchNamespace('chatroom'); //go to chat room to join the room
            // this.updateSocketDetails();
            this.joinRoom(this.state.roomId);
            const res = await getConversationHistory(this.state.roomId); //get conversation history
            this.loading = false;
            await changeReadStatus(this.state.roomId);
            this.props.getInboxUsersAction();

            this.rawConversation = removeDeletedMessages(res.data.conversations);
            const msgObj = this.prepareMessageObj(this.rawConversation);
            this.messages = msgObj;
            this.forceUpdate();
            this.scrollChatScreenToBottom();
          },
        );
      }
    }
  };

  onMessageRecieved = async data => {
    if (data.length > 0) {
      const newMessage = data[0];
      this.rawConversation.push(newMessage);
      const msgObj = this.prepareMessageObj(this.rawConversation);
      this.messages = msgObj;
      this.forceUpdate();
      this.props.getInboxUsersAction();
      this.scrollChatScreenToBottom();
      this.scrollInboxListToTop();

      // return true;
    }
  };

  switchNamespace(namespace) {
    this.socket.close(); // Close the current connection
    // this.socket = io(namespace, { transports: ['websocket'] });
    this.socket = io(`${SOCKET_URI}`, { transports: ['websocket'], upgrade: false });
    this.setupSocketListeners();
   

    if (namespace === 'chatroom') {
      this.socket.emit('updateSocketDetails', {
        userId: this.state.sessionUserId,
      });
      this.socket.emit('joinAllRooms', {
        userId: this.state.sessionUserId,
        workspaceId: this.state.workspaceId,
      });
    }
  }

  /**
   * create message object with user data
   * @param {Object} message
   */

  createMessageObject = message => {
    // const _User = this.getUserDetails(message.sender_id);
    // const _lastSenderId = this.messages.length && this.messages[this.messages.length - 1].sendBy;

    if (message) {
      // TODO :: sessionUserid should be number
      // eslint-disable-next-line
      const _position = this.state.sessionUserId != message.sender_id ? 'left color-alt' : 'left';
      const _avatarShow = message.sender_id === this.state.sessionUserId ? false : true;
      const _message = this.formatMessage(message.message_type, message.message);
      return {
        id: message.id,
        onClick: null,
        avatar: message.profile_image,
        lazyLoadingImage: undefined,
        onAvatarError: () => void 0,
        avatarFlexible: true,
        avatarShow: _avatarShow,
        alt: message.name || message.username,
        name: message.name || message.username,
        username: message.username,
        showUsername: _avatarShow,
        message: _message,
        fileDetails:
          message.file_upload_details != null || message.file_upload_details != undefined
            ? message.file_upload_details
            : null,
        sendBy: message.sender_id,
        sentAt: new Date(message.created_at).getTime() || new Date().getTime(),
        position: _position,
        type: message.message_type,
        is_tagged: message.is_tagged,
        deleted: message.deleted,
        quoted_msg_id: message.quoted_msg_id,
        quoted_msg: message.quoted_msg,
        quoted_msg_sender_name: message.quoted_msg_sender_name,
        quoted_msg_timestamp: moment(message.quoted_msg_timestamp).format('DD-MM-YYYY') || new Date().getTime(),
        quoted: message.quoted_msg_id != null ? true : false,
        created_at: message.created_at,
        profile_color: message.profile_color,
      };
    }
  };

  /**
   * Add emoji into editor
   * @param {event}
   */
  addEmoji = e => {
    let sym = e.unified.split('-');
    let codesArray = [];
    sym.forEach(el => codesArray.push('0x' + el));
    //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
    let emojiPic = String.fromCodePoint(...codesArray); //("0x1f3f3", "0xfe0f")
    // console.log('EMOJI ', e.colons, emojiPic);
    this.inputForm.closeMenu(this.refs.chatInput.input);
    this.refs.chatInput.input.innerText = `${this.refs.chatInput.input.innerText} ${emojiPic} `;
    // this.refs.chatInput.input.focus();
    setContenteditFocus(this.refs.chatInput.input);
  };

  fileUpload = (fileDetails, message) => {
    if (fileDetails.success) {
      let sentMessageObject = {
        message: message,
        roomId: this.state.roomId,
        senderId: this.state.sessionUserId,
        messageType: 'FILE',
        fileDetails: fileDetails.data,
        fileUploadMethod: fileDetails.data.fileUploadMethod,
        receiverId:
          this.state.roomData && this.state.roomData.roomType == 'channels'
            ? this.state.roomData.roomId
            : this.state.otherUser,
        workspaceId: this.state.workspaceId,
        isPinned: this.state.isPinned,
        pinnedBy: this.state.isPinned ? this.state.sessionUserId : null,
        pinnedAt: this.state.isPinned ? moment(Date.now()).format('YYYY-MM-DD') : null,
        isTagged: this.state.isTagged,
        quotedMsgId: null,
      };
      this.socket.emit('newMessage', sentMessageObject);
    }
  };

  /**
   * save the edited message
   * @param {Element} - editor element object
   * @param {Object} - Message Object
   */
  saveEditMessage = (el, selectedMsg) => {
    let _selectedMsg = Object.assign({}, selectedMsg);
    const _index = this.getMessageIndexById(_selectedMsg.id);
    const msgId = _selectedMsg.id;
    _selectedMsg.message = el.innerHTML;
    this.socket.emit('editMessage', {
      msgId: msgId,
      editedMsg: _selectedMsg.message,
      deleted: false,
    });
    if (_index) {
      this.messages[_index] = _selectedMsg;
      this.setState({
        isUpdated: true,
      });
    }
  };

  saveMessageAsToDo = async (e, selectedMsg) => {
    // let _selectedMsg = Object.assign({}, selectedMsg);
    // const _index = this.getMessageIndexById(_selectedMsg.id);
    // console.log('edit', _selectedMsg);
    const newNote = await addChannelNotes({
      channelId: this.state.channelId != null ? this.state.channelId : this.state.roomId,
      notes: selectedMsg.message,
    }).then(() => {
      this.handleHeadDeatils(e);
      this.props.re_fetchNotes(true);
      this.props.re_fetchNotes(false);
      setTimeout(() => {
        this.scrollToElement('notes');
      }, 5000);
    });
    // if (_index) {
    //   this.messages[_index] = _selectedMsg;
    //   this.setState({
    //     isUpdated: true,
    //   });
    // }
  };

  onDownloadFile = async (el, selectedMsg) => {
    let _selectedMsg = Object.assign({}, selectedMsg);
    const _index = this.getMessageIndexById(_selectedMsg.id);
    const msgId = _selectedMsg.id;
    // _selectedMsg.message = el.innerHTML;

    downloadFile(msgId)
      // .then((response) => response.blob())
      .then(response => {
        const filename = response.headers['content-disposition'].split('"')[1];

        response = response.data;

        // 2. Create blob link to download
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;

        link.setAttribute('download', filename);
        // 3. Append to html page
        document.body.appendChild(link);
        // 4. Force download
        link.click();
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link);
        // this.setState({
        //   loading: false
        // });
      });
    // .then(res => {
    //   console.log('download data', res);
    //   if (res.success && res.data.status) {
    //     console.log('redirection true for auth', res);
    //     const filePath = res.data.data.path;
    //     const strMimeType = res.data.data.mimeType;
    //     console.log('download data', filePath);

    //     download(filePath, 'demo', strMimeType);

    //   } else {

    //   }
    // })
    // .catch(error => {
    //   // this.setState({ profileImageError: res.data.errors[0]["message"] });
    // });

    // this.socket.emit('editMessage', {
    //   msgId: msgId,
    //   editedMsg: _selectedMsg.message
    // })
    // if (_index) {
    //   this.messages[_index] = _selectedMsg;
    //   this.setState({
    //     isUpdated: true,
    //   });
    // }
  };

  /**
   * delete the selected message
   * @param {Object} - message object
   */
  deleteMessage = selectedMsg => {
    this.rawConversation = removeDeletedMessages(this.rawConversation, selectedMsg.id);
    const dateGroupedConversation = this.prepareMessageObj(this.rawConversation);
    this.messages = dateGroupedConversation;

    this.socket.emit('editMessage', {
      msgId: selectedMsg.id,
      editedMsg: selectedMsg.message,
      deleted: true,
    });
    this.props.getInboxUsersAction();
    this.setState({
      isUpdated: true,
    });
  };

  /**
   * Pin message to current conversation window
   * @param {Object}
   */
  pinMessage = selectedMsg => {
    this.setState({
      isUpdated: true,
      pinMessage: selectedMsg,
    });
  };

  /**
   * Un Pin message to current conversation window
   * @param {Object}
   */
  unPinMessage = selectedMsg => {
    this.setState({
      isUpdated: true,
      pinMessage: null,
    });
  };

  joinChannel = async () => {
    if (this.state.channelId && this.state.details) {
      const res = await joinChannelViaInvite({
        inviteLink: this.state.details.invite_link,
      });

      if (res && res.success) {
        toast.success('SUCCESS: You are a member of this channel!');
        const roomData = getRoomData();
        const channelData = await fetchChannelInformation(roomData.roomId);

        if (channelData.success) {
          if (_get(channelData.data, 'user')) {
            const details = channelData.data.user;
            this.setState({
              details,
            });
          }
        }

        this.socket.emit('createChannel', {
          channelId: roomData.roomId,
          workspaceId: this.state.workspaceId,
          userId: USERID(),
        });
      } else {
        toast.error('ERROR: Something wrong happened!');
      }
    }
  };

  toggleMuteConversation = async () => {
    let payload = {
      userId: this.state.sessionUserId,
      channelId: [this.state.channelId ? this.state.channelId : this.state.roomId],
    };
    const mutedResponse = await createMutedConversations(payload);
    // this.props.clearInboxUsersAction();
    this.props.getInboxUsersAction();

    this.setState({ muted: !this.state.muted });
  };

  //message action menu click events
  /**
   * Handle message action menu click events
   * @param {Event}
   * @param {Element} - editor element
   * @param {Object} - message object
   */
  handleChatEvents = (evt, el = null, opts = null) => {
    const action = evt && evt.currentTarget.dataset.action;

    switch (action) {
      case 'save-message':
        this.saveEditMessage(el, opts);
        break;
      case 'to-do-message':
        this.saveMessageAsToDo(el, opts);
        break;
      case 'delete-message':
        this.deleteMessage(opts);
        break;
      case 'pin-message':
        this.pinMessage(opts);
        break;
      case 'unpin-message':
        this.unPinMessage();
      case 'download-file':
        this.onDownloadFile(el, opts);
        break;
      default:
        console.log(`Unrecognized action: ${action}`);
    }
  };

  handleChannelNonMemebers = channelType => {
    switch (channelType) {
      case 'PUBLIC':
        return (
          <div className="c-chat-window--placeholder">
            <Alert variant={'info'}>
              You're not a member of this Public channel, <br />
              <Alert.Link
                href="#"
                onClick={() => {
                  this.joinChannel();
                }}
              >
                CLICK HERE
              </Alert.Link>{' '}
              to join
            </Alert>
          </div>
        );
      case 'PRIVATE':
        return (
          <div className="c-chat-window--placeholder">
            <Alert variant={'info'}>
              You're not a member of this Private Channel, <br />
              <Alert.Link href="#">contact the channel admin</Alert.Link> to join !
            </Alert>
          </div>
        );
      case 'RESTRICTED':
        return (
          <div className="c-chat-window--placeholder">
            <Alert variant={'info'}>
              You're not a member of this Secret Channel, <br />
              <Alert.Link href="#">contact the channel admin</Alert.Link> to join !
            </Alert>
          </div>
        );
    }
  };

  scrollToElement = dataId => {
    if (dataId) {
      const element = document.querySelector(`[data-id="${dataId}"]`);
      console.log('element1', element);
      element.scrollIntoView({ behavior: 'smooth' });
      element.style.opacity = 0.5;
      element.style.display = 'block';
      element.style.background = '#edf2ff';
      setTimeout(() => {
        element.style.opacity = 'inherit';
        element.style.display = 'inherit';
        element.style.background = 'inherit';
      }, 500);
    }
  };

  onClicked = (e, action) => {
    if (!this.infoPanelOpened) {
      if (!action) {
        this.handleHeadDeatils(e);
      } else if (action == 'file_shared') {
        this.props.push('Details#FileShared');
      } else if (action == 'notes') {
        this.props.push('Details#Notes');
      }
      this.infoPanelOpened = true;
    } else {
      const { channelId, otherUser } = this.state;
      let route = '';
      if (channelId) {
        route = getRelativeChannelURL(channelId);
      } else {
        route = getRelativeMessageURL(otherUser);
      }
      this.infoPanelOpened = false;
      this.props.push(route);
    }
  };

  scrollToElement = dataId => {
    if (dataId) {
      const element = document.querySelector(`[data-id="${dataId}"]`);
      console.log('element2', element);
      element.scrollIntoView({ behavior: 'smooth' });
      element.style.opacity = 0.5;
      element.style.display = 'block';
      element.style.background = '#edf2ff';
      setTimeout(() => {
        element.style.opacity = 'inherit';
        element.style.display = 'inherit';
        element.style.background = 'inherit';
      }, 500);
    }
  };

  onClicked = (e, action) => {
    if (!this.infoPanelOpened) {
      if (!action) {
        this.handleHeadDeatils(e);
      } else if (action == 'file_shared') {
        this.props.push('Details#FileShared');
      } else if (action == 'notes') {
        this.props.push('Details#Notes');
      } else if (action == 'goback') {
        this.props.setScreen('inbox');
      }
      this.infoPanelOpened = true;
    } else {
      const { channelId, otherUser } = this.state;
      let route = '';
      if (channelId) {
        route = getRelativeChannelURL(channelId);
      } else {
        route = getRelativeMessageURL(otherUser);
      }
      this.infoPanelOpened = false;
      this.props.push(route);
    }
  };

  scrollChatScreenToBottom = () => {
    const [element] = document.getElementsByClassName('chatlist__container');
    let tagged_date = new Date();
    if (document.querySelector('.c-inbox__action--timeago') && document.querySelector('.c-inbox__action--timeago').id) {
      tagged_date = new Date(document.querySelector('.c-inbox__action--timeago').id).getTime();
    }
    let quoted_msg_id;
    if (this.messages.length > 0) {
      this.messages.map((item, i) => {
        if (item.sentAt === tagged_date) {
          quoted_msg_id = item.id;
        }
      });
    }

    if (
      document.querySelector(`[data-id="${quoted_msg_id}"]`) &&
      document.querySelector('.chat_tabs_type').id === 'link-tagged'
    ) {
      const quote_el = document.querySelector(`[data-id="${quoted_msg_id}"]`);
      quote_el.scrollIntoView(false, { behavior: 'smooth' });
      setTimeout(() => {
        quote_el.style.opacity = 0.5;
        setTimeout(() => (quote_el.style.opacity = 1), 500);
      }, 1000);
    } else {
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 500);
    }
  };

  scrollInboxListToTop = ()=>{
    const [element] = document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List');
    if(element){
      element.scrollTop = 0;
    }
  }

  isNotMember = (notAMember = false) => {
    this.setState({ notAMember });
  };

  turnOffLoader = ()=> {
    if(this.loading){
      this.loading = false;
      this.forceUpdate();
    }
  }

  render() {
    const status = this.state.details && this.state.details.status;
    const isAChannel = !!this.state.channelId;
    const isAdmin = status === 'ADMIN' || status === 'SUPERADMIN' ? true : false;
    this.maxHeight = window.innerHeight - 190;
    this.minHeight = isDesktopApp() ? window.innerHeight - 220 : window.innerHeight - 185;
    let messageDisplayDiv =
      this.messages && this.messages.length ? (
        this.messages.map((item, i) => (
          <ChatItem
            messages={this.messages}
            key={i}
            {...item}
            update={this.state.isUpdated}
            click={this.handleChatEvents}
            isAdmin={isAdmin}
            isAChannel={isAChannel}
          />
        ))
      ) : (
        <div className="c-chat-window--placeholder">
          <p>
            The secret of getting ahead is getting started. <br /> Just say something or Hi
          </p>
        </div>
      );

    return (
      <React.Fragment>
        {!isDesktopApp() && this.props.showBack && (
          <span className="m-go-back">
            <i
              style={{ marginLeft: 10, position: 'absolute', zIndex: 1000, cursor: 'pointer' }}
              className="fas fa-chevron-left"
              onClick={() => this.props.setScreen('inbox')}
            />
          </span>
        )}
        <ChatHeadInfo {...this.state.details} channelId={this.state.channelId} onClicked={this.onClicked} />
        <ChatTools
          onClick={this.toggleMuteConversation}
          muted={this.state.muted}
          details={this.state.details}
          onClicked={this.onClicked}
          notAMember={this.state.notAMember}
          showBack={this.props.showBack}
        />
        {this.state.pinMessage && <PinConversation {...this.state.pinMessage} events={this.handleChatEvents} />}
        <div className="c-chat-window">
          {this.loading && <Loader customClasses="c-chat-window-loader" />}
          {/* <Loader customClasses="c-chat-window-loader" /> */}
          <div className="chatlist__container">
            {this.state.channelId && this.state.details
              ? this.state.details.status != null
                ? messageDisplayDiv
                : this.handleChannelNonMemebers(this.state.details.channel_type)
              : messageDisplayDiv}
          </div>
          <ChatInput
            placeholder="Type some text or mention someone by @"
            defaultValue=""
            onRef={ref => (this.inputForm = ref)}
            ref="chatInput"
            channelId={this.state.channelId}
            roomId={this.state.roomId}
            multiline={true}
            className="fix-bottom"
            onKeyPress={e => {
              if (e.shiftKey && e.charCode === 13) {
                return true;
              }
              if (e.charCode === 13) {
                const isTagged =this.refs.chatInput.state.mentionData?this.refs.chatInput.state.mentionData.mentions:false;
                console.log('isTagged',isTagged,this.refs.chatInput.state.tagged_id);
                const message = e.target.value;
                this.addMessage(message, e, isTagged,this.refs.chatInput.state.tagged_id);
                // const isTagged = Boolean(_get(this.refs, "chatInput.state.mentionData.mentions",[]).length);
                //const message = e.target.value;
                //this.addMessage(message, e, isTagged);
                document.querySelector(".quoted__message").innerHTML = null;
                this.refs.chatInput.state.tagged_id=[];
                this.refs.chatInput.resetInput();
                e.preventDefault();
                return false;
              }
            }}
            onFileUpload={(fileDetails, message) => this.fileUpload(fileDetails, message)}
            addEmojis={this.addEmoji}
            isNotMember={this.isNotMember}
            rightButtons={
              <React.Fragment>
                <button
                  className="c-input__buttons-send"
                  type="button"
                  aria-label="Send"
                  onClick={this.handleSendMessage}
                  disabled={this.state.disabled}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </React.Fragment>
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      sendMessageAction,
      setSeletedRoomAction,
      getSearchResultsAction,
      setSeletedRoomRoomIdAction,
      push,
      setScreen,
      getInboxUsersAction,
      clearInboxUsersAction,
      re_fetchNotes,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ChatMaster));
