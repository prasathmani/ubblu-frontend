import React, { Component } from 'react';
import { Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
// import { forgotPwdAction } from 'store/actions';
import { push } from 'connected-react-router';
import { ROUTES } from 'common/constants';
import { getCookie } from 'common/utils';
import { findWorkspace } from 'store/api';

class signupOnboarding extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <div className="connect-to-google">
          <div className="auth__layout__header">Connect to your Google Drive/Dropbox </div>

          <Form className="auth__layout__form" onSubmit={this.handleSubmit}>
            <p className="auth__signin__text">
              <b>To upload files, ubblu interactes with your Google Drive/Dropbox</b>
            </p>
            <ul className="list-unstyled">
              <li>
              <img src="/assets/images/google_drive.png"></img>
              <Form.Check type="radio" id="drive" label="Google drive" />
              </li>
              <li>
              <img src="/assets/images/dropbox.png"></img>
               <Form.Check type="radio" id="drive" label="Dropbox" />

              </li>
              
            </ul>
            
              <a href="" className="skip">skip</a>
            </Form>
        </div>
      </React.Fragment>
    );
  }
}

export default signupOnboarding;
