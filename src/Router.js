import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as firebase from 'firebase';

import App from './App';
import { ConnectedRouter } from 'connected-react-router';
import ContentLoader from 'react-content-loader';
import { ROUTES } from './common/constants';
import { history } from './store/index';
import { updateFirebaseId } from 'store/api';
import isElectron from 'is-electron';

//layout routing
const AppRoute = ({ component: Component, layout: Layout, submenu: Submenu, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Layout submenu={Submenu ? Submenu : false}>
        <Component {...props} />
      </Layout>
    )}
  />
);

//layout import
const AuthLayout = lazy(() => import('./components/Layouts/authLayout'));
const MainLayout = lazy(() => import('./components/Layouts/mainLayout'));

//login
const SignIn = lazy(() => import('./components/Login/signin'));
const Login = lazy(() => import('./components/Login/index'));
const setPwd = lazy(() => import('./components/Login/setPassword'));
const ForgotPwd = lazy(() => import('./components/Login/forgotPassword'));
const Logout = lazy(() => import('./components/Logout/index'));
const ForgotWorkspace = lazy(() => import('./components/Login/forgotWorkspace'));

//signup
const Register = lazy(() => import('./components/Signup/register'));
const Signup = lazy(() => import('./components/Signup/index'));
const WorkSpace = lazy(() => import('./components/Signup/workspace'));
const ChannelName = lazy(() => import('./components/Signup/channelname'));
const DropBox = lazy(() => import('./components/Signup/dropbox'));
const InviteTeam = lazy(() => import('./components/Signup/inviteteam'));
const FinalStep = lazy(() => import('./components/Signup/tellusmore'));
const InvitedJoin = lazy(() => import('./components/Signup/join'));
const InvitedSignup = lazy(() => import('./components/Signup/invitedSignup'));
const SignupOnboarding = lazy(()=>import('./components/Signup/signupOnboarding'));
//messages
const Messages = lazy(() => import('./components/Messages/index'));

//Files
const Files = lazy(() => import('./components/Files'));

//Manage
const Manage = lazy(() => import('./components/Manage'));
const Manage_Profile = lazy(() => import('./components/Manage/Profile'));
const Manage_Change_Password = lazy(() => import('./components/Manage/ChangePassword'));
const Manage_Notifications = lazy(() => import('./components/Manage/EmailNotifications'));
const Manage_Users = lazy(() => import('./components/Manage/Users'));
const Manage_Channels = lazy(() => import('./components/Manage/Channels'));
const Manage_Workspace = lazy(() => import('./components/Manage/MyWorkspace'));
const Manage_Registration = lazy(() => import('./components/Manage/Registration'));
const Manage_Billing = lazy(() => import('./components/Manage/Billing'));

//Error pages
const NotFound = lazy(() => import('./components/ErrorPage'));

const MainLayoutLoader = () => (
  <ContentLoader height={290} width={600} speed={2} primaryColor="#efefef" secondaryColor="#dad9d9">
    <circle cx="72" cy="56" r="12" />
    <rect x="90" y="53" rx="4" ry="4" width="107" height="4" />
    <rect x="90" y="63" rx="4" ry="4" width="50" height="3" />
    <rect x="-4" y="-17" rx="5" ry="5" width="60" height="300" />
    <rect x="211" y="-1" rx="0" ry="0" width="1" height="300" />
    <circle cx="72" cy="98" r="12" />
    <rect x="90" y="90" rx="4" ry="4" width="107" height="4" />
    <rect x="90" y="99" rx="4" ry="4" width="50" height="3" />
    <circle cx="72" cy="131" r="12" />
    <rect x="90" y="122" rx="4" ry="4" width="107" height="4" />
    <rect x="90" y="132" rx="4" ry="4" width="50" height="3" />
    <circle cx="227" cy="18" r="12" />
    <rect x="243" y="13" rx="0" ry="0" width="56" height="3" />
    <rect x="244" y="18" rx="0" ry="0" width="41" height="3" />
    <rect x="211" y="39" rx="0" ry="0" width="391" height="7" />
    <rect x="70" y="10" rx="0" ry="0" width="30" height="5" />
    <rect x="105" y="10" rx="0" ry="0" width="30" height="5" />
    <rect x="140" y="10" rx="0" ry="0" width="30" height="5" />
    <rect x="175" y="10" rx="0" ry="0" width="30" height="5" />
    <rect x="103" y="28" rx="0" ry="0" width="70" height="10" />
  </ContentLoader>
);

class Router extends Component {

  constructor(props) {
    super(props);
    this.registerFirebase();
    this.askForPermissioToReceiveNotifications();
  }

  async componentDidMount() {
    if(isElectron()) {
      window.ipcRenderer.on('register-notification', async (e, token) => {
        try {
          console.log('token.....', token);
          await updateFirebaseId(token);
        } catch (error) {
          console.error('FIREBASE TOKEN', error);
        }
      });
    }
  }

  registerFirebase = () => {
    const firebaseConfig = {
      apiKey: "AIzaSyCviH9Y3SmateN1w1g8l7Bx3WtifQ0MjmU",
      authDomain: "ubblu-notifications.firebaseapp.com",
      databaseURL: "https://ubblu-notifications.firebaseio.com",
      projectId: "ubblu-notifications",
      storageBucket: "ubblu-notifications.appspot.com",
      messagingSenderId: "432182666518",
      appId: "1:432182666518:web:acf8377106648888489c37",
      measurementId: "G-ZLL5L8TWYM"
    };
    firebase.initializeApp(firebaseConfig);
  }

  askForPermissioToReceiveNotifications = async () => {
    try {
      if(isElectron()) {
        window.ipcRenderer.send('get-notification-token');
      } else {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        await updateFirebaseId(token);
        return token;
      }
    } catch (error) {
      console.error('FIREBASE TOKEN', error);
    }
  }

  render() {
    return (
      <ConnectedRouter history={history}>
        <Suspense fallback={<MainLayoutLoader />}>
          <Switch>
            <AppRoute layout={AuthLayout} exact path={ROUTES.APP_ROOT} component={App} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNIN} component={SignIn} />
            <AppRoute layout={AuthLayout} exact path={[ROUTES.LOGIN, ROUTES.LOGIN_ROUTE]} component={Login} />
            <AppRoute layout={AuthLayout} exact path={(ROUTES.LOGOUT, ROUTES.LOGOUT_ROUTE)} component={Logout} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.FORGOT} component={ForgotPwd} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.FORGOT_WORKSPACE} component={ForgotWorkspace} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SETPWD} component={setPwd} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.REGISTER} component={Register} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP} component={Signup} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_WORKSPACE} component={WorkSpace} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_CHANNEL} component={ChannelName} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_DROPBOX} component={DropBox} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_INVITE} component={InviteTeam} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_FINAL} component={FinalStep} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_JOIN} component={InvitedJoin} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_INVITED} component={InvitedSignup} />
            <AppRoute layout={AuthLayout} exact path={ROUTES.SIGNUP_ONBOARDING} component={SignupOnboarding} />
            {/* Main Layout */}
            <AppRoute layout={MainLayout} exact path={ROUTES.MESSAGES_ROUTE} component={Messages} />
            <AppRoute layout={MainLayout} exact path={ROUTES.MESSAGES_ROUTE_ID} component={Messages} />
            <AppRoute layout={MainLayout} exact path={ROUTES.MESSAGES_ROUTE_DETAILS} component={Messages} />
            <AppRoute layout={MainLayout} exact path={ROUTES.MANAGE} component={Manage} submenu={true} />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_PROFILE}
              component={Manage_Profile}
              submenu={true}
            />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_CHANGE_PASSWORD}
              component={Manage_Change_Password}
              submenu={true}
            />           
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_EMAIL}
              component={Manage_Notifications}
              submenu={true}
            />
            <AppRoute layout={MainLayout} exact path={ROUTES.MANAGE_USERS} component={Manage_Users} submenu={true} />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_CHANNELS}
              component={Manage_Channels}
              submenu={true}
            />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_WORKSPACE}
              component={Manage_Workspace}
              submenu={true}
            />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_REGISTRATION}
              component={Manage_Registration}
              submenu={true}
            />
            <AppRoute
              layout={MainLayout}
              exact
              path={ROUTES.MANAGE_BILLING}
              component={Manage_Billing}
              submenu={true}
            />
            <AppRoute layout={MainLayout} exact path={ROUTES.FILES} component={Files} submenu={false} />

            {/* Not found */}
            <AppRoute layout={AuthLayout} component={NotFound} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    );
  }
}

export default Router;
