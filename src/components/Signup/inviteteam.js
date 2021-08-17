import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Col, Row } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { INVITE_DATA } from './data.js';
import { getCookie, getURLParameter } from 'common/utils';
import { signupWatcher4 } from 'store/actions';
import { ROUTES } from 'common/constants';

class Inviteteam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: getURLParameter('wid') || null,
      inputs: ['input-0'],
      invitedEmail: '',
    };

    this.errors = '';
    this.loading = false;
  }

  componentDidMount() {
    if (!getCookie('at')) {
      this.props.push(ROUTES.SIGNUP);
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.response.signup && nextProps.response.signup.hasOwnProperty('response')) {
      const responseData = nextProps.response.signup.response;
      if (responseData.success && responseData.data.status === 1) {
        console.log('url',this.state.workspaceId)
        let _url = ROUTES.SIGNUP_FINAL + '?wid=' + this.state.workspaceId;
        this.props.push(_url);
      }
    }
    return true;
  }

  handleChange = (index, newValue) => {
    // const updatedArray = [...this.state.invitedEmail];
    // updatedArray[index] = newValue;
    // console.log(updatedArray);
    // this.setState({
    //   invitedEmail: updatedArray,
    // });
  };

  gotTo = event => {
    event.preventDefault();
    let _url = ROUTES.SIGNUP_FINAL + '?wid=' + this.state.workspaceId;
    this.props.push(_url);
  };

  appendInput = event => {
    event.preventDefault();
    var newInput = `input-${this.state.inputs.length}`;
    this.setState(prevState => ({ inputs: prevState.inputs.concat([newInput]) }));
  };

  handleSubmit = event => {
    event.preventDefault();
    this.loading = true;
    const formData = document.querySelectorAll('input[name=invitedEmail');
    let _emailList = [];
    formData.forEach(function(input) {
      _emailList.push(input.value);
    });
    if (_emailList && _emailList.length) {
      this.props.signupWatcher4({
        invitedEmail: _emailList,
        signupUser: true,
        workspaceId: this.state.workspaceId,
      });
    } else {
      this.gotTo(event);
    }
  };

  render() {
    const { value } = this.state;
    //handle the api response
    if (this.props.response.signup && this.props.response.signup.hasOwnProperty('response')) {
      const userData = this.props.response.signup.response;
      if (!userData.success || userData.data.status === 0) {
        this.loading = false;
        this.errors = userData.message;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup - Create your Workspace</div>
        <Form className="auth__layout__form invite" onSubmit={this.handleSubmit}>
          <input type="hidden" name="signupUser" value="true" />
          <Form.Label>{INVITE_DATA.HEADING}</Form.Label>

          <div className="mt-4 mb-2">
            <div className="invite_list">
              {this.state.inputs.map(index => (
                <Form.Control
                  key={index}
                  value={value}
                  type="email"
                  name="invitedEmail"
                  placeholder="name@example.com"
                  className="email__address mt-3 mb-2"
                  aria-label="email address"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                  onChange={e => this.handleChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>

          <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block mt-3' : ''}>
            {this.errors}
          </Form.Control.Feedback>
          <Row>
            <Col>
              <button
                type="button"
                className="invite__add_more"
                aria-label="Add more emails"
                onClick={this.appendInput}
              >
                <i className="fas fa-plus" /> {INVITE_DATA.ADD_BTN}
              </button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" aria-label={INVITE_DATA.SUBMIT_BTN} disabled={this.loading}>
                {INVITE_DATA.SUBMIT_BTN}
                &nbsp;&nbsp;
                <span
                  className={this.loading ? 'spinner-border spinner-border-sm' : 'hide'}
                  role="status"
                  aria-hidden="true"
                />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="mt-3">
                <a role="button" className="text-muted" onClick={this.gotTo}>
                  {INVITE_DATA.SKIP_BTN}
                </a>
              </p>
            </Col>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

// mapping dispatch functions to the props of LoginForm component
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupWatcher4,
      push,
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
)(Inviteteam);
