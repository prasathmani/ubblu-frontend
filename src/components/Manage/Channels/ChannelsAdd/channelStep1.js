import { Button, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React, { Component } from 'react';
import { toast } from 'react-toastify';

import { WORKSPACEID } from 'common/utils/helper';
import { addNewChannel } from 'store/api';
import { channel } from 'redux-saga';

class ChannelStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workspaceId: WORKSPACEID(),
      validated: false,
      channelType: "PUBLIC",
      descnt: 0,
      namecnt: 0,
    };

    this.name = null;
    this.desc = null;
    this.visibility = false;
    this.autoJoin = 'NONE';
  }

  saveAndContinue = e => {
    e.preventDefault();
    if (this.validateForm(e)) {
      this.saveNewChannel();
    } else {
      this.setState({
        validated: true,
      });
    }
  };

  validateForm = event => {
    const form = event.currentTarget;

    this.name = form.querySelector("input[name = 'name']").value;
    this.desc = form.querySelector("textarea[name = 'description']").value;
    this.visibility = form.querySelector("input[name = 'visibility']").checked;
    this.autoJoin = form.querySelector("select[name = 'auto_join']").value;
    // this.autoJoin = this.autoJoin;
    if (this.name) {
      return true;
    }
    return false;
  };

  onSelectChannelType = (channelType) => {
    this.setState(
      {
        channelType: channelType
      }
    )
  }

  saveNewChannel = () => {
    if (this.name) {
      let payload = {
        workspaceId: this.state.workspaceId,
        name: this.name,
        visibility: this.visibility,
        autoJoin: this.autoJoin,
        description: this.desc,
        channelType: this.state.channelType
      };
      addNewChannel(payload)
        .then(response => {
          if (response.success && response.data.status === 1) {
            toast.success('SUCCESS: Channel has been created successfuly!');
            this.props.setChannel(response.data.channel.id);
            this.props.nextStep();
          } else {
            // this.setState({
            //   validated: true,
            // });
            toast.error(`ERROR: ${response.errors}`);

          }
        })
        .catch(error => {
          // this.setState({
          //   validated: true,
          // });
          toast.error(`ERROR: ${error}`);

        });
    }
  };

  txtCounter = (e) => {
    if (e.target.name === 'name') {
      if (e.target.value) {
        this.setState({ namecnt: e.target.value.length })
      }
      else { this.setState({ namecnt: 0 }) }
    }
    else {
      if (e.target.value) {
        this.setState({ descnt: e.target.value.length })
      }
      else { this.setState({ descnt: 0 }) }
    }
  }

  render() {
    const { validated } = this.state;
    return (
      <Form className="channel-add-steps" onSubmit={this.saveAndContinue}>
        <div>
          <ol className="cd-breadcrumb triangle">
            <li className="current">
              <a href="#/step1">Step 1</a>
            </li>
            <li>
              <a href="#/step2">Step 2</a>
            </li>
            <li>
              <a href="#/step3">Step 3</a>
            </li>
          </ol>
        </div>

        {validated && (
          <Form.Control.Feedback type="invalid" className="d-block mb-2">
            Please enter valid data!
          </Form.Control.Feedback>
        )}

        <Form.Group>
          <Form.Control type="text" placeholder="Name" name="name" maxLength="70" onKeyDown={(e) => this.txtCounter(e)} required />
          <span className="text-right d-block">{this.state.namecnt}/70</span>
        </Form.Group>

        <Form.Group>
          <Form.Control as="textarea" rows="3" name="description" maxLength="120" onKeyDown={(e) => this.txtCounter(e)} placeholder="Type your description" />
          <span className="text-right d-block">{this.state.descnt}/120</span>
        </Form.Group>

        <Form.Group>
          <Form.Label>Auto Join</Form.Label>
          <Form.Control as="select" name="auto_join">
            <option value="NONE">NONE</option>
            <option value="ANYONE">ANYONE</option>
            <option value="ANY GUEST USER">ANY GUEST USER</option>
            <option value="ANY EMPLOYEE">ANY EMPLOYEE</option>
          </Form.Control>
        </Form.Group>

        <Form.Group>
          <Form.Label>Type</Form.Label>
          <div className="mb-3">

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-public`}>Public channel can be joined by anyone!</Tooltip>}
            >
              <Form.Check inline name="visibility" value="PUBLIC" label="Public" type="radio" id="type-1" defaultChecked
                onChange={(e) => { this.onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-private`}>
                  Private channel can be joined if they have channel invite link as well as if a channel admin adds him!
                </Tooltip>
              }
            >
              <Form.Check inline name="visibility" value="PRIVATE" label="Private" type="radio" id="type2"
                onChange={(e) => { this.onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-secret`}>
                  Secret channel can't be joined unless the channel admin manually adds the user!
                </Tooltip>
              }
            >
              <Form.Check inline name="visibility" value="RESTRICTED" label="Secret" type="radio" id="type-3"
                onChange={(e) => { this.onSelectChannelType(e.target.value) }}
              />
            </OverlayTrigger>

          </div>
        </Form.Group>

        <Form.Group className="text-right">
          <Button variant="outline-primary" type="submit">
            Next
          </Button>
        </Form.Group>
      </Form>
    );
  }
}

export default ChannelStep1;
