import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { push } from 'connected-react-router';

import store from 'store';
import { signupWatcher2 } from 'store/actions';
import { ROUTES } from 'common/constants';
import { getCookie, setCookie } from 'common/utils';
import { WORKSPACE_DATA } from './data.js';
import { checkWorkSpaceAbility } from 'store/api';

class Workspace extends Component {
  state = {
    name: '',
    isWorkspaceAvailable: false,
    errors: '',
  };

  constructor(props) {
    super(props);
    document.title = 'Create a workspace | Ubblu';

    this.loading = false;
    this.error_local = '';
  }

  componentDidMount() {
    if (!getCookie('at')) {
      store.dispatch(push(ROUTES.SIGNUP));
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.store.signup && nextProps.store.signup.hasOwnProperty('response')) {
      const responseData = nextProps.store.signup.response;
      if (responseData.success && responseData.data.workspace.id) {
        let _url = ROUTES.SIGNUP_CHANNEL + '?wid=' + responseData.data.workspace.id;
        setCookie('wid', responseData.data.workspace.id, 1);

        store.dispatch(push(_url));
      }
    }
    return true;
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleCheckAbility = event => {
    event.preventDefault();
    const _name = this.state.name;
    if (_name) {
      const payload = { name: this.state.name };
      checkWorkSpaceAbility(payload)
        .then(response => {
          if (response.data.status === 1) {
            this.setState({
              isWorkspaceAvailable: true,
              errors: '',
            });
          } else {
            this.setState({
              isWorkspaceAvailable: false,
              errors: response.data.message,
            });
          }
        })
        .catch(error => {
          this.setState({
            isWorkspaceAvailable: false,
            errors: error.response.data.message,
          });
        });
    } else {
      this.setState({
        isWorkspaceAvailable: false,
        errors: 'Name should not be empty',
      });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.isWorkspaceAvailable) {
      this.loading = true;
      this.props.signupWatcher2({
        name: this.state.name,
      });
    }
  };

  render() {
    const { name, isWorkspaceAvailable, errors } = this.state;

    //handle the api response
    if (this.props.store.signup && this.props.store.signup.hasOwnProperty('response')) {
      const isSuccess = this.props.store.signup.response;
      if (!isSuccess) {
        this.loading = false;
        this.error_local = isSuccess;
      }
    }

    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Signup - Create your Workspace</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit}>
          <Form.Label>
            {WORKSPACE_DATA.HEADING}
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>{WORKSPACE_DATA.SUB_HEADING}</Tooltip>}
            >
              <i className="fas fa-info-circle border-0 ml-2" />
            </OverlayTrigger>
          </Form.Label>

          <div className="mt-4 mb-2 create__workspace">
            <div>
              <Form.Label className="workspace__domainname">{WORKSPACE_DATA.DOMAIN_NAME}</Form.Label>
            </div>
            <div>
              <Form.Control
                type="text"
                name="name"
                value={name}
                placeholder="e.g. UI or UI Development"
                className="workspace__name"
                aria-label="e.g. UI or UI Development"
                pattern="[a-zA-Z0-9\s]+"
                required
                onChange={this.handleChange}
              />
            </div>
            <div>
              <Form.Label className="workspace__check">
                <Button
                  variant="outline-primary"
                  onClick={this.handleCheckAbility}
                  size="sm"
                  type="button"
                  aria-label={WORKSPACE_DATA.CHECK_ABILITY}
                >
                  {WORKSPACE_DATA.CHECK_ABILITY}
                </Button>
              </Form.Label>
            </div>
          </div>

          <Form.Control.Feedback type="valid" className={isWorkspaceAvailable ? 'd-block mt-3' : ''}>
            Congratulation! Your workspace is available
          </Form.Control.Feedback>

          <Form.Control.Feedback type="invalid" className={errors ? 'd-block mt-3' : ''}>
            {errors}
          </Form.Control.Feedback>

          <Button variant="primary" type="submit" aria-label={WORKSPACE_DATA.SUBMIT_BTN} disabled={this.loading}>
            {WORKSPACE_DATA.SUBMIT_BTN}
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
      signupWatcher2,
      // add other watcher sagas to this object to map them to props
    },
    dispatch,
  );
};

const mapStateToProps = store => ({
  store,
});

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
