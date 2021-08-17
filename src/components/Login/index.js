import './index.scss';

import { Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import { getCookie, getURLParameter, setCookie } from 'common/utils';

import { Link } from 'react-router-dom';
import { ROUTES } from 'common/constants';
import ReCAPTCHA from 'react-google-recaptcha';
import { WORKSPACEID } from 'common/utils/helper';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginUserAction } from 'store/actions';
import { push } from 'connected-react-router';

class Login extends Component {
  constructor(props) {
    super(props);
    document.title = 'Ubblu | Login';

    this.state = {
      isLoggedIn: false,
      captcha: null,
      email: '',
      password: '',
      workspaceId: WORKSPACEID(),
      token: getURLParameter('token') || '',    
    };

    this.loading = false;
    this.errors = '';
    this.isShowCaptcha = 0;
  }

  isWorkspaceLogin = status => {
    if (!this.state.workspaceId) {
      this.props.push(ROUTES.SIGNIN);
    } else {
      this.setState({ isLoggedIn: status });
    }
  };

  componentDidMount() {
    const workspace = JSON.parse(sessionStorage.getItem("workspace") || "{}");
    this.setState({workspace});
    if (!getCookie('at')) {
      this.isWorkspaceLogin(false);
    } else {
      this.props.push(ROUTES.MESSAGES);
    }
  }

  componentWillUnmount() {
    sessionStorage.removeItem('workspace');
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.response.login && nextProps.response.login.hasOwnProperty('response')) {

      const responseData = nextProps.response.login.response;
      console.log('response after login', nextProps.response);
      if (responseData && responseData.success && responseData.data.token) {
        //console.log('response after login', responseData.data.user.is_cookie);
        if(responseData.data.user.is_cookie){
          setCookie('is_cookie', responseData.data.user.is_cookie, 1);         
          setCookie('at', responseData.data.token, 1);
          setCookie('uid', responseData.data.user.id, 1);
          setCookie('wid', this.state.workspaceId, 1);
          this.props.push(ROUTES.MESSAGES);
          return false;
        }
        else{
          localStorage.setItem('is_cookie',responseData.data.user.is_cookie, 1);         
          localStorage.setItem('at', responseData.data.token, 1);
          localStorage.setItem('uid', responseData.data.user.id, 1);
          localStorage.setItem('wid', this.state.workspaceId, 1);
          this.props.push(ROUTES.MESSAGES);
          return false; 
        }    
      }
    }
    return true;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleReCaptcha = value => {
    this.setState({ captcha: value });
  };

  validateCaptcha = () => {
    if (this.isShowCaptcha >= 5) {
      if (this.state.captcha) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state) && this.validateCaptcha()) {
      const _workspaceId = this.state.workspaceId ? parseInt(this.state.workspaceId) : '';
      this.errors = '';
      this.loading = true;
      this.props.loginUserAction({
        email: this.state.email,
        password: this.state.password,
        workspaceId: _workspaceId,
        token: this.state.token,
      });
    }
  };

  isFormValid = ({ email, password }) => email && password;

  render() {
    const { email, password, workspace:{name} = {} } = this.state;

    if (this.props.response.login && this.props.response.login.hasOwnProperty('response')) {
      const response = this.props.response.login.response;
      console.log('response in login comp', response);
      if (!response.success || response.errors[0].status === 0) {
        this.loading = false;
        this.isShowCaptcha = response.errors[0].invalidAttemptCount;
        this.errors = response.errors[0].message || response.errors[0];
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header">{`Welcome ${name ? name : 'to'} Workspace`}</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit}>
          <Form.Group controlId="loginForm" className="input-group">
            <div className="input-group-prepend">
              <i className="far fa-envelope" />
            </div>
            <Form.Control
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              className="login-email"
              aria-label="Enter email"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,12}$"
              required
              onChange={this.handleChange}
              autoComplete="off"
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="input-group">
            <div className="input-group-prepend">
              <i className="fas fa-unlock-alt" />
            </div>
            <Form.Control
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              className="login-pwd"
              aria-label="Enter password"
              required
              onChange={this.handleChange}
            />
          </Form.Group>
          {this.isShowCaptcha >= 5 && (
            <ReCAPTCHA sitekey="6LfE9q0UAAAAAB6SYQ-39Pj1tWS8dNwqe8hhbpki" onChange={this.handleReCaptcha} />
          )}

          <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
            {this.errors}
          </Form.Control.Feedback>

          <Button variant="primary" type="submit" aria-label="Sign in" disabled={this.loading}>
            SIGN IN &nbsp;&nbsp;
            <span
              className={this.loading ? 'spinner-border spinner-border-sm' : 'hide'}
              role="status"
              aria-hidden="true"
            />
          </Button>

          <Form.Text className="text-muted mt-3">
            <Link to={ROUTES.FORGOT} className="login_forgot">
              Forgot Password ?
            </Link>
          </Form.Text>

          <Form.Label className="mt-4 text-center d-block app-none">
            Don't have an account yet? &nbsp;
            <Link to={ROUTES.REGISTER}>Signup</Link>
          </Form.Label>
        </Form>
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loginUserAction,
      push,
      // add other watcher sagas to this object to map them to props
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(Login);