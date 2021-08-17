import 'react-toastify/dist/ReactToastify.min.css';
import './mainLayout.scss';

import React, { Component, lazy } from 'react';
import { USERID, WORKSPACEID } from 'common/utils/helper';
import {isDesktopApp} from 'common/utils';
import { getUserDataAction, setAvailability, setFullScreen } from 'store/actions';

import { FCMMessaging } from 'common/config/firebase-config';
import Sidebar from 'components/Sidebar';
import { ToastContainer } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';

//components

const SubMenu = lazy(() => import('components/Sidebar/SubMenu'));

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availability: true,
      showWorkspaceMap: true,
      user: '',
      userId: USERID(),
      workspaceId: WORKSPACEID(),
      isFirstLoad: true,
    };
  }

  componentDidMount() { 
    this.props.getUserDataAction({ uid: this.state.userId, workspaceId: this.state.workspaceId });
    //get browser permission
    this.handleFCMPermission();
    window.addEventListener('resize', this.onResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize, false);
  }

  onResize = () => {
    const width = window.innerWidth;
    const fullScreen = width > 350;
    this.props.setFullScreen(fullScreen);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (get(nextProps, 'response.user.response.user')) {
      const _user = get(nextProps, 'response.user.response.user', {});
      const _workspace = get(nextProps, 'response.user.response.workspace', {});
      if (this.state.isFirstLoad && _user) {
        const _isworkspace = _workspace ? true : false;
        this.setState({
          user: _user,
          workspace: _workspace,
          isFirstLoad: false,
          showWorkspaceMap: _isworkspace,
          availability: _user.user_workspace_relationships[0]["availability"],
        });
      }
    }

    // set availability
    if (nextProps.response.availability && nextProps.response.availability.hasOwnProperty('response')) {
      const _availability = nextProps.response.availability.response.availability;
      const _userId = nextProps.response.availability.response.userId;
      if (_availability !== this.state.availability && this.state.user._id === _userId) {
        this.setState({
          availability: _availability,
        });
      }
    }

    return true;
  }

  handleModelClose = () => {
    this.setState({ showWorkspaceMap: false });
  };

  handleModelShow = () => {
    this.setState({ showWorkspaceMap: true });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleAvailability = event => {
    console.log('called')
    this.props.setAvailability({
      availability: !this.state.availability,
      userId:parseInt(this.state.userId),
      workspaceId: this.state.workspaceId
    });
  };

  onMessage = (payload) => {
    console.log('-------------onMessage--push notification recieved------------------',payload);
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      if (registrations.length === 0) {
        // No service workers registered
        return;
      }
      else{
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: payload.notification.icon
        };
        // registration[1] refers to firebase service worker , registration[0] is create-react-app service worker
        registrations[0].showNotification(notificationTitle, notificationOptions);
      }
    });
  }

  handleFCMPermission = () => {
    if (FCMMessaging) {
      FCMMessaging.onMessage(this.onMessage);
      FCMMessaging.requestPermission()
        .then(() => {
          if (Notification.permission !== 'granted') {
            FCMMessaging.getToken()
              .then(currentToken => {
                if (currentToken) {
                  console.log('Token generated is ', currentToken);
                  this.setState({
                    status: 'success',
                    message: currentToken,
                  });
                  // sendTokenToServer(currentToken);
                  // updateUIForPushEnabled(currentToken);
                } else {
                  // Show permission request.
                  console.log('No Instance ID token available. Request permission to generate one.');
                  this.setState({
                    status: 'error',
                    message: 'No Instance ID token available. Request permission to generate one.',
                  });

                  // Show permission UI.
                  // updateUIForPushPermissionRequired();
                  // setTokenSentToServer(false);
                }
              })
              .catch(err => {
                console.log('An error occurred while retrieving token. ', err);
                // this.setState(...this.state, {
                //   status: 'error',
                //   message: 'An error occurred while retrieving token.',
                // });

                // showToken('Error retrieving Instance ID token. ', err);
                // setTokenSentToServer(false);
              });
          }
        })
        .catch(err => {
          console.log('Unable to get permission to notify.', err);
        });
    }
  };

  showSideBar() {
    const {manage} = this.props.response
    const {fullScreen = false, screen = 'inbox'} = manage;
    if(isDesktopApp()) {
      if(fullScreen || screen === 'inbox') {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-layout">
          {
            this.showSideBar() &&
            <div className="sidebar c-vh-100">
              <Sidebar user={this.state} handleAvailability={this.handleAvailability} />
            </div>
          }
          {this.props.submenu && (
            <div className="sidebar-submenu c-vh-100">
              <SubMenu />
            </div>
          )}
          <main className="c-main-layout">{this.props.children}</main>
        </div>
        <div id="ReactModalPortal" className="ReactModalPortal" role="presentation" />
        <div id="ReactToastPortal" className="ReactToastPortal" role="presentation" />
        <ToastContainer autoClose={3000} position="top-right" draggable={false} hideProgressBar pauseOnHover />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getUserDataAction,
      setAvailability,
      setFullScreen,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({
  response,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainLayout);

// export default React.memo(MainLayout);
