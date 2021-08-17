import React from 'react';
import { Form } from 'react-bootstrap';
import Moment from 'react-moment';
import moment from 'moment';
import { ModalPortal } from 'components/ReactPortal';
import get from 'lodash/get';
import { textEllipsis, getCookie } from 'common/utils';
import Highlighter from 'react-highlight-words';
import { toast } from 'react-toastify';

import Avatar from 'components/Avatar';
import { USERID, WORKSPACEID, generateChannelUrl, generateProfileUrl } from 'common/utils/helper';
import { getInboxUsersAction, setSeletedRoomAction, clearInboxUsersAction } from 'store/actions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import {
  createStarredConversations,
  fetchChannelInformation,
  getUserDetails,
  createMutedConversations,
  createPinnedConversations,
} from 'store/api';

let divStyle = {
  top: 0,
  left: 0,
};
const userId = USERID();

// const createPinnedConversation = async channelId => {
//   console.log('pin channel with id', channelId,userId);
//   await createPinnedConversations(channelId, userId);

//   //console.log('star channel with id', channelId);
//    // await createStarredConversations(channelId, userId);
//     props.clearInboxUsersAction();
//     props.getInboxUsersAction();
// };

const myColor = starred => {
  if (starred) {
    return 'orange';
  }
  return 'grey';
};

const getFavIcon = starred => {
  if (starred) {
    return 'fas fa-star';
  }
  return 'far fa-star';
};

const InboxItem = props => {
  const { otherUser = {}, lastMessage = {}, showBox, senderDetails } = props;

  if (lastMessage.messageType == 'FILE') {
    lastMessage.message = lastMessage.fileDetails.fileName;
  }

  // const [details, setDetails] = React.useState({});
  // const [senderDetails, setSenderDetails] = React.useState({});

  const [showMenu, setShowMenu] = React.useState(false);

  const getMenuPosition = e => {
    let left, top;
    top = window.scrollX + e.target.getBoundingClientRect().top;
    left = window.scrollX + e.target.getBoundingClientRect().left + 30;
    if (window.innerWidth < left + 140) {
      left = left - 140;
      top = top + 20;
    }
    divStyle = { left: left, top: top };
  };

  const createPinnedConversation = async channelId => {
    console.log('pin channel with id', channelId, userId);
    await createPinnedConversations(channelId, userId);
    const [inboxListScroller] = document.getElementsByClassName('ReactVirtualized__Grid ReactVirtualized__List');
    if(inboxListScroller){
      inboxListScroller.scrollTo(0,0);
    }

    //console.log('star channel with id', channelId);
    // await createStarredConversations(channelId, userId);
    //props.clearInboxUsersAction();
    //props.getInboxUsersAction();
  };

  const createStarredConversation = async channelId => {
    console.log('star channel with id', channelId);
    await createStarredConversations(channelId, userId);
    //props.clearInboxUsersAction();
    //props.getInboxUsersAction();
  };

  const handleActionMenu = e => {
    if (e.target.closest('.options-action')) {
      getMenuPosition(e);
      //TODO :: sessionUserId should be number
      // eslint-disable-next-line
      setShowMenu(true);
      document.addEventListener('click', closeMenu);
    }
  };

  const handlePinned = () => {
    let channelId = props.otherUser.id;
    console.log('pinned', props.otherUser.pinned, channelId);
    createPinnedConversation(channelId);
  };
  /**
   * close the actin menu on window click
   * @param {event}
   */
  const closeMenu = e => {
    if (e === 0 || !e.target.closest('.c-message-actions')) {
      setShowMenu(false);
      document.removeEventListener('click', closeMenu);
    }
  };

  // React.useEffect(() => {
  //   if (otherUser.channel) {
  //     fetchChannelInformation(otherUser.id, true).then(data => {
  //       let channelDetails = get(data, "data.user", {});
  //       setDetails({ ...channelDetails });
  //     }).catch(err => {
  //       setDetails({});
  //     })
  //   }
  // }, []);

  // React.useEffect(() => {
  //   if (lastMessage.sender_id) {
  //     getUserDetails(lastMessage.sender_id).then(data => {
  //       let senderData = get(data, "data.user", {});
  //       setSenderDetails({ ...senderData });
  //     }).catch(err => {
  //       setSenderDetails({});
  //     })
  //   }
  // }, [])

  const RenderAvatar = () => (
    <div className="c-inbox__chatItem--avatar">
      {otherUser.channel ? (
        <p className="channel__avatar" style={generateChannelUrl(otherUser.colors)}>
          {(otherUser.channelType || otherUser.channel_type) === 'PUBLIC' && '#'}
          {(otherUser.channelType || otherUser.channel_type) === 'PRIVATE' && '🔒'}
          {(otherUser.channelType || otherUser.channel_type) === 'RESTRICTED' && '🔒'}
        </p>
      ) : (
        <Avatar
          // userid={props.otherUser.id}
          src={generateProfileUrl(otherUser.name || otherUser.username, otherUser.colors)}
          alt="user"
          presenceShow={otherUser.availability ? true : false}
          presenceStatus={otherUser.availability}
          variant="small"
          className="rounded"
        />
      )}
    </div>
  );

  const handleAction = async type => {
    try {
      switch (type) {
        case 'mute':
          await createMutedConversations({
            uesrId: getCookie('uid'),
            channelId: props.otherUser.id,
          });
          toast.success('Channel muted');
          break;

        case 'pin':
          break;

        case 'unread':
          break;

        default:
          return null;
      }
    } catch (error) {
      toast.error(`Error performing ${type}`);
    } finally {
      setShowMenu(false);
    }
  };

  const RenderMenu = () => (
    <span className="options-action" onClick={handleActionMenu}>
      <i className="fas fa-ellipsis-h" />
      {showMenu && (
        <ModalPortal>
          <div className="ReactModal__Overlay">
            <div className="c-message-actions" id="c-message-actions" style={divStyle}>
              <ul>
                <li data-action="mute" onClick={() => handleAction('mute')}>
                  Mute
                </li>
                <li data-action="pin" onClick={() => handleAction('pin')}>
                  Pin
                </li>
                <li data-action="unread" onClick={() => handleAction('unread')}>
                  Unread
                </li>
              </ul>
            </div>
          </div>
        </ModalPortal>
      )}
    </span>
  );

  const shouldDisplayUnreadCount =  lastMessage.message != null && props.showUnread && lastMessage.unread > 0;

  const removeFromList = (e,channel_id,sender_id) =>{
    e.preventDefault();
    console.log('removeFromList child',channel_id,sender_id);
    props.removeFromList(channel_id,sender_id);

  }
  return (
    <div id="inboxItem" className={lastMessage.isActive ? 'c-inbox__list active_chat' : 'c-inbox__list'}>
      {props.otherUser && props.otherUser.pinned ? (
        <div className="pinned-wapper">
          <div
            className="c-inbox__chatItem"          
            onClick={props.onClick ? props.onClick : ``}
            data-uid={props.otherUser.id}
            data-id={props.otherUser.channel}
          >
            {showBox ? (
              <input type="checkbox" onClick={e =>removeFromList(e,props.lastMessage.channel_id,props.lastMessage.sender_id)} type="checkbox" />
            ) : (
              <RenderAvatar />
            )}
            <div className="c-inbox__chatItem--msg">
              <div className="c-inbox__head">
                <div className="c-inbox--username">
                  {otherUser.name || otherUser.username}
                </div>
                <div className="c-inbox__action">
                  {lastMessage.message != null
                    ? lastMessage.messageType === 2 && (
                        <span className="c-inbox__action--mtype">
                          <i className="far fa-envelope" />
                        </span>
                      )
                    : null}
                  {lastMessage.message != null ? (
                    <span className="c-inbox__action--favourite">
                      {!lastMessage.favourite && (
                        <i
                          // className={getFavIcon(otherUser.starred)}
                          // style={{ color: myColor(otherUser.starred) }}
                          className={otherUser.starred ? 'fas fa-star' : 'far fa-star'}
                          style={{ color: otherUser.starred ? 'orange' : 'grey' }}
                          onClick={() => createStarredConversation(lastMessage.channel_id)}
                        />
                      )}
                    </span>
                  ) : null}

                  {otherUser.muted && (
                    <span className="c-inbox__action--mute">
                      <i className="fas fa-bell-slash" />
                    </span>
                  )}
                  
                  {lastMessage.replied && (
                    <span className="c-inbox__action--replay">
                      <i className="fas fa-reply" />
                    </span>
                  )}
                  <span className="c-inbox__action--timeago" id={lastMessage.created_at && props.sentDate?props.sentDate:""}>
                    {lastMessage.created_at != null
                      ? moment().format('MM-DD-YYYY') === moment(lastMessage.created_at).format('MM-DD-YYYY')
                        ? moment(lastMessage.created_at).format('HH:mm')
                        : moment(lastMessage.created_at).format('MM/DD/YYYY')
                      : null}
                    {/* {lastMessage.created_at != null ? (
                  <Moment fromNow ago>
                    {new Date(lastMessage.created_at)}
                  </Moment>
                ) : null} */}
                  </span>
                </div>
              </div>
              <div className="c-inbox__chatItem--desc">
                <p className='c-inbox__chatItem--desc-items-details'>
                  <span className={`c-inbox__chatItem--desc-sender-name ${shouldDisplayUnreadCount ? 'bold' : ''}`}>
                    {senderDetails.id == userId ? 'You : ' : `${senderDetails.name} : ` }
                  </span>
                  {lastMessage.message != null && (
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={props.searchList ? [props.searchList] : []}
                      autoEscape={true}
                      highlightStyle={{ color: '#4d7cfe' }}
                      className="c-inbox__chatItem--desc-message"
                      textToHighlight={textEllipsis(lastMessage.message, 30)}
                    />
                  )}
                </p>
                  <span className={`pin-wapper ${shouldDisplayUnreadCount ? 'pin-wrapper-custom' : ''}`} onClick={() => createPinnedConversation(lastMessage.channel_id)}>
                          <i class="fas fa-thumbtack"></i>
                  </span>
                  {shouldDisplayUnreadCount && <span className="c-inbox__chatItem--desc-count">{lastMessage.unread}</span>}
              </div>
            </div>
          </div>
        </div>
      ) : props.otherUser ? (
        <div className="regular-wapper">
          <div
            className="c-inbox__chatItem"
            onClick={props.onClick ? props.onClick : ``}
            // data-uid={props.otherUser.channel ? props.otherUser.id : props.senderDetails.id}
            data-uid={props.otherUser.id}
            data-id={props.otherUser.channel ? props.otherUser.channel : ``}
          >
            {showBox ? <Form.Check  onClick={e =>removeFromList(e,props.lastMessage.channel_id,props.lastMessage.sender_id)} /> : <RenderAvatar />}
            <div className="c-inbox__chatItem--msg">
              <div className="c-inbox__head">
                <div className="c-inbox--username">
                  {otherUser.name || otherUser.username}
                </div>
                <div className="c-inbox__action">
                  {lastMessage.message != null
                    ? lastMessage.messageType === 2 && (
                        <span className="c-inbox__action--mtype">
                          <i className="far fa-envelope" />
                        </span>
                      )
                    : null}
                  {lastMessage.message != null ? (
                    <span className="c-inbox__action--favourite">
                      {!lastMessage.favourite && (
                        <i
                          // className={getFavIcon(otherUser.starred)}
                          // style={{ color: myColor(otherUser.starred) }}
                          className={otherUser.starred ? 'fas fa-star' : 'far fa-star'}
                          style={{ color: otherUser.starred ? 'orange' : 'grey' }}
                          onClick={() => createStarredConversation(lastMessage.channel_id)}
                        />
                      )}
                    </span>
                  ) : null}

                  {otherUser.muted && (
                    <span className="c-inbox__action--mute">
                      <i className="fas fa-bell-slash" />
                    </span>
                  )}
                  {lastMessage.replied && (
                    <span className="c-inbox__action--replay">
                      <i className="fas fa-reply" />
                    </span>
                  )}
                  <span className="c-inbox__action--timeago" id={lastMessage.created_at && props.sentDate?props.sentDate:""}>
                    {lastMessage.created_at != null
                      ? moment().format('MM-DD-YYYY') === moment(lastMessage.created_at).format('MM-DD-YYYY')
                        ? moment(lastMessage.created_at).format('HH:mm')
                        : moment(lastMessage.created_at).format('MM/DD/YYYY')
                      : null}
                  </span>
                </div>
              </div>
              <div className="c-inbox__chatItem--desc">
                <p className='c-inbox__chatItem--desc-items-details'>
                  <span className={`c-inbox__chatItem--desc-sender-name ${shouldDisplayUnreadCount ? 'bold' : ''}`}>
                    {senderDetails.id == userId ? 'You : ' : `${senderDetails.name} : ` }
                  </span>
                  {lastMessage.message != null && (
                    <Highlighter
                      highlightClassName="YourHighlightClass"
                      searchWords={props.searchList ? [props.searchList] : []}
                      autoEscape={true}
                      highlightStyle={{ color: '#4d7cfe' }}
                      className="c-inbox__chatItem--desc-message"
                      textToHighlight={textEllipsis(lastMessage.message, 30)}
                    />
                  )}
                </p>
                  <span className={`pin-wapper ${shouldDisplayUnreadCount ? 'pin-wrapper-custom' : ''}`} onClick={() => createPinnedConversation(lastMessage.channel_id)}>
                        <i class="fas fa-thumbtack"></i>
                  </span>
                  {shouldDisplayUnreadCount && <span className="c-inbox__chatItem--desc-count">{lastMessage.unread}</span>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

// export default InboxItem;

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getInboxUsersAction,
      clearInboxUsersAction,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({
  response,
});

export default connect(mapStateToProps, mapDispatchToProps)(InboxItem);
