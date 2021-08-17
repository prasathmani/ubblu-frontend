import React from 'react';
import './index.scss';

const StatusIcon = props => {
  return (
    <i
      className={'c-status-icon fas c-status-icon--' + props.type}
      type="presence-online"
      title={props.title}
      aria-hidden="true"
    />
  );
};

StatusIcon.defaultProps = {
  type: 'away',
  title: '',
};

export default StatusIcon;
