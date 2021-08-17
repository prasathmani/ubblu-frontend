import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import { CHANNEL_DATA } from './data.js';
import store from 'store';
import { signupWatcher3 } from 'store/actions';
import { ROUTES } from 'common/constants';
import { getURLParameter, getCookie } from 'common/utils';

class Channelname extends Component {
  state = {
    workspaceId: getURLParameter('wid') || null,
    validated: false,
    text: '',
  };
  constructor(props) {
    super(props);
    document.title = 'Create a workspace | Ubblu';

    this.loading = false;
    this.errors = '';
  }

  componentDidMount() {
    if (!getCookie('at')) {
      store.dispatch(push(ROUTES.SIGNUP));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('check next props', nextProps);
    if (nextProps.response.signup && nextProps.response.signup.hasOwnProperty('response')) {
      const responseData = nextProps.response.signup.response;
      if (responseData.success && responseData.data.status === 1) {
        let _url = ROUTES.SIGNUP_DROPBOX + '?wid=' + responseData.data.department  .workspace_id;
        store.dispatch(push(_url));
      }
    }
    return true;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === true && this.state.workspaceId) {
      this.loading = true;
      this.props.signupWatcher3({
        name: this.state.text,
        workspaceId: this.state.workspaceId,
      });
    } else if (form.checkValidity() === false) {
      this.loading = false;
      event.stopPropagation();
    }
    this.setState({
      validated: true,
    });
  };

  render() {
    const { validated, text } = this.state;

    //handle the api response
    if (this.props.response.signup && this.props.response.signup.hasOwnProperty('response')) {
      const userData = this.props.response.signup.response;
      const isSuccess = userData.data.status;
      if (!userData.status && isSuccess === 0) {
        this.loading = false;
        this.errors = userData.data.message;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit} noValidate validated={validated}>
          <Form.Label>{CHANNEL_DATA.HEADING}</Form.Label>
          <Form.Group controlId="channelForm" className="input-group mt-2">
            <Form.Control
              type="text"
              name="text"
              value={text}
              placeholder="sales, marketing, promotions"
              className="channel-name"
              aria-label="sales, marketing, promotions"
              pattern="[a-zA-Z0-9\s]+"
              required
              onChange={this.handleChange}
            />
            <Form.Control.Feedback type="invalid">
              please enter the channel name with at least 4 characters
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
            {this.errors}
          </Form.Control.Feedback>

          <Button variant="primary" type="submit" aria-label={CHANNEL_DATA.SUBMIT_BTN} disabled={this.loading}>
            {CHANNEL_DATA.SUBMIT_BTN}
            &nbsp;&nbsp;
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
      signupWatcher3,
      // add other watcher sagas to this object to map them to props
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
)(Channelname);
