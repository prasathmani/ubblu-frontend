import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { signupWatcher1 } from 'store/actions';
import { ROUTES } from 'common/constants';
import { getURLParameter, setCookie } from 'common/utils';

import './index.scss';
import { WORKSPACEID } from 'common/utils/helper';

class Signup extends Component {
  state = {
    token: getURLParameter('token') || '',
    workspaceId: getURLParameter('wid') || null,
    name: '',
    password: '',
    validated: false,
  };

  constructor(props) {
    super(props);
    document.title = 'Signup | Create a workspace | Ubblu';

    this.loading = false;
    this.errors = '';
  }

  async shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.store.signup && nextProps.store.signup.hasOwnProperty('response')) {
      const responseData = nextProps.store.signup.response;
      console.log('response data after register', responseData);
      if (responseData && responseData.success && responseData.data.token) {
        await setCookie('at', responseData.data.token, 1);
        await setCookie('uid', responseData.data.user.id, 1);
        if (responseData.data.workspace && responseData.data.workspace.id) {
          await setCookie('wid', responseData.data.workspace.id, 1);
          // this.props.push(ROUTES.MESSAGES);
          const baseUrl = '/' + responseData.data.workspace.id;
          this.props.push('/');
        } else {
          console.log('this props push ', this.props);
          this.props.push(ROUTES.SIGNUP_WORKSPACE);
        }
      } else {
        this.errors = responseData['errors'] && responseData['errors'].length ? responseData['errors'][0] : 'Something went wrong!';
        this.loading = false;

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
        workspaceId: this.state.workspaceId,
        name: this.state.name,
        password: this.state.password,
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
    const { token, name, password, validated } = this.state;

    //handle the api response
    // if (this.props.store.signup && this.props.store.signup.hasOwnProperty('response')) {
    //   const userData = this.props.store.signup.response;
    //   if (!userData.success) {
    //     this.loading = false;
    //     this.errors = userData.errors;
    //   }
    // }

    
  

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit} noValidate validated={validated}>
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
      // add other watcher sagas to this object to map them to props
    },
    dispatch,
  );
};

const mapStateToProps = store => ({
  store,
  push,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
