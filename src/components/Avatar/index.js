import './index.scss';

import { API } from 'common/constants';
import { randomColorCode } from 'common/utils/helper';
import PropTypes from 'prop-types';
import React from 'react';

const DEFAULT_AVATAR = name => {
  if (name) {
    return `${API.AVATAR}?name=${name}&s=32&background=${randomColorCode()}`;
  }
  return `${API.AVATAR}?name=ubblu&s=32&background=${randomColorCode()}`;
};

const CHANNEL_AVATAR = name => {
  return '/assets/images/icons/avatar-channel.png';
};
const CHANNEL_PRIVATE = name => {
  return '/assets/images/icons/avatar-lock.png';
};

const getAvatarImage = (param, name) => {
  switch (param) {
    case 'PERSONAL':
      return DEFAULT_AVATAR(name);
    case 'PRIVATE':
      return CHANNEL_PRIVATE();
    case 'CHANNEL':
      return CHANNEL_AVATAR();
    default:
      return DEFAULT_AVATAR(name);
  }
};

const AvatarTag = ({ tag, children, ...props }) => {
  const _tag = tag ? tag : 'a';
  return React.createElement(_tag, props, children);
};
const Avatar = props => (
  <AvatarTag
    tag={props.as}
    href={props.url || props.userid}
    className="c-avatar"
    data-variant={props.variant}
    onClick={props.onClick}
  >
    <img
      alt={props.alt}
      src={props.src ? props.src : getAvatarImage(props.type, props.alt)}
      className={props.className}
      role="presentation"
    />
    {props.presenceShow && <span className={`c-avatar-presence c-avatar-presence--${props.presenceStatus}`} />}
  </AvatarTag>
);

Avatar.propTypes = {
  as: PropTypes.string,
  url: PropTypes.string.isRequired,
  userid: PropTypes.any,
  variant: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  presenceShow: PropTypes.bool,
  presenceStatus: PropTypes.bool,
};

Avatar.defaultProps = {
  as: null,
  url: '/assets/images/icons/user-icon.png',
  userid: null,
  variant: null,
  alt: 'Avatar',
  className: null,
  presenceShow: false,
  presenceStatus: null,
  type: 'DEFAULT',
};

export default Avatar;
