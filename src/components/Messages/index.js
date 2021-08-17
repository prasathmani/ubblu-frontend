import './index.scss';

import React, { Component } from 'react';

import ChatMaster from './Chat/index';
import Inbox from './Inbox/index';
import InfoPanel from './InfoPanel';
import { ROUTES } from 'common/constants';
import { Route } from 'react-router-dom';
import { getCookie, isDesktopApp } from 'common/utils';
import { API } from 'common/constants';
import { connect } from 'react-redux';




const AsidePanel = () => (
  <div className="c-messages-info">
    <InfoPanel className="channel-info" />
  </div>
);

class Messages extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    if (!getCookie('at')) {
      document.location.assign(ROUTES.LOGIN);
    }
    if (window.location.pathname.split('/')[1] === "NaN") {
      document.location.assign(ROUTES.LOGIN);
    }
    document.title = 'Ubblu';
  }

  showModule(moduleName) {
    const { screen = 'inbox', fullScreen } = this.props;
    if (isDesktopApp()) {
      if (fullScreen) {
        return true;
      } else {
        return screen === moduleName;
      }
    } else {
      return true;
    }
  }

  showBackInChat() {
    const { fullScreen } = this.props;
    if (!fullScreen && isDesktopApp()) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <React.Fragment>
        <div className="c-messages">
          <div className="c-messages-container">
            {
              this.showModule('inbox') &&
              <div className="c-messages-inbox">
                <Inbox />
              </div>
            }
            {
              this.showModule('chat') &&
              <div className="c-messages-chat">
                <ChatMaster showBack={this.showBackInChat()} />
              </div>
            }
            <Route path={ROUTES.MESSAGES_ROUTE_DETAILS} component={AsidePanel} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = response => {
  return {
    screen: response.manage.screen,
    fullScreen: response.manage.fullScreen,
  }
};

export default connect(
  mapStateToProps,
  null,
)(Messages);

