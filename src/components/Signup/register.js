import './index.scss';

import { Button, Form, Alert } from 'react-bootstrap';
import React, { Component } from 'react';

import { registerEmail, getUserDetails } from 'store/api';
import { WORKSPACEID } from 'common/utils/helper';
import workspace from './workspace';
import queryString from 'query-string';
import { getCookie, getURLParameter, getLoginUserId } from 'common/utils';
import { API } from 'common/constants';
import { getRelativeMessageURL, getRelativeChannelURL, getManageChannelsURL } from 'common/utils/messageHelpers';
import { toast } from 'react-toastify';

class Register extends Component {
  state = {
    email: '',
    isSuccess: false,
    validated: false,
    inviteType: null,
    channel: null,
    channelJoined: false,
    channelJoinedDetails: null,


  };

  constructor(props) {
    super(props);
    document.title = 'Register | Ubblu';

    this.loading = false;
    this.errors = '';
    this.isResend = false;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = event => {
    console.log('file sign')
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === true) {
      this.errors = '';
      this.loading = true;
      const workspaceId = parseInt(window.location.pathname.split('/')[1]);
      const _isResend = form.querySelector('.resend') ? true : false;

      const payload = {
        email: this.state.email,
        workspaceId: (workspaceId != NaN && workspaceId != undefined) ? workspaceId : null,
        inviteType: (this.state.inviteType != undefined && this.state.inviteType != null) ? this.state.inviteType.toUpperCase() : null,
        channel: this.state.channel
      };
      registerEmail(payload)
        .then(response => {
          if (response && response.success) {
            this.errors = '';
            this.isResend = _isResend;
            console.log('response after', response);
            if (response.data.status && response.data.channel) {
              this.setState({
                channelJoined: true,
                channelJoinedDetails: {
                  channel: response.data.channel,
                  workspaceId: response.data.workspaceId,
                  userDetails: response.data.user.username,
                  channelName: response.data.channelName
                }
              });
            }
            this.setState({
              isSuccess: true,
            });
          } else {
            this.loading = false;
            this.errors = response && response.errors;
            this.isResend = _isResend;
            this.setState({
              isSuccess: false,
            });
          }
        })
        .catch(error => {
          this.loading = false;
          this.errors = error.message;
          this.isResend = _isResend;
          this.setState({
            isSuccess: false,
          });
        });
    } else if (form.checkValidity() === false) {
      // this.loading = false;
      event.stopPropagation();
    }

    this.setState({
      validated: true,
    });
  };


  async componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    console.log('url parameter', parsed);
    if (parsed.inviteType) {
      this.setState({
        inviteType: parsed.inviteType.toUpperCase()
      })
    }
    if (parsed.channel) {
      this.setState({
        channel: parseInt(parsed.channel)
      })
    }
    if (parsed.inviteType && parsed.channel) {
      if (getCookie('at')) {
        const userId = getLoginUserId();
        const userDetails = await getUserDetails(userId);
        console.log('user props', userDetails);
        if (userDetails.success && userDetails.data && userDetails.data.user) {
          const email = userDetails.data.user.email;
          this.errors = '';
          this.loading = true;
          const workspaceId = parseInt(window.location.pathname.split('/')[1]);
          const _isResend = false;
          const payload = {
            email: email,
            workspaceId: (workspaceId != NaN && workspaceId != undefined) ? workspaceId : null,
            inviteType: (this.state.inviteType != undefined && this.state.inviteType != null) ? this.state.inviteType : null,
            channel: this.state.channel
          };

          registerEmail(payload)
            .then(response => {
              if (response && response.success) {
                this.errors = '';
                this.isResend = _isResend;
                console.log('response after', response);
                if (response.data.status && response.data.channel) {
                  this.setState({
                    channelJoined: true,
                    channelJoinedDetails: {
                      channel: response.data.channel,
                      channelName: response.data.channelName,
                      workspaceId: response.data.workspaceId,
                      userDetails: response.data.user.username
                    }
                  });
                }
                this.setState({
                  isSuccess: true,
                });
                toast.success('SUCCESS: Channel joined successfully!');
                this.props.history.push(getRelativeChannelURL(this.state.channelJoinedDetails.channel))
              } else {
                this.loading = false;
                this.errors = response && response.errors;
                this.isResend = _isResend;
                this.setState({
                  isSuccess: false,
                });
              }
            })
            .catch(error => {
              this.loading = false;
              this.errors = error.message;
              this.isResend = _isResend;
              this.setState({
                isSuccess: false,
              });
            });




        }
      }
    }
    if(parsed.email){
      const {email} = parsed;
      this.setState({email});
    }
  }
  render() {
    const { email, validated } = this.state;
    const workspaceId = parseInt(window.location.pathname.split('/')[1]);
    console.log('workspace id', this.state.channelJoinedDetails);


    return (
      <React.Fragment>
        <div className="auth__layout__header text-center">Getting Started with Ubblu</div>

        <Form className="auth__layout__form" onSubmit={this.handleSubmit} noValidate validated={validated}>
          {this.state.isSuccess ? (

            this.state.channelJoined ? <div>
              <div>
                <Alert variant={'info'}>
                  <Alert.Heading>Channel Joined </Alert.Heading>
                  <p> You've been added successfully to the  &nbsp; <span style={{ font: 'bold', color: 'black' }}> {this.state.channelJoinedDetails.channelName} </span> &nbsp; channel </p>
                  <hr />
                  <Alert.Link href={`${API.BASE_FRONTEND_URL}/${this.state.channelJoinedDetails.workspaceId}/login`}
                  >CLICK HERE</Alert.Link>  &nbsp;  to Login
                </Alert>

              </div>
            </div> :
              <div>
                <p>
                  <strong>Confirm your email before takeoff</strong>
                </p>
                <p>
                  Click confirm in the email we sent to &nbsp;
                <a className="underline" href={'mailto:' + this.state.email}>
                    {this.state.email}
                  </a>
                  , and you'll be ready to go. Don't forget to check your spam folder.
              </p>
                {this.isResend && (
                  <p className="p-1 alert-success" role="alert">
                    Succss! Email has been resent.
                  </p>
                )}
                <input type="hidden" name="email" value={this.state.email} />
                <Button variant="link" size="sm" type="submit" className="text-left resend">
                  <i className="fas fa-retweet" /> Resend
              </Button>
              </div>
          ) : (
              <React.Fragment>
                <label>Enter your email address to create a new workspace</label>
                <Form.Group controlId="signupEmail" className="input-group">
                  <div className="input-group-prepend">
                    <i className="far fa-envelope" />
                  </div>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    className="signup-email"
                    aria-label="Enter email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    required
                    onChange={this.handleChange}
                  />
                  <Form.Control.Feedback type="invalid">Invaild email address</Form.Control.Feedback>
                </Form.Group>

                <Form.Control.Feedback type="invalid" className={this.errors ? 'd-block' : ''}>
                  {this.errors}
                </Form.Control.Feedback>

                <Button variant="primary" size="lg" type="submit" aria-label="Sign in" disabled={this.loading}>
                  REGISTER &nbsp;&nbsp;
                <span
                    className={this.loading ? 'spinner-border spinner-border-sm' : 'hide'}
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              </React.Fragment>
            )}
        </Form>
      </React.Fragment>
    );
  }
}

export default Register;
