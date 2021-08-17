import React, { Component } from 'react';
import './index.scss';

export class SystemMessage extends Component {
  render() {
    return (
      <div className={'c-system-msg ' + this.props.className}>
        <div className="c-system-msg__container">
          <div className="c-system-msg__text">{this.props.text}</div>
        </div>
      </div>
    );
  }
}

export default SystemMessage;
