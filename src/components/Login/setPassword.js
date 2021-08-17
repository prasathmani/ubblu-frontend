import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Col, Row, Image } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';
import { API, ROUTES } from 'common/constants';
import { setPasswordAction } from 'store/actions';
import { getURLParameter, getCookie } from 'common/utils';


const psswrd_reset_success_style = {
  "display": "block",
  "textAlign": "center",
  "textDecoration": "underline"
}
class SetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      token: getURLParameter('token'),
      confirmPassword: null,
      errors: '',
    };
    this.errorMsg = '';
    this.success = null;
    this.loading = false;
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
    this.loading = false;
    if (this.state.password !== '' && this.state.password === this.state.confirmPassword) {
      this.errors = '';
      this.props.setPasswordAction({
        token: this.state.token,
        password: this.state.password,
      });
    } else {
      this.setState({ errors: 'Confirm password does not match' });
    }
  };

  render() {
    const { errors } = this.state;
    this.errorMsg = '';

    if (this.props.response.login && this.props.response.login.hasOwnProperty('response')) {
      const response = this.props.response.login.response;
      if (response.success && response.data.status === 1) {
        this.success = response.data.message;
        this.errorMsg = '';
        this.myFormRef.reset();
      } else {
        this.errorMsg = response.errors;
      }
    }

    let errorMsgTxt = this.errorMsg ? this.errorMsg : errors;
    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Set New Password</div>
        {this.success ? (
          <Form className="auth__layout__form">
            {/*<Form.Control.Feedback className="d-block">Password has been updated Back to login</Form.Control.Feedback>*/}
            <Link style={psswrd_reset_success_style} to={ROUTES.SIGNIN}>Password has been updated Back to login</Link>
          </Form>
        ) : (
            <Form className="auth__layout__form" ref={el => (this.myFormRef = el)} onSubmit={this.handleSubmit}>
              <Form.Label className="mb-4">Set your new password</Form.Label>
              <Form.Group as={Row} controlId="formPlaintextPassword">
                <Form.Label column sm="5">
                  New Password
              </Form.Label>
                <Col sm="7">
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPlaintextPassword1">
                <Form.Label column sm="5">
                  Confirm Password
              </Form.Label>
                <Col sm="7">
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Password"
                    required
                    onChange={this.handleChange}
                  />
                </Col>
              </Form.Group>

              <Form.Control.Feedback type="invalid" className={errorMsgTxt ? 'd-block' : ''}>
                {errorMsgTxt}
              </Form.Control.Feedback>

              <Button variant="primary" type="submit" aria-label="Change Password" disabled={this.loading}>
                <span
                  className={this.loading ? 'spinner-grow spinner-grow-sm' : 'hide'}
                  role="status"
                  aria-hidden="true"
                />
                Change Password
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
      setPasswordAction,
      push,
    },
    dispatch,
  );
};

const mapStateToProps = response => ({ response });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetPassword);
