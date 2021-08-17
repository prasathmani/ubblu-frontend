import './index.scss';

import { Button, Form } from 'react-bootstrap';
import React, { Component } from 'react';
import { getURLParameter, setCookie } from 'common/utils';

import { ROUTES } from 'common/constants';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { signupWatcher1 } from 'store/actions';

class InvitedSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: getURLParameter('email') || '',
      token: getURLParameter('token') || '',
      workspaceId: getURLParameter('id') || '',
      name: '',
      password: '',
      validated: false,
    };

    this.loading = false;
    this.errors = '';

    document.title = 'Signup | Join into workspace | Ubblu';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.store.signup && nextProps.store.signup.hasOwnProperty('response')) {
      const responseData = nextProps.store.signup.response;
      if (responseData.success && responseData.data.token) {
        setCookie('at', responseData.data.token, 1);
        setCookie('uid', responseData.data.user.id, 1);
        setCookie('wid', this.state.workspaceId, 1);
        this.props.push(ROUTES.MESSAGES);
      }
    }
    return true;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      this.errors = '';
      this.loading = true;
      //call signup step 1 watcher
      this.props.signupWatcher1({
        token: this.state.token,
        email: this.state.email,
        name: this.state.name,
        password: this.state.password,
        workSpaceId: this.state.workSpaceId,
      });
    } else if (form.checkValidity() === false) {
      this.errors = 'Invaild user details';
      this.loading = false;
      event.stopPropagation();
    }

    this.setState({
      validated: true,
    });
  };

  render() {
    const { email, token, name, password, validated } = this.state;

    //handle the api response
    if (this.props.store.signup && this.props.store.signup.hasOwnProperty('response')) {
      const userData = this.props.store.signup.response;
      if (!userData.success) {
        this.loading = false;
        this.errors = userData.errors;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup - Create your Workspace</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit} noValidate  validated={validated}>
          <Form.Group controlId="signupEmail" className="input-group">
            <Form.Control type="hidden" name="email" value={email} placeholder="Email" aria-label="Enter email" />
            <Form.Control.Feedback type="invalid">Invaild email address</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="signupUsername" className="input-group">
            <div className="input-group-prepend">
              <i className="far fa-user" />
            </div>
            <Form.Control
              type="text"
              name="name"
              value={name}
              placeholder="Full Name"
              className="signup-username"
              aria-label="Enter full name"
              pattern="^\s*([A-Za-z]{1,}([\.,] |[-']| )?)+[A-Za-z]+\.?\s*$"
              required
              onChange={this.handleChange}
            />
             <Form.Control.Feedback type="invalid">Full Name should be 7+ characters</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">No special characters and numbers allowed</Form.Control.Feedback>
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
              pattern=".{8,25}"
              required
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type="invalid">Your password should be 8+ characters</Form.Control.Feedback>
          </Form.Group>

          <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
            {this.errors}
          </Form.Control.Feedback>

          <input type="hidden" name="token" value={token} />

          <Button variant="primary" type="submit" aria-label="Sign in" disabled={this.loading}>
            Next &nbsp;&nbsp;
            <span
              className={this.loading ? 'spinner-border spinner-border-sm' : 'hide'}
              role="status"
              aria-hidden="true"
            />
          </Button>
        </Form>
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupWatcher1,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = store => ({
  store,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InvitedSignup);
