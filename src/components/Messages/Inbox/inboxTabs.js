import { Nav, Tab } from 'react-bootstrap';

import React from 'react';
import {
  getTaggedConversationsAction,
  getChannelConversationsAction,
  getStarredConversationsAction,
  getMutedConversationsAction,
  clearMutedConversationsAction,
  clearStarredConversationsAction,
  clearTaggedConversationsAction,
} from 'store/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withRouter } from 'react-router-dom';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import workspace from 'components/Signup/workspace';

const tabsData = [
  {
    eventKey: 'link-all',
    text: 'All',
  },
  {
    eventKey: 'link-tagged',
    text: 'Tagged',
  },
  // {
  //     eventKey: 'link-starred',
  //     text: 'Starred'
  // },
  // {
  //     eventKey: 'link-muted',
  //     text: 'Muted'
  // }
];
const sessionUserId = USERID();
const workspaceId = WORKSPACEID();

const InboxTabs = ({
  getTaggedConversationsAction,
  getChannelConversationsAction,
  getStarredConversationsAction,
  getMutedConversationsAction,
  clearMutedConversationsAction,
  clearStarredConversationsAction,
  clearTaggedConversationsAction,
  containerProps,
  eventKey = 'link-all',
  children,
}) => {
  const listConversations = data => {
    console.log('tab clicked', data);
    if (data === 'Tagged') {
      getTaggedConversationsAction(sessionUserId);
    }
    // if (data === 'Starred') {
    //     getStarredConversationsAction(sessionUserId);
    // }
    // if (data === 'Muted') {
    //     getMutedConversationsAction(sessionUserId);
    // }
    if (data === 'All') {
      clearMutedConversationsAction();
      clearTaggedConversationsAction();
      clearStarredConversationsAction();
    }
  };

  return (
    <Tab.Container {...containerProps}>
      <Nav fill variant="tabs" className="message_inbox_tabs">
        {tabsData.map(data => (
          <Nav.Item key={data.eventKey} className="message_inbox_link">
            <Nav.Link eventKey={data.eventKey} onClick={e => listConversations(data.text)}>
              {data.text}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content>
        <Tab.Pane data-type={eventKey} eventKey={eventKey}>
          {children}
        </Tab.Pane>
      </Tab.Content>
    </Tab.Container>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getTaggedConversationsAction,
      getChannelConversationsAction,
      getStarredConversationsAction,
      getMutedConversationsAction,
      clearMutedConversationsAction,
      clearStarredConversationsAction,
      clearTaggedConversationsAction,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InboxTabs));
