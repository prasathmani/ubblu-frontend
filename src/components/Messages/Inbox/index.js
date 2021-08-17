import './index.scss';

import React, { Component } from 'react';
import { getInboxUsersAction, setSeletedRoomAction } from 'store/actions';
import { getRelativeMessageURL, getRoomData, getRelativeChannelURL } from 'common/utils/messageHelpers';

import InboxList from './inboxList';
import InboxTabs from './inboxTabs';
import { TabPane } from './inboxTabPane';
import { get as _get } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { syncInboxWithChat } from './utils';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import { API } from 'common/constants';
import io from 'socket.io-client';
import { getLatestInboxMsgDetails } from 'store/api';

//const SOCKET_URI = API.DEV_BASE_BACKEND_URL;
// const SOCKET_URI = API.DEV_SOCKET_URL;
// const SOCKET_URI = API.SOCKET_URL;

class Inbox extends Component {
  // socket = io(`${SOCKET_URI}/chatroom`, { transports: ['websocket'] });

  constructor(props) {
    super(props);
    this.localInboxList = [];
    this.inboxList = [];
    this.updateInboxList = null;
    this.userWorkspaceRelationship = null;
    this.searchList = false;
    this.state = {
      filter: false,
      loading: true,
      isFirstLoad: true,
      newMsg: 0,
      key: 'link-all',
      inboxList: [],
      updateInboxList: [],
      sessionUserId: USERID(),
      workspaceId: WORKSPACEID(),
    };
  }

  componentWillMount() {
    // this.socket.emit('updateSocketDetails', {
    //   userId: this.state.sessionUserId,
    // });
    // this.socket.emit('joinAllRooms', {
    //   userId: this.state.sessionUserId,
    //   workspaceId: this.state.workspaceId,
    //   // socketId: this.socket.id
    // })
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (
      _get(nextProps, 'response.inbox._channel') &&
      Object.keys(nextProps.response.inbox._channel).length === 0 &&
      _get(nextProps, 'response.inbox._direct') &&
      Object.keys(nextProps.response.inbox._direct).length === 0 &&
      _get(nextProps, 'response.inbox._search') &&
      Object.keys(nextProps.response.inbox._search).length === 0 &&
      _get(nextProps, 'response.inbox._starred') &&
      Object.keys(nextProps.response.inbox._starred).length === 0 &&
      _get(nextProps, 'response.inbox._muted') &&
      Object.keys(nextProps.response.inbox._muted).length === 0
    ) {
      if (
        this.state.key === 'link-tagged' &&
        JSON.stringify(this.state.inboxList) !==
          JSON.stringify(_get(nextProps, 'response.inbox._tagged.conversations', []))
      ) {
        const inboxList = _get(nextProps, 'response.inbox._tagged.conversations', []);
        this.inboxList = inboxList;
        this.setState({ inboxList });
        this.setState({ filter: false });
      }

      if (
        this.state.key === 'link-all' &&
        JSON.stringify(this.state.inboxList) !==
          JSON.stringify(_get(nextProps, 'response.inbox.recents.conversations', []))
      ) {
        const inboxList = _get(nextProps, 'response.inbox.recents.conversations', []);
        this.inboxList = inboxList;
        this.setState({ inboxList });
        this.setState({ filter: false });
      }
    } else {
      if (_get(nextProps, 'response.inbox._channel')) {
        let _channel = nextProps.response.inbox._channel;
        if (
          _channel &&
          _channel.status === 1 &&
          Object.keys(_channel).length > 0 &&
          JSON.stringify(this.state.inboxList) !== JSON.stringify(_channel.conversations)
        ) {
          const inboxList = _channel.conversations;
          this.inboxList = _channel.conversations;
          this.setState({ inboxList });
          this.setState({ filter: true });
        }
      }

      if (_get(nextProps, 'response.inbox._direct')) {
        let _direct = nextProps.response.inbox._direct;
        if (
          _direct &&
          _direct.status === 1 &&
          Object.keys(_direct).length > 0 &&
          JSON.stringify(this.state.inboxList) !== JSON.stringify(_direct.conversations)
        ) {
          const inboxList = _direct.conversations;
          this.inboxList = _direct.conversations;
          this.setState({ inboxList });
          this.setState({ filter: true });
        }
      }

      if (_get(nextProps, 'response.inbox._search')) {
        let _search = nextProps.response.inbox._search;
        if (
          _search &&
          _search.status === 1 &&
          Object.keys(_search).length > 0 &&
          JSON.stringify(this.state.inboxList) !== JSON.stringify(_search.conversations)
        ) {
          const inboxList = _search.conversations;
          this.inboxList = _search.conversations;
          this.searchList = _search.searchString;
          this.setState({ inboxList });
          this.setState({ filter: true });
        }
      }

      if (_get(nextProps, 'response.inbox._starred')) {
        let _starred = nextProps.response.inbox._starred;
        if (
          _starred &&
          _starred.status === 1 &&
          Object.keys(_starred).length > 0 &&
          JSON.stringify(this.state.inboxList) !== JSON.stringify(_starred.conversations)
        ) {
          const inboxList = _starred.conversations;
          this.inboxList = _starred.conversations;
          this.searchList = _starred.searchString;
          this.setState({ inboxList });
          this.setState({ filter: true });
        }
      }
      if (_get(nextProps, 'response.inbox._muted')) {
        let _muted = nextProps.response.inbox._muted;
        if (
          _muted &&
          _muted.status === 1 &&
          Object.keys(_muted).length > 0 &&
          JSON.stringify(this.state.inboxList) !== JSON.stringify(_muted.conversations)
        ) {
          const inboxList = _muted.conversations;
          this.inboxList = _muted.conversations;
          this.searchList = _muted.searchString;
          this.setState({ inboxList });
          this.setState({ filter: true });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;
    if (prevState.data !== data) {
      this.setState({ data });
    }
  }

  componentDidMount() {
    this.props.getInboxUsersAction();
    this.setupSocketListeners();
  }

  setupSocketListeners = () => {
    // console.log('socket listeners on Inbox index', this.socket);
    // this.socket.on('connect', () => {
    //   console.log('socket conected in inbox', this.socket)
    // })
    // this.socket.on('addMessage', this.onMessageRecieved);
  };

  onMessageRecieved = async data => {
    console.log('message recieved in inbox list', data);
    this.props.getInboxUsersAction();

    // // if (this.props.response.roomStore && this.props.response.roomStore.hasOwnProperty('response')) {
    // console.log('old list in inbox list', this.inboxList);
    // // console.log('new list', data[0]);
    // let newMessage = data[0];
    // let messageUpdated = false;
    // let updatedIndex = null;

    // if (this.state.inboxList && this.inboxList) {
    //   this.inboxList.map((sender, index) => {
    //     console.info('INBOX SENDER', sender);
    //     if (sender["lastMessage"] && (sender["lastMessage"]["channel_id"] == newMessage["channel_id"])) {
    //       messageUpdated = true;
    //       updatedIndex = index;
    //       sender["lastMessage"]["created_at"] = newMessage["created_at"];
    //       sender["lastMessage"]["message"] = newMessage["message"];
    //       sender["lastMessage"]["messageType"] = newMessage["message_type"];
    //       sender["lastMessage"]["reciever_id"] = newMessage["receiver_id"];
    //       sender["lastMessage"]["sender_id"] = newMessage["sender_id"];
    //       sender["lastMessage"]["unread"] = 1;
    //     }
    //   });
    // }

    // if (messageUpdated) {
    //   let tempArray = [];
    //   for (let i = updatedIndex + 1; i < this.inboxList.length; i++) {
    //     tempArray.push(this.inboxList[i]);
    //   }
    //   this.inboxList.length = updatedIndex + 1;
    //   this.inboxList.unshift(this.inboxList.pop());
    //   this.inboxList = this.inboxList.concat(tempArray);
    // }
    // if (!messageUpdated) {
    //   const latestInboxMessage = await getLatestInboxMsgDetails(newMessage["id"], newMessage["receiver_id"]);
    //   console.log('new message for inbox view', latestInboxMessage);
    //   if (latestInboxMessage.success && latestInboxMessage.data.status && latestInboxMessage.data.conversations.length) {
    //     if (this.inboxList == null) this.inboxList = [];
    //     let newInboxMessage = latestInboxMessage.data.conversations[0];
    //     this.inboxList.push(newInboxMessage);
    //   }
    // }
    // this.updateInboxList = this.inboxList;
    // this.setState({
    //   newMsg: !this.state.newMsg,
    //   inboxList: this.inboxList,
    //   updateInboxList: this.updateInboxList
    // }, (cb) => {
    //   console.log('state check', this.state.newMsg)
    // })
  };

  shouldComponentUpdate(nextProps, nextState) {
    console.log("testing");
    if (_get(nextProps, 'response.inbox.recents')) {
      let _inbox = nextProps.response.inbox.recents;

      if (_inbox && _inbox.status === 1 && this.state.isFirstLoad && _inbox.conversations) {
        this.setState({
          inboxList: _inbox.conversations,
        });
        this.inboxList = _inbox.conversations;
        //set default first item selected
        this.setDefaultRoom(this.inboxList[0].otherUser.id, this.inboxList[0], this.inboxList[0].otherUser.channel);
        this.setState({
          loading: false,
          isFirstLoad: false,
        });
      }
    }

    return true;
  }

  //on first load set default as first user
  setDefaultRoom = (userid, userData = null, channel = false) => {
    const curentRoomData = getRoomData();
    if (!userid && curentRoomData && curentRoomData.roomId) {
      this.setSelectedRoom(curentRoomData.roomId, null);
    } else if (userid) {
      let route;
      if (channel) {
        route = getRelativeChannelURL(userid);
      } else {
        route = getRelativeMessageURL(userid);
      }
      this.props.push(route);
      this.setSelectedRoom(userid, userData);
    }
  };

  setSelectedRoom = (userid, userObj) => {
    this.props.setSeletedRoomAction({
      id: userid,
    });
  };

  removeFromList = key => {
    let list = this.state.inboxList;
    list = list.filter((v, i) => i === key);
    this.setState({ inboxList: list });
  };

  render() {
    if (_get(this.props, 'response')) {
      let user = this.props.response.user;
      if (_get(user, 'response')) {
        let userObject = user.response;
        if (_get(userObject, 'user')) {
          let userDetails = userObject.user;
          this.userWorkspaceRelationship = userDetails.user_workspace_relationships.length
            ? userDetails.user_workspace_relationships[0]['status']
            : null;
        }
      }
    }

    return (
      <InboxTabs
        containerProps={{
          activeKey: this.state.key,
          onSelect: key => this.setState({ key }),
        }}
        eventKey={this.state.key}
      >
        <TabPane filter={this.state.filter}>
          <InboxList
            state={this.state.newMsg}
            activeKey={this.state.key}
            inboxList={this.state.inboxList}
            removeFromList={this.removeFromList}
            updateInboxList={this.updateInboxList}
            searchList={this.searchList}
            userWorkspaceRelationship={this.userWorkspaceRelationship}
          />
        </TabPane>
      </InboxTabs>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getInboxUsersAction,
      setSeletedRoomAction,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({
  response,
});

export default connect(mapStateToProps, mapDispatchToProps)(Inbox);
