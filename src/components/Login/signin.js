import './index.scss';

import { Button, Col, Form, Row } from 'react-bootstrap';
import { DOMAIN, ROUTES } from 'common/constants';
import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import { WORKSPACEID } from 'common/utils/helper';
import { push } from 'connected-react-router';

import { checkWorkPlaceName } from 'store/api';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      validated: false,
      error: '',
      loading: false,
    };
    this.domain = '.ubblu.com';
  }

  //navigate user to workspace with subdomain
  setSubDominan() {
    let host = window.location.host;
    let protocol = window.location.protocol;
    let subdomain = this.state.name + '.';

    let full_url = protocol + '//' + subdomain + host + ROUTES.LOGIN;
    window.location.assign(full_url);
  }

  componentWillMount() {
    if (WORKSPACEID()) {
      this.props.history.push('/')
    }
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      checkWorkPlaceName({ name: this.state.name })
        .then(response => {
          if (response.success && response.data.status === 0) {
            if (response.data.workspace && response.data.workspace.id) {
              const {name} = response.data.workspace;
              let _url = `https://${name}.ubblu.com`; /*response.data.workspace.id + ROUTES.LOGIN;*/
              sessionStorage.setItem("workspace",JSON.stringify(response.data.workspace));
              /*window.location.assign(_url);*/
              window.location.href = _url;
            }
          } else {
            this.setState({
              validated: true,
              error: 'ERROR: No such workspace exists!',
              loading: false,
            });
          }
        })
        .catch(error => {
          this.setState({
            validated: true,
            error: 'ERROR: some error occurred try again!',
            loading: false,
          });
        });
    } else if (form.checkValidity() === false) {
      this.setState({
        validated: true,
        error: 'ERROR: some error occurred try again!',
        loading: false,
      });
    }
  };
  render() {
    const { name, validated, error, loading } = this.state;

    return (
      <React.Fragment>
        <div className="auth__layout__header">Sign in to your Workspace</div>
        <Form className="auth__layout__form" onSubmit={this.handleSubmit}>
          <label>Enter your workspace’s Ubblu URL.</label>
          <Form.Group as={Row} controlId="formPlaintextEmail">
            <Form.Label column sm="12" className="pl-0">
              <Form.Control
                type="text"
                name="name"
                value={name}
                placeholder="my-workspace"
                className="workspace__name auth__layout__workspace"
                aria-label="enter workspace url"
                pattern=".{4,50}"
                required
                onChange={this.handleChange}
              />
              <Col sm="3" className="pr-0 d-inline-block">
                <span className="signin__domain">{this.domain}</span>
              </Col>
            </Form.Label>
            <Link className="forgot__workspace" to={ROUTES.FORGOT_WORKSPACE}> Forgot workspace ? </Link>
          </Form.Group>

          {error && (
            <Form.Control.Feedback type="invalid" className="d-block">
              {error}
            </Form.Control.Feedback>
          )}

          <Button variant="primary" type="submit" aria-label="Continue" disabled={loading}>
            Continue &nbsp;&nbsp;
            {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />}
          </Button>

          <Form.Label className="mt-4 text-center d-block app-none">
            Need to get your group started on Ubblu?
            <Link to={ROUTES.REGISTER}> Create a new workspace </Link>
          </Form.Label>
        </Form>
      </React.Fragment>
    );
  }
}
const mapStateToProps = response => ({ response });

export default (SignIn);
