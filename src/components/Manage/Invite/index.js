import { Button, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import { toast } from 'react-toastify';

import { WORKSPACEID } from 'common/utils/helper';
import { API } from 'common/constants';
import { copyToClipboard } from 'common/utils/';
import { inviteUsers2Workspace } from 'store/api';
import { connect } from 'react-redux';

class UsersInvites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [
        {
          name: '',
          email: '',
        },
      ],
      workspaceId: WORKSPACEID(),
      inviteUrl: '',
      email_placeholder: 'Email address',
      name_placeholder: 'Name(optional)',
      callback: this.props.callback,
      type: this.props.variant,
    };
  }

  handleChange = (i, type, event) => {
    const values = [...this.state.fields];
    if (type === 'name') {
      values[i].name = event.target.value;
    }
    if (type === 'email') {
      values[i].email = event.target.value;
    }
    this.setState({ fields: values });
  };

  handleAdd = () => {
    const values = [...this.state.fields];
    values.push({
      name: '',
      email: '',
    });
    this.setState({ fields: values });
  };

  handleRemove = i => {
    const values = [...this.state.fields];
    if (values.length > 1) {
      values.splice(i, 1);
      this.setState({ fields: values });
    } else {
      toast.error('Action not allowed!');
    }
  };

  copy2ClipBoard = e => {
    copyToClipboard(this.state.inviteUrl);
    toast.success('Copied to clipboard');
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.fields.length) {
      let payload = {
        invitedEmail: this.state.fields,
        type: this.state.type,
        workspaceId: this.state.workspaceId,
      };

      inviteUsers2Workspace(payload)
        .then(response => {
          console.log('dddd', response)
          if (response.success) {
            toast.success('SUCCESS: Invitation has been sent successfuly!');
            // this.state.callback(response);
            this.props.onSubmit();
          }else{
            console.log('invite error', response);
          toast.error(`ERROR: ${response.errors && response.errors[0]['message']}` );

          }
        })
        .catch(error => {
          console.error(error);
          console.log('invite error', error);

        });
    }
  };

  componentDidMount() {
      const {workspace:{name: workspaceName} = {}} = this.props;
      const [protocol, domain] = window.location.origin.split('//');
      this.setState({
        inviteUrl: this.props.channelId ?
        `${protocol}//${workspaceName}.${domain}/${WORKSPACEID()}/register?inviteType=employee&channel=${this.props.channelId}` :
        `${protocol}//${workspaceName}.${domain}/${WORKSPACEID()}/register?inviteType=${this.props.variant}`,
      });
  }

  render() {
    console.log('variant check', this.props)
    const { btnName, btnExtra, steps, workspace } = this.props;
    const { email_placeholder, name_placeholder, fields } = this.state;
    return (
      <Form method="post" onSubmit={this.handleSubmit}>
        {steps}
        <Form.Group as={Row}>
          <Form.Label column sm="12">
            Invitation Link
            <OverlayTrigger
              placement="right"
              overlay={
                <Tooltip id="tooltip-joininfo">Share this link to a new user or existing user for them to join</Tooltip>
              }
            >
              <Button variant="link">
                <i className="fas fa-info-circle" />
              </Button>
            </OverlayTrigger>{' '}
            :
          </Form.Label>
          <Col sm="12">
            <a href={this.state.inviteUrl} target="_blank" aria-label="invite URL" rel="noopener noreferrer">
              {this.state.inviteUrl}
            </a>
            &nbsp;
            <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-cpy2clp">Copy URL</Tooltip>}>
              <Button variant="link">
                <i className="far fa-copy" onClick={this.copy2ClipBoard} />
              </Button>
            </OverlayTrigger>
          </Col>
        </Form.Group>

        {fields.map((field, idx) => {
          return (
            <Form.Group as={Row} key={`fs-${idx}`} controlId={`fs-${idx}`}>
              <Col sm="4">
                <Form.Control
                  type="text"
                  placeholder={name_placeholder}
                  value={field.name}
                  onChange={e => this.handleChange(idx, 'name', e)}
                />
              </Col>
              <Col sm="6">
                <Form.Control
                  type="email"
                  placeholder={email_placeholder}
                  value={field.email || ''}
                  onChange={e => this.handleChange(idx, 'email', e)}
                  required
                />
              </Col>
              <Col sm="2">
                <Button type="button" variant="outline-danger" onClick={() => this.handleRemove(idx)}>
                  X
                </Button>
              </Col>
            </Form.Group>
          );
        })}

        <Button type="button" variant="link" onClick={() => this.handleAdd()}>
          <i className="fas fa-plus" /> Add New
        </Button>
        <hr />
        <Form.Group className="text-right">
          {btnExtra}
          <Button variant={btnName ? 'primary' : 'outline-primary'} type="submit">
            {btnName ? btnName : 'Invite'}
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

const mapStateToProps = response => {
  const {user:{response : {user:{user_workspace_relationships = []} = {} } = {}} = {}} = response;
  const [userWorkspaceRelationships] =  user_workspace_relationships;
  const workspace = (userWorkspaceRelationships || {}).workspace;
  return {workspace}
};
export default connect(mapStateToProps)(UsersInvites);