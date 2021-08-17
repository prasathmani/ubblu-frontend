import './index.scss';

import React, { Component } from 'react';

import { Button } from 'react-bootstrap';
import ChannelStep1 from './channelStep1';
import ChannelStep2 from './channelStep2';
import UsersInvites from 'components/Manage/Invite';

class ChannelsAdd extends Component {
  state = {
    step: 1,
    btnName: 'Email Invites',
    channelId: 15,
  };

  setChannelId = id => {
    this.setState({
      channelId: id,
    });
  };

  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
    });
  };

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
    });
  };

  finalStep = () => {
    const { step } = this.state;
    this.setState({
      step: 4,
    });
  };

  handleChange = input => event => {
    this.setState({ [input]: event.target.value });
  };

  skipNow = () => {
    this.nextStep();
  };

  render() {
    const { step, btnName } = this.state;
    const btnExtra = (
      <Button variant="outline-primary" type="button" onClick={this.skipNow} className="mr-2">
        Skip for now
      </Button>
    );

    const steps = (
      <div>
        <ol className="cd-breadcrumb triangle">
          <li>
            <a href="#/step1">Step 1</a>
          </li>
          <li>
            <a href="#/step2">Step 2</a>
          </li>
          <li className="current">
            <a href="#/step3">Step 3</a>
          </li>
        </ol>
      </div>
    );

    switch (step) {
      case 1:
        return (
          <ChannelStep1
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            handleChange={this.handleChange}
            setChannel={this.setChannelId}
            channelId={this.state.channelId}
          />
        );
      case 2:
        return (
          <ChannelStep2
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            finalStep={this.finalStep}
            handleChange={this.handleChange}
            channelId={this.state.channelId}
          />
        );
      case 3:
        return (
          <UsersInvites
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            btnName={btnName} 
            btnExtra={btnExtra}
            steps={steps}
            channelId={this.state.channelId}
            variant='users'
            onSubmit={() => { this.nextStep() }}
          />
        );
      default:
        if(this.props.renderChannelsList) this.props.renderChannelsList();
        return <h4>Channel created successfully</h4>;
    }
  }
}

export default ChannelsAdd;
