import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import { textEllipsis } from 'common/utils';
import './index.scss';

const evt = {
  currentTarget: {
    dataset: {
      action: 'unpin-message',
    },
  },
};

export class PinConversation extends Component {
  render() {
    return (
      <div className={`c-pin-msg ${this.props.className}`}>
        <Alert
          variant="info"
          data-action="unpin-message"
          onClose={e => this.props.events(evt, null, this.props)}
          dismissible
        >
          <span className="c-pin-msg--title">
            <i className="fas fa-thumbtack" /> Pinned By{' '}
            <a href={'/messages/' + this.props.id + '/details/'} data-mid={this.props.id}>
              @{this.props.username}
            </a>
          </span>
          {textEllipsis(this.props.message, 100)}
        </Alert>
      </div>
    );
  }
}

export default PinConversation;
