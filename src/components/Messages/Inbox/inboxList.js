import { AutoSizer, List } from 'react-virtualized';
import { addClass, removeClass, isDesktopApp, getCookie } from 'common/utils';

import InboxItem from './inboxItem';
import { InboxLoader } from './inboxLoader';
import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { bindActionCreators } from 'redux';
import { get as _get } from 'lodash';

import { connect } from 'react-redux';
import { getRelativeMessageURL, getRelativeChannelURL } from 'common/utils/messageHelpers';
import { push } from 'connected-react-router';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import { setSeletedRoomAction, getInboxUsersAction, setScreen, getTaggedConversationsAction } from 'store/actions';

import { changeReadStatus, changeReadTaggedStatus } from 'store/api';
import _ from 'lodash';

class InboxList extends Component {
  constructor(props) {
    super(props);
    this.inboxListRef = null;
    this.state = {
      newMsg: 0,
      selectedKey: null,
      inboxType: null,
      sentDate: null,
    };
  }

  goUppText = key => {
    // const { items } = this.props;
    // if (key === items.length - 1) return;
    // const index = key + 1;
    // const itemBelow = items[index];
    // items[key + 1] = items[key];
    // items[key] = itemBelow;
    // this.setState({ items });
  };

  addActiveClass = el => {
    if (el) {
      removeClass(document.querySelectorAll('.c-inbox__list'), 'active_chat');
      addClass(el, 'active_chat');
    }
  };

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (nextProps.activeKey !== this.state.inboxType) {
      this.setState({ inboxType: nextProps.activeKey });
    }
    if (this.inboxListRef) {
      this.inboxListRef.forceUpdate();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      newMsg: nextProps.newMsg,
    });
  }

  removeFromList = (channel_id, sender_id) => {
    //event.preventDefault();
    console.log('removeFromList', channel_id, sender_id);
    changeReadTaggedStatus(channel_id, sender_id);
    // changeReadTaggedStatus
    // let list = this.props.inboxList;
    // list = list.filter((v, i) => i === key)
    // this.setState({ inboxList: list });
  };

  handleInboxItem = (event, push, setSeletedRoomAction, setScreen, updateInboxList, inboxList, key, msgDetails) => {
    event.preventDefault();
    changeReadStatus(msgDetails.lastMessage.channel_id);
    let route;
    const $el = event.target;
    const $selectedItem = $el.closest('.c-inbox__list');
    let _UID, isChannel;
    if ($selectedItem) {
      _UID = $selectedItem.querySelector('.c-inbox__chatItem').getAttribute('data-uid');
      isChannel = $selectedItem.querySelector('.c-inbox__chatItem').getAttribute('data-id');
    }
    this.setState({ selectedKey: key });
    if (isChannel == 'true') {
      console.log('messages url on click if', isChannel, _UID);
      if (_UID) {
        route = getRelativeChannelURL(_UID);
        setScreen('chat');
        push(route);
      }
    } else {
      console.log('messages url on click else', _UID);
      if (_UID) {
        console.log('messages url on click else', _UID);

        route = getRelativeMessageURL(_UID);
        push(route);
        setScreen('chat');
        setSeletedRoomAction({
          id: _UID,
        });
      }
    }
    if (this.state.inboxType === 'link-tagged') {
      this.setState({ sentDate: msgDetails.lastMessage.created_at });
      //this.props.getInboxUsersAction();
      console.log('this.state.selectedKey === key Link', this.state.inboxType, inboxList);
      this.props.getTaggedConversationsAction(USERID());
    } else {
      this.props.getInboxUsersAction();
    }
  };

  _rowRenderer = ({
    index,
    isScrolling,
    key,
    style,
    inboxList,
    push,
    setSeletedRoomAction,
    updateInboxList,
    searchList,
    setScreen,
  }) => {
    // if (isScrolling) {
    //   return <InboxLoader />;
    // }
    if (_get(this.props, 'response.inbox')) {
      let clearInbox = this.props.response.inbox.clearInbox;
      if (clearInbox) {
        console.log('loader');
        return <InboxLoader />;
      }
    }
    // const activestyle = this.state.selectedKey === key ? { background: '#f3f3f3' } : {};

    //console.log('this.state.selectedKeyrr',inboxList);

    return (
      <div key={key} id={this.state.inboxType} className="chat_tabs_type">
        <InboxItem
          key={index}
          sentDate={this.state.sentDate != null ? this.state.sentDate : ''}
          removeFromList={this.removeFromList}
          showBox={this.state.inboxType === 'link-tagged'}
          {...inboxList[index]}
          searchList={searchList}
          showUnread={true}
          // OnPinClick={e =>this.goUppText(key)}
          onClick={e =>
            this.handleInboxItem(e, push, setSeletedRoomAction, setScreen, updateInboxList, inboxList, key, {
              ...inboxList[index],
            })
          }
        />
      </div>
    );
  };

  render() {
    let { inboxList, push, setSeletedRoomAction, setScreen, updateInboxList, searchList } = this.props;
    //console.log('inboxList inboxListinboxListinboxListinboxList',inboxList);
    return (
      <AutoSizer disableHeight>
        {({ width }) => (
          <List
            ref={ref => (this.inboxListRef = ref)}
            noRowsRenderer={() => (
              <span className="placeNote">
                " Great things in business are never done by one person, they're done by a team of People"-Stevejobs"
              </span>
            )}
            rowHeight={66}
            rowRenderer={rowProps => {
              return this._rowRenderer({
                ...rowProps,
                inboxList,
                push,
                setSeletedRoomAction,
                updateInboxList,
                searchList,
                setScreen,
              });
            }}
            height={1000}
            data={inboxList}
            width={width}
            rowCount={inboxList ? inboxList.length : ''}
            autoHeight
          />
        )}
      </AutoSizer>
    );
  }
}

const mapStateToProps = response => ({
  response,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setSeletedRoomAction,
      getInboxUsersAction,
      getTaggedConversationsAction,
      push,
      setScreen,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InboxList);
