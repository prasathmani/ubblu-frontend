import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { forgotPwdAction } from 'store/actions';
import { push } from 'connected-react-router';
import { ROUTES } from 'common/constants';
import { getCookie } from 'common/utils';
import { WORKSPACEID } from 'common/utils/helper';

class ForgotPassword extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      email: '',
      enableLoader: false,
    };

    this.errors = '';
    this.success = null;
  }

  componentDidMount() {
    if (getCookie('at')) {
      this.props.push(ROUTES.APP_ROOT);
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.email !== '') {
      this.errors = '';
      this.setState({ enableLoader: true });
      this.props.forgotPwdAction({
        email: this.state.email,
        workspaceId: WORKSPACEID()
      });
    }
  };

  render() {
    const { enableLoader } = this.state;
    let isEmailChkSuccess = false,
      enableLoaderChk = enableLoader;

    if (this.props.response.login && this.props.response.login.hasOwnProperty('response')) {
      const response = this.props.response.login.response;
      enableLoaderChk = false;
      if (response.success) {
        this.success = true;
        isEmailChkSuccess = true;
        this.myFormRef.reset();
      } else {
        this.errors = response.errors;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Password Reset</div>

        {this.success ? (
          <Form className="auth__layout__form">
            <Form.Control.Feedback className={isEmailChkSuccess ? 'd-block' : ''}>
              If an account with this email exists, then a forgot password email has been sent! Check your Inbox!
            </Form.Control.Feedback>
          </Form>
        ) : (
          <Form className="auth__layout__form" ref={el => (this.myFormRef = el)} onSubmit={this.handleSubmit}>
            <Form.Label>To reset your password, enter the registered email address</Form.Label>
            <Form.Group controlId="loginForm" className="input-group mt-2">
              <Form.Control
                type="email"
                name="email"
                placeholder="you@example.com"
                className="workspace-name"
                aria-label="you@example.com"
                required
                onChange={this.handleChange}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
              />
            </Form.Group>

            <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
              {this.errors}
            </Form.Control.Feedback>

            <Button variant="primary" type="submit" aria-label="Get Reset Link" disabled={enableLoaderChk}>
              Get Reset Link {'   '}
              <span
                className={enableLoaderChk ? 'spinner-border spinner-border-sm' : 'hide'}
                role="status"
                aria-hidden="true"
              />
            </Button>
          </Form>
        )}
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      forgotPwdAction,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
